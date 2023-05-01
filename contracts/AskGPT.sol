// contracts/AskGPT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AskGPT is Ownable {
    // -------------- State Variables ------------
    uint256 public marketFee = 25; // 2.5% (MarketPlace)
    uint256 public agreementCount; // Number of Agreements

    // -------------- Structs ---------------------
    struct AgreementData {
        address contractAddress;
        string data;
    }

    // --------------- Mappings ------------------
    mapping(uint256 => address) public agreements; // All Agreements
    mapping(address => uint256[]) public userAgreements; // Individual user agreements
    mapping(address => string) public agreementUri; // Agreement metadata
    mapping(uint256 => AgreementData) public agreementsData;

    // ---------------- Events -------------------
    event AgreementCreated(address indexed _contractAddress, uint256 _timestamp);

    constructor() {}

    receive() external payable {}

    fallback() external payable {}

    // -------------- Agreement Functions ---------
    // Create Offer
    function createAgreement(
        string memory _agreementUri,
        uint256 _startsAt,
        uint256 _endsAt,
        uint256 _count,
        uint256 _price,
        address[] memory _communities,
        string memory _name
    ) public {
        agreementCount++;

        address newAgreement = (address)(
            new Agreement(
                msg.sender,
                agreementCount,
                _agreementUri,
                _startsAt,
                _endsAt,
                _count,
                _price,
                _communities,
                address(this),
                _name,
                marketFee
            )
        );

        agreementUri[newAgreement] = _agreementUri;

        agreements[agreementCount] = newAgreement;
        agreementsData[agreementCount] = AgreementData(newAgreement, _agreementUri);

        userAgreements[msg.sender].push(agreementCount);
        
        emit AgreementCreated(newAgreement, block.timestamp);
    }

    // Get Offers by user
    function getUserAgreements(
        address _creator
    ) public view returns (AgreementData[] memory allCreatorAgreemnts) {
        uint256[] memory agreementIds = userAgreements[_creator];

        AgreementData[] memory temp = new AgreementData[](agreementIds.length);

        for (uint256 i = 0; i < agreementIds.length; i++) {
            temp[i] = agreementsData[agreementIds[i]];
        }

        return temp;
    }

    // -------------- Admin Functions -------------
    function setMarketFee(uint256 _amount) public onlyOwner {
        marketFee = _amount;
    }

    function withdraw() public onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}

contract Agreement {
    string public name;
    uint256 public marketFee;

    address offerFactoryAddress;

    address manager;
    uint256 offerId;

    uint256 count;
    string offerUri;
    uint256 startsAt;
    uint256 endsAt;
    uint256 price;
    address[] communities;

    mapping(address => bool) claimedWalletAddresses; // User wallet addresses
    mapping(address => mapping(uint256 => bool)) claimedNfts; // User NFTs
    mapping(address => bool) public isTokenBurned;

    constructor(
        address _creator,
        uint256 offerCount,
        string memory _offerUri,
        uint256 _startsAt,
        uint256 _endsAt,
        uint256 _count,
        uint256 _price,
        address[] memory _communities,
        address _offerFactory,
        string memory _name,
        uint256 _marketFee){
    // ) ERC1155(_offerUri) {
        offerId = offerCount;
        manager = _creator;
        count = _count;
        offerUri = _offerUri;
        startsAt = _startsAt;
        endsAt = _endsAt;
        price = _price;
        communities = _communities;
        offerFactoryAddress = _offerFactory;
        name = _name;
        marketFee = _marketFee;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Not the creator of the offer!");
        _;
    }

    modifier onlyNftOwner(address _contractAddress, uint256 _tokenId) {
        if (communities.length == 0) {
            _;
        } else {
            IERC721 c1 = IERC721(_contractAddress);
            IERC1155 c2 = IERC1155(_contractAddress);
            require(
                c1.balanceOf(msg.sender) > 0 ||
                    c2.balanceOf(msg.sender, _tokenId) > 0,
                "Does not hold a valid NFT!"
            );
            _;
        }
    }

    modifier onlyValidCommunity(address _searchFor) {
        if (communities.length == 0) {
            _;
        } else {
            bool isFound = false;
            for (uint256 i = 0; i < communities.length; i++) {
                if (communities[i] == _searchFor) {
                    isFound = true;
                    break;
                }
            }
            require(isFound, "Not a valid community!");
            _;
        }
    }

    // function supportsInterface(
    //     bytes4 interfaceId
    // ) public view virtual override(ERC1155, ERC1155Receiver) returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }

    function burnNFT() public {
        require(!isTokenBurned[msg.sender], "Already burnt!");
        burn(msg.sender, offerId, 1);
        isTokenBurned[msg.sender] = true;
    }

    // Buy Single Token
    function buyOffer(
        address _contractAddress,
        uint256 _tokenId
    )
        public
        payable
        onlyValidCommunity(_contractAddress)
        onlyNftOwner(_contractAddress, _tokenId)
    {
        require(count > 0, "All offers claimed");
        require(msg.value >= price, "Ether sent does not match the price");
        require(block.timestamp >= startsAt, "Offer not started yet");
        require(block.timestamp <= endsAt, "Offer has ended");
        require(
            !claimedWalletAddresses[msg.sender],
            "Already claimed using this wallet"
        );
        if (communities.length != 0) {
            require(
                !claimedNfts[_contractAddress][_tokenId],
                "Already claimed using this NFT"
            );
            claimedNfts[_contractAddress][_tokenId] = true;
        }

        count--;
        claimedWalletAddresses[msg.sender] = true;

        uint256 marketFeeAmount = (msg.value * marketFee) / 1000;
        payable(offerFactoryAddress).transfer(marketFeeAmount);

        // Mint
        _mint(msg.sender, offerId, 1, "");
    }

    // Get Offer Summary
    function getOfferSummary()
        public
        view
        returns (
            address,
            uint256,
            uint256,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            string memory
        )
    {
        return (
            manager,
            offerId,
            count,
            offerUri,
            startsAt,
            endsAt,
            price,
            address(this).balance,
            name
        );
    }

    function withdraw(uint256 _amount) public onlyManager {
        require(
            _amount <= address(this).balance,
            "Not enough balance in the contract!"
        );
        address payable to = payable(msg.sender);
        to.transfer(_amount);
    }
}