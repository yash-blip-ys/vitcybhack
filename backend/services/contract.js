const { ethers } = require('ethers');
const contractArtifact = require('../abi/FileRegistry.json'); // ABI after compilation
const contractABI = contractArtifact.abi; // Extract just the ABI array
const provider = new ethers.JsonRpcProvider(process.env.INFURA_ETH_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

async function logFileUpload(fileHash, ipfsCid, metadata) {
  const tx = await contract.logFileUpload(fileHash, ipfsCid, metadata);
  await tx.wait();
  return tx.hash;
}

async function verifyFile(fileHash) {
  try {
    // Ensure the hash is a valid bytes32 string
    if (!fileHash.startsWith('0x')) {
      fileHash = '0x' + fileHash;
    }
    // Pad the hash to 32 bytes if needed
    if (fileHash.length < 66) { // 0x + 64 characters
      fileHash = '0x' + fileHash.slice(2).padStart(64, '0');
    }
    return await contract.verifyFile(fileHash);
  } catch (error) {
    console.error('Error in verifyFile:', error);
    throw error;
  }
}

async function getAuditTrail() {
  return await contract.getAuditTrail();
}

module.exports = { logFileUpload, verifyFile, getAuditTrail }; 