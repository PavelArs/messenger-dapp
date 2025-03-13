# Messenger DApp - Frontend

This is the frontend application for the Messenger DApp, a decentralized messaging platform built on Ethereum. Users can
send messages to any Ethereum address and view their messaging history in a chat-like interface.

## Features

- Connect your Ethereum wallet via RainbowKit UI
- Send messages to any Ethereum address
- View sent and received messages in a chat-like interface
- Real-time updates when new messages are sent
- Responsive design for mobile and desktop

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain Interaction**:
    - Wagmi v2 for React hooks
    - Viem for Ethereum interaction
    - RainbowKit v2 for wallet connection
- **State Management**: React hooks and context
- **Styling**: CSS Modules with modern styling patterns
- **Data Fetching**: TanStack Query (React Query)
- **Type Safety**: TypeScript throughout the application

## Repository Structure

- `/src`: Application source code
    - `/app`: Next.js App Router pages and layouts
        - `/messenger`: Messenger page with messaging functionality
    - `/components`: React components
        - `/messenger`: Messenger-specific components
        - `/ui`: Shared UI components
    - `/hooks`: Custom React hooks
    - `/types`: TypeScript type definitions
    - `/generated.ts`: Generated contract types from Wagmi CLI

## Available Scripts

```shell
# Development
npm run dev        # Start the Next.js development server

# Building
npm run build      # Build for production
npm run start      # Start production server

# Quality Checks
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run prettier   # Check formatting
npm run typecheck  # Run TypeScript type checking

# Code Generation
npm run generate   # Generate contract types with Wagmi CLI
```

## Smart Contract Integration

The application interacts with the Messenger smart contract deployed on Ethereum. The contract provides the following
functions:

- `sendMessage(address receiver, string content)`: Send a message to a recipient
- `getSentMessages()`: Get all messages sent by the user
- `getReceivedMessages()`: Get all messages received by the user
- `getAllMessages()`: Get all messages (sent and received)

## Getting Started

1. Ensure you're in the root of the monorepo and install all dependencies:
   ```
   yarn install
   ```

2. Start the Hardhat node from the root directory:
   ```
   yarn workspace @messenger-dapp/hardhat node
   ```

3. Deploy the contracts to the local network (in a separate terminal):
   ```
   yarn workspace @messenger-dapp/hardhat deploy:local
   ```

4. Start the Next.js development server:
   ```
   yarn workspace @messenger-dapp/nextjs dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

6. Connect your wallet using MetaMask or another Ethereum wallet

7. Navigate to the Messenger page to start sending and receiving messages

## Network Support

The application supports the following networks:

- **Development**: Hardhat local network
- **Test**: Monad testnet
- **Production**: Ethereum mainnet (planned)

## UI Components

- **Message Form**: Input for recipient address and message content
- **Message List**: Displays sent and received messages with timestamps
- **ConnectButton**: RainbowKit UI for wallet connection

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request