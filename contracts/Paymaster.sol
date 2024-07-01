// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster {
    function validatePaymasterUserOp(
        UserOperation calldata,
        bytes32,
        uint256
    ) external returns (bytes memory context, uint256 validationData) {
        // paymaster server generates the paymasterAndData
        // alchemy_requestPaymasterAndData
        // first 20 bytes: paymaster address
        // endData: decide what you want it to be
        // normally:
        // timePeriod => during which the userOp is valid
        // signature => some pk says it is willing to pay for the user op
        // userOp.paymasterAndData
        context = new bytes(0); // passed to the postOp method
        validationData = 0; // special value means no validation
    }

    function postOp(PostOpMode, bytes calldata, uint256) external {}
}
