const hre = require("hardhat");

// Note: this is now the main deploy script, deployAF and deployEP not needed

async function main() {
  const entryPoint = await hre.ethers.deployContract("EntryPoint");

  await entryPoint.waitForDeployment();

  console.log(`entryPoint deployed to ${entryPoint.target}`);

  const af = await hre.ethers.deployContract("AccountFactory");

  await af.waitForDeployment();

  console.log(`AF deployed to ${af.target}`);

  const paymaster = await hre.ethers.deployContract("Paymaster");

  await paymaster.waitForDeployment();

  console.log(`Paymaster deployed to ${paymaster.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
