const hre = require("hardhat");

const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACCOUNT_ADDR = "0x821bb71ae079ad528c092088a0f630086ee8eb20";
const PM_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

async function main() {
  // const code = await hre.ethers.provider.getCode(EP_ADDRESS);
  // console.log(code);

  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.count();
  console.log("count", count.toString());

  console.log(
    "account balance",
    (await hre.ethers.provider.getBalance(ACCOUNT_ADDR)).toString()
  );
  const ep = await await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const accountBalanceOnEP = await ep.balanceOf(ACCOUNT_ADDR);
  const paymasterBalanceOnEP = await ep.balanceOf(PM_ADDRESS);
  console.log("Account balance on EntryPoint", accountBalanceOnEP.toString());
  console.log(
    "Paymaster balance on EntryPoint",
    paymasterBalanceOnEP.toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
