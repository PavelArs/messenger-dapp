# Messenger DApp

A decentralized messaging application built on Ethereum that allows users to send messages to any Ethereum address. This
monorepo contains both the smart contract and frontend components of the application.

## Overview

The Messenger DApp demonstrates how to build a decentralized application with:

- Solidity smart contracts for on-chain messaging
- Next.js frontend with wallet connection and blockchain interaction
- Hardhat for local development and contract deployment

## Repository Structure

This project is organized as a monorepo with Yarn workspaces:

- **Root Directory**: Contains workspace configuration and shared tooling
- **`packages/hardhat`**: Contains the Solidity smart contracts, tests, and deployment scripts
- **`packages/nextjs`**: Contains the Next.js web application that interacts with the smart contracts

## Features

- Send messages to any Ethereum address
- Store message history on-chain
- View sent and received messages in a chat-like interface
- Connect with popular Ethereum wallets via RainbowKit
- Real-time updates when new messages are sent

## Available Scripts (Root Directory)

```shell
# Installation
yarn install         # Install all dependencies for all workspaces

# Development
yarn workspace @messenger-dapp/hardhat node         # Start a local Hardhat node
yarn workspace @messenger-dapp/hardhat deploy:local # Deploy to local network
yarn workspace @messenger-dapp/nextjs dev           # Start Next.js development server

# Quality Checks
yarn precommit       # Run lint-staged for pre-commit checks
```

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/messenger-dapp.git
   cd messenger-dapp
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Start the local Hardhat node:

   ```
   yarn workspace @messenger-dapp/hardhat node
   ```

4. In a separate terminal, deploy the contracts locally:

   ```
   yarn workspace @messenger-dapp/hardhat deploy:local
   ```

5. Start the frontend application:

   ```
   yarn workspace @messenger-dapp/nextjs dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to use the application

## Testing the Application

1. Connect your wallet using the Connect button
2. Enter a recipient address and message content
3. Click "Send Message" to send a message
4. View your sent and received messages in the Messages section

## Workspace-Specific Documentation

For more detailed information about each workspace, please refer to their respective README files:

- [Hardhat (Smart Contracts) Documentation](./packages/hardhat/README.md)
- [Next.js (Frontend) Documentation](./packages/nextjs/README.md)

## Technologies Used

- **Smart Contracts**: Solidity, Hardhat, Viem
- **Frontend**: Next.js, Wagmi, Viem, RainbowKit, React
- **Testing**: Mocha, Chai
- **Deployment**: Hardhat Ignition
- **Package Management**: Yarn Workspaces
- **Code Quality**: ESLint, Prettier, TypeScript
- **Git Hooks**: Husky, lint-staged

## License

This project is licensed under the MIT License.
