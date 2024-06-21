const hre = require("hardhat");

// sc nonces start at 1
const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const EP_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

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
  const initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  await entryPoint.depositTo(sender, {
    value: ethers.parseEther("100"),
  });

  const Account = await hre.ethers.getContractFactory("Account");
  const userOp = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    paymasterAndData: "0x",
    signature: "0x",
  };

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();

  console.log("Ops handled", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});