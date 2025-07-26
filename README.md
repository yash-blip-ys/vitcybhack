# File Registry Blockchain System

A modern, secure, and tamper-proof file upload and verification platform using Ethereum, IPFS, and MongoDB. Easily upload, verify, and audit files with a beautiful React frontend and robust Node.js backend.

---

## 🚀 Features
- **Decentralized File Registry:** Store file hashes on Ethereum for immutability
- **IPFS Integration:** Decentralized file storage (via Infura IPFS)
- **MongoDB Storage:** Metadata and access control
- **Audit Trail:** View all registered files
- **Modern UI:** Responsive, user-friendly React frontend
- **Secure Access:** Access keys and SHA-256 hashing

---

## 🏗️ Project Structure
- `smart_contract/` — Solidity contract & Hardhat deployment
- `backend/` — Node.js/Express API, MongoDB, IPFS, contract integration
- `frontend/` — React UI (modern, responsive)

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd cyber hackathon
```

### 2. Deploy the Smart Contract
```bash
cd smart_contract
npm install
# For Sepolia testnet:
npm run deploy
# For local Ganache:
npm run deploy:local
```
- Copy the deployed contract address for backend setup.

### 3. Configure Environment Variables
Create a `.env` file in `backend/` with:
```
INFURA_ETH_URL=your_infura_eth_url
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=deployed_contract_address
MONGODB_URI=your_mongodb_connection_string
INFURA_IPFS_PROJECT_ID=your_infura_ipfs_project_id
INFURA_IPFS_PROJECT_SECRET=your_infura_ipfs_project_secret
PORT=3001
```

### 4. Start the Backend
```bash
cd ../backend
npm install
npm start
```

### 5. Start the Frontend
```bash
cd ../frontend
npm install
npm start
```
- The app runs at [http://localhost:3000](http://localhost:3000)

---

## 🛠️ API Endpoints
- `POST /api/submit` — Upload a file
- `POST /api/verify` — Verify a file
- `POST /api/access` — Access a file (with key)
- `GET /api/audit` — List all registered files

---

## 📝 Usage
- **Upload:** Select a file and metadata, upload via the UI
- **Verify:** Upload a file to check if it’s registered
- **Audit:** View all registered file hashes
- **Access:** Download a file with the correct access key

---

## 🧩 Tech Stack
- **Smart Contract:** Solidity, Hardhat, Ethers.js
- **Backend:** Node.js, Express, Mongoose, IPFS (Infura)
- **Frontend:** React, Axios, Modern CSS
- **Database:** MongoDB (Atlas or local)

---

## 🐞 Troubleshooting
- **500 Internal Server Error:** Check backend logs for missing env vars or contract issues
- **Contract Not Found:** Ensure the contract address in `.env` matches the deployed address
- **IPFS Upload Fails:** Check Infura IPFS credentials
- **MongoDB Errors:** Verify your `MONGODB_URI`

---

## 📄 License
MIT

---

## 🙏 Credits
- Built for Cyber Hackathon
- Powered by Ethereum, IPFS, MongoDB, and React 
