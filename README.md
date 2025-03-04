# Messenger DApp (Monorepo)

A decentralized messaging application built with Next.js, Wagmi, RainbowKit, and Solidity, organized as a monorepo with separate packages for the frontend and smart contracts.

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
cp .env.example .env.local
```

Then edit `.env.local` with your own values for API keys.

## Local Development with Hardhat

1. Set the environment to local in your `.env.local` file:

```
NEXT_PUBLIC_NETWORK=local
```

2. Start a local Hardhat node:

```bash
npm run node
```

3. In a new terminal, deploy the contract to the local network:

```bash
npm run deploy:local
```

This will:
- Deploy the Messenger contract to your local Hardhat network
- Update your `.env.local` file with the new contract address
- Generate contract integration files for the frontend

4. Start the Next.js development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Development Workflow

### Working with Contracts

The contracts package includes all the Solidity smart contracts and deployment scripts:

```bash
cd packages/contracts

# Compile contracts
npm run compile

# Run contract tests
npm run test

# Deploy to local network
npm run deploy:local

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### Working with Frontend

The frontend package includes the Next.js application:

```bash
cd packages/frontend

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
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
- **Frontend**: Next.js 14 with the App Router
- **Blockchain Integration**: Wagmi for Ethereum interactions
- **Wallet Connection**: RainbowKit for wallet connections
- **Type Safety**: TypeScript throughout the project
