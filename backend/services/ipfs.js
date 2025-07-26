const { create } = require('ipfs-http-client');

const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: { authorization: auth }
});

async function uploadToIPFS(buffer) {
  const { cid } = await client.add(buffer);
  return cid.toString();
}

module.exports = { uploadToIPFS }; 