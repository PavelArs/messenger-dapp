# Messenger DApp - Contracts Package

This package contains the Solidity smart contracts for the Messenger DApp. It uses Hardhat for development, testing, and
deployment.

## Features

- Messenger smart contract for on-chain messaging
- Hardhat for Ethereum development environment
- Viem for type-safe Ethereum interactions
- Hardhat Ignition for deployment

## Available Scripts

```shell
# Development
npm run dev          # Start a local Hardhat node
npm run node         # Alias for dev, starts a local Hardhat node
npm run compile      # Compile contracts
npm run clean        # Clean the build artifacts
npm run build        # Clean and compile contracts

# Testing
npm run test         # Run tests

# Deployment
npm run deploy:local # Deploy to local network using Ignition
npm run deploy       # Deploy using scripts/deploy.js
```

## Repository Structure

- `/contracts`: Smart contract source files
- `/test`: Test files for contracts
- `/ignition`: Hardhat Ignition deployment modules
- `/scripts`: Deployment scripts

## Local Development

1. Start the local Hardhat node:
   ```
   npm run dev
   ```

2. In a separate terminal, deploy the contracts:
   ```
   npm run deploy:local
   ```

3. The compiled contract artifacts will be automatically copied to the web package.
