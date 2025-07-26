const hre = require('hardhat');

async function main() {
  const FileRegistry = await hre.ethers.getContractFactory('FileRegistry');
  const contract = await FileRegistry.deploy();
  await contract.deployed();
  console.log('FileRegistry deployed to:', contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 