// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";
import {ChainCartPayment} from "../src/ChainCart.sol";

contract ChainCartTest is Test {
    ChainCartPayment public payment;
    address payable public merchant = payable(address(0x1));
    address payable public buyer = payable(address(0x2));

    function setUp() public {
        // Deploy contract as merchant
        vm.prank(merchant);
        payment = new ChainCartPayment();
        
        // Fund buyer account
        vm.deal(buyer, 10 ether);
    }

     function testProcessPayment() public {
        uint256 orderId = 12345;
        uint256 paymentAmount = 0.5 ether;
        
        // Make payment as buyer
        vm.prank(buyer);
        payment.processPayment{value: paymentAmount}(orderId);
        
        // Check payment was processed
        assertTrue(payment.isOrderProcessed(orderId));
        assertEq(address(payment).balance, paymentAmount);
    }
     function testWithdraw() public {
        uint256 orderId = 12345;
        uint256 paymentAmount = 0.5 ether;
        
        // Make payment as buyer
        vm.prank(buyer);
        payment.processPayment{value: paymentAmount}(orderId);
        
        // Record merchant balance before withdrawal
        uint256 merchantBalanceBefore = merchant.balance;
        
        // Withdraw as merchant
        vm.prank(merchant);
        payment.withdraw();
        
        // Check merchant received funds
        assertEq(merchant.balance, merchantBalanceBefore + paymentAmount);
        assertEq(address(payment).balance, 0);
    }

}
