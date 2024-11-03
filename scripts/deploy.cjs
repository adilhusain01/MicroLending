const hre = require('hardhat');

async function main() {
  try {
    // Get the contract factory
    const LendingSystem = await hre.ethers.getContractFactory('LendingSystem');

    // Deploy the contract
    console.log('Deploying LendingSystem contract...');
    const lendingSystem = await LendingSystem.deploy();

    // Wait for deployment to finish
    // await lendingSystem.waitForDeployment();
    const contractAddress = await lendingSystem.address;

    console.log('LendingSystem contract deployed to:', contractAddress);
    console.log('Save this address for interaction script!');
  } catch (error) {
    console.error('Error during deployment:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
