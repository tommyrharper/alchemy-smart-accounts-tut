const hre = require("hardhat");

// sc nonces start at 1
const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const EP_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const PM_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

/// @dev make sure to change this appropriately!!!
const IS_FIRST_RUN = true;

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  // CREATE: hash(deployer + nonce)
  // CREATE2: hash(0xFF + deployer + bytecode + salt)

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  let initCode;
  if (IS_FIRST_RUN) {
    // init code is needed if the account hasn't been deployed yet
    initCode =
      FACTORY_ADDRESS +
      AccountFactory.interface
        .encodeFunctionData("createAccount", [address0])
        .slice(2);

    // the entry point will also need funds to pay for the deposit
    await entryPoint.depositTo(PM_ADDRESS, {
      value: ethers.parseEther("100"),
    });
  } else {
    initCode = "0x";
  }

  console.log("sender", sender);

  // const signature = signer0.signMessage(
  //   hre.ethers.getBytes(hre.ethers.id("wee"))
  // );

  const Account = await hre.ethers.getContractFactory("Account");
  const userOp = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 800_000,
    verificationGasLimit: 800_000,
    preVerificationGas: 200_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x",
  };

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();

  console.log("Ops handled", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
