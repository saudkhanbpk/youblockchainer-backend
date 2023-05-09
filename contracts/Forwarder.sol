// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @dev forwarder to be used together with an ERC2771 compatible contract. See {ERC2771Context}.
 */
contract Forwarder is Initializable,
                    UUPSUpgradeable,
                    ReentrancyGuardUpgradeable,
                    EIP712Upgradeable,
                    OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        // uint256 gas;
        uint256 nonce;
        bytes data;
    }

    bytes32 public constant _TYPE_HASH =
        keccak256("ForwardRequest(address from,address to,uint256 value,uint256 nonce,bytes data)");

    mapping(address => uint256) private _nonces;

    // make Forwarder contract can receive ETH
    receive() external payable {}

    function initialize() public payable initializer {
        // "constructor" code...
        // console.log("market msg.sender: %s", msg.sender);
        __ReentrancyGuard_init();
        __Ownable_init();
        __EIP712_init("Forwarder", "1.0");
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        newImplementation;
        require(msg.sender == owner(), "no auth");
    }

    function getNonce(address from) public view returns (uint256) {
        return _nonces[from];
    }

    function getEthSignedMessageHash(
        bytes32 _messageHash
    ) public pure returns (bytes32) {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }


    /// @notice Returns a hash of the given data, prepared using EIP712 typed data hashing rules.
    /// @param from origin sender
    /// @param to contract to call
    /// @param value send ETH value
    /// @param nonce from's nonce
    /// @param data encodewithselector contract call params
    /// @return digest hash digest
    function getDigest(
        address from,
        address to,
        uint256 value,
        uint256 nonce,
        bytes memory data
        ) public view returns (bytes32 digest) {
        digest = _hashTypedDataV4(
            keccak256(abi.encode(_TYPE_HASH, from, to, value, nonce, keccak256(data))));
    }

    function verify(ForwardRequest memory req, bytes memory signature) public view returns (bool) {
        bytes32 digest = getDigest(req.from, req.to, req.value, req.nonce, req.data);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(digest);
        // address signer = digest.recover(signature);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        address signer = ecrecover(ethSignedMessageHash, v, r, s);

        return _nonces[req.from] == req.nonce && signer == req.from;
    }

    /// @dev transferToken transfer token
    function transferToken(address token, address to, uint amount) external onlyOwner {
        if (amount == 0) {
            amount = IERC20(token).balanceOf(address(this));
        }
        if (amount > 0) {
            IERC20(token).transfer(to, amount);
        }
    }

    /// @dev transferETH transfer ETH
    function transferETH(address payable to, uint amount) external onlyOwner {
        if (amount == 0) {
            amount = address(this).balance;
        }
        if (amount > 0) {
            to.transfer(amount);
        }
    }

    function execute(ForwardRequest calldata req,  bytes memory signature)
        public
        payable
        nonReentrant
        returns (bytes memory)
    {
        require(verify(req, signature), "signature does not match");
        _nonces[req.from] = req.nonce + 1;

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = req.to.call{value: req.value}(
            abi.encodePacked(req.data, req.from)
        );
        // Validate that the relayer has sent enough gas for the call.
        // See https://ronan.eth.link/blog/ethereum-gas-dangers/
        // assert(gasleft() > req.gas / 63);
        require(success, "failed");
        return returndata;
    }

    function executeBatch(ForwardRequest[] calldata reqs,  bytes[] memory signatures)
        public
        payable
        nonReentrant
    {
        require(reqs.length == signatures.length, "length NOT equal");
        for (uint i = 0; i < reqs.length; i ++) {
            ForwardRequest memory req = reqs[i];
            bytes memory s = signatures[i];
            require(verify(req, s), "signature does not match");
            _nonces[req.from] = req.nonce + 1;

            // solhint-disable-next-line avoid-low-level-calls
            (bool success, ) = req.to.call{value: req.value}(
                abi.encodePacked(req.data, req.from)
            );
            // Validate that the relayer has sent enough gas for the call.
            // See https://ronan.eth.link/blog/ethereum-gas-dangers/
            // assert(gasleft() > req.gas / 63);
            require(success, "failed");
        }
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    // make contract can receive NFT
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
        operator;
        from;
        tokenId;
        data;
        return IERC721Receiver.onERC721Received.selector;
    }
}