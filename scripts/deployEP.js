const hre = require("hardhat");

async function main() {
  const entryPoint = await hre.ethers.deployContract("EntryPoint");

  await entryPoint.waitForDeployment();

  console.log(`entryPoint deployed to ${entryPoint.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
