# Messenger DApp (Monorepo)

A decentralized messaging application built with Next.js, Wagmi, RainbowKit, and Solidity, organized as a monorepo with
separate packages for the frontend and smart contracts.

## Project Structure

This project is structured as a monorepo using npm workspaces:

```
messenger-dapp/
├── packages/
│   ├── contracts/    # Solidity smart contracts
│   │   ├── contracts/
│   │   ├── scripts/
│   │   └── test/
│   │
│   └── frontend/     # Next.js frontend application
│       ├── public/
│       └── src/
```

## Features

- Send and receive messages on the Ethereum blockchain
- Filter messages by sent, received, or all
- Real-time updates when messages are confirmed
- Supports local development with Hardhat and testnets
- Monorepo setup for better separation of concerns

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/messenger-dapp.git
cd messenger-dapp
```

2. Install dependencies (this will install dependencies for all packages):

```bash
npm install
```

3. Set up your environment variables:

```bash
cp .env.example packages/frontend/.env.local
```

Then edit `.env.local` with your own values for API keys.

## Local Development

You can run both the frontend and smart contract environments with a single command from the root directory:

```bash
npm run dev
```

This will:

- Start the Hardhat node (local blockchain)
- Start the Next.js development server

To deploy contracts to the local network:

```bash
npm run deploy:local
```

This will:

- Deploy the Messenger contract to your local Hardhat network
- Generate contract integration files for the frontend

Finally, open [http://localhost:3000](http://localhost:3000) with your browser.

### Setting Environment Variables

Set the environment to local in your `.env.local` file:

```
NEXT_PUBLIC_NETWORK=local
```

## Development Workflow

### Available Scripts

All commands can be run from the root directory:

```bash
# Development
npm run dev                # Run both frontend and contracts in development mode
npm run dev:frontend       # Run only frontend in development mode
npm run dev:contracts      # Run only contracts (Hardhat node)

# Building
npm run build              # Build both contracts and frontend
npm run build:frontend     # Build only frontend
npm run build:contracts    # Build only contracts

# Testing
npm run test               # Run all tests
npm run test:contracts     # Run contract tests

# Deployment
npm run deploy:local       # Deploy contracts to local network
```

### Working with Contracts Package

Navigate to the contracts package for more specialized commands:

```bash
cd packages/contracts

# Compile contracts
npm run compile

# Run contract tests
npm run test

# Clean artifacts
npm run clean

# Deploy to local network
npm run deploy:local

# Deploy using scripts/deploy.js
npm run deploy
```

### Working with Frontend Package

Navigate to the frontend package for specialized commands:

```bash
cd packages/frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format
```

## Using a Test Network

1. Update your `.env.local` to use a testnet (Sepolia):

```
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ALCHEMY_PROJECT_ID=your_alchemy_project_id
PRIVATE_KEY=your_wallet_private_key
```

2. Deploy to the Sepolia testnet:

```bash
npm run deploy:sepolia
```

This will:

- Deploy the contract to the Sepolia testnet
- Generate contract integration files for the frontend with the new address

## Smart Contract Functions

The Messenger contract provides these main functions:

- `sendMessage(address _receiver, string memory _content)`: Send a message to an address
- `getReceivedMessages()`: Get all messages received by the caller
- `getSentMessages()`: Get all messages sent by the caller
- `getAllMessages()`: Get all messages (both sent and received) for the caller

## Technologies

This project uses:

- **Monorepo Structure**: npm workspaces for managing multiple packages
- **Smart Contracts**: Solidity and Hardhat for contract development
- **Contract Deployment**: Hardhat Ignition for deterministic deployments
- **Frontend**: Next.js 15 with the App Router and Turbopack
- **Blockchain Integration**: Wagmi v2 and Viem for type-safe Ethereum interactions
- **Wallet Connection**: RainbowKit v2 for wallet connections
- **State Management**: TanStack Query for data fetching and caching
- **Styling**: Tailwind CSS for utility-first styling
- **Type Safety**: TypeScript throughout the project
- **Dev Experience**: ESLint and Prettier for code quality
