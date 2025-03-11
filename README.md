# Messenger DApp

A decentralized messaging application built on Ethereum that allows users to send messages to any Ethereum address. This
monorepo contains both the smart contract and frontend components of the application.

## Overview

The Messenger DApp demonstrates how to build a decentralized application with:

- Solidity smart contracts for on-chain messaging
- Next.js frontend with wallet connection and blockchain interaction
- Hardhat for local development and contract deployment

## Repository Structure

This project is organized as a monorepo with two main packages:

- **Root Directory**: Contains the Solidity smart contracts, tests, and deployment scripts
- **`/frontend`**: Contains the Next.js web application that interacts with the smart contracts

## Smart Contract Features

The Messenger smart contract provides:

- Send messages to any Ethereum address
- Store message history on-chain
- Retrieve sent and received messages
- Track message counts

## Available Scripts (Root Directory)

```shell
# Development
npm run node         # Start a local Hardhat node
npm run compile      # Compile contracts
npm run clean        # Clean the build artifacts
npm run build        # Clean and compile contracts

# Testing
npm run test         # Run tests

# Deployment
npm run deploy:local # Deploy to local network using Ignition
npm run deploy       # Deploy to Sepolia testnet
```

## Deployment

The smart contracts are deployed to:

- **Local**: For development purposes using Hardhat's local node
- **Sepolia Testnet**: For testing in a public environment

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/messenger-dapp.git
   cd messenger-dapp
   ```

2. Install dependencies:

   ```
   npm install
   cd frontend
   npm install
   ```

3. Start the local Hardhat node:

   ```
   npm run node
   ```

4. In a separate terminal, deploy the contracts locally:

   ```
   npm run deploy:local
   ```

5. Start the frontend application:

   ```
   cd frontend
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to use the application

## Testing the Application

1. Connect your wallet using the Connect button
2. Enter a recipient address and message content
3. Click "Send Message" to send a message
4. View your sent and received messages in the Messages section

## Technologies Used

- **Smart Contracts**: Solidity, Hardhat, Ethers.js
- **Frontend**: Next.js, Wagmi, Viem, RainbowKit, React
- **Testing**: Mocha, Chai
- **Deployment**: Hardhat Ignition

## License

This project is licensed under the MIT License.
