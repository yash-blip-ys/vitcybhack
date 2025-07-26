# File Registry Blockchain System

## Overview
A secure, modular, and tamper-proof file upload and verification system using IPFS, MongoDB, and Ethereum blockchain (Sepolia/Ganache). Includes unified API and JSON format for easy integration.

## Structure
- `backend/` — Node.js/Express API, MongoDB, IPFS, contract integration
- `smart_contract/` — Solidity contract, Hardhat deployment
- `frontend/` — (to be added) React UI

## Setup
- Fill in `.env` in `backend/` with your Infura, MongoDB, and wallet details
- Deploy the contract using Hardhat in `smart_contract/`
- Start backend with `npm install && npm start` in `backend/`

## API
- `POST /api/submit` — Unified file upload
- `POST /api/verify` — File verification
- `GET /api/audit` — Audit trail

## Tech
- Solidity, Hardhat, Ethers.js
- Node.js, Express, Mongoose
- IPFS (Infura), MongoDB

--- 