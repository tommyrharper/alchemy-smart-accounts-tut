const hre = require("hardhat");

const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACCOUNT_ADDR = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";

async function main() {
  // const code = await hre.ethers.provider.getCode(EP_ADDRESS);
  // console.log(code);

  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.count();
  console.log("count", count.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
