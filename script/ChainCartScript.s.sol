// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {ChainCartPayment} from "../src/ChainCart.sol";

contract DeployChainCart is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        ChainCartPayment payment = new ChainCartPayment();
        vm.stopBroadcast();

        console.log("ChainCartPayment deployed at:", address(payment));
    }
}
