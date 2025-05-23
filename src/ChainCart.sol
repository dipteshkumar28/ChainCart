// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChainCartPayment {
    address public owner;
    mapping(uint256 => bool) public orderProcessed;

    event PaymentReceived(
        address indexed buyer,
        uint256 orderId,
        uint256 amount,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function processPayment(uint256 orderId) external payable {
        require(!orderProcessed[orderId], "Order already processed");
        require(msg.value > 0, "Payment amount must be greater than 0");

        orderProcessed[orderId] = true;
        emit PaymentReceived(msg.sender, orderId, msg.value, block.timestamp);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function isOrderProcessed(uint256 orderId) external view returns (bool) {
        return orderProcessed[orderId]; 
    }
}
