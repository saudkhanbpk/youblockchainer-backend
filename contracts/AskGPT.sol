// contracts/AskGPT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AskGPT is Ownable {
    uint256 public marketFee = 25; // 2.5% (MarketPlace)

    constructor() {}

    function setMarketFee(uint256 _amount) public onlyOwner {
        marketFee = _amount;
    }

    function withdraw() public onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}
