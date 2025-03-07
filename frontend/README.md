# Messenger DApp - web Package

This is the web package for the Messenger DApp. It's built with Next.js 15, Wagmi, RainbowKit, and TypeScript.

## Features

- Next.js 15 with App Router and Turbopack
- Wagmi v2 and Viem for Ethereum interactions
- RainbowKit v2 for wallet connections
- TanStack Query for data management
- Tailwind CSS for styling
- TypeScript for type safety

## Available Scripts

```shell
# Development
npm run dev        # Start the Next.js development server
npm run format     # Format code with Prettier

# Building
npm run build      # Build for production
npm run start      # Start production server

# Quality Checks
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Repository Structure

- `/src`: Application source code
    - `/app`: Next.js App Router pages and layouts
    - `/components`: Reusable UI components
    - `/contracts`: Contract artifacts (auto-generated)
    - `/hooks`: Custom React hooks
    - `/lib`: Utility functions and configs
    - `/types`: TypeScript type definitions

## Local Development

1. Ensure the contracts package is running a local Hardhat node:
   ```
   cd ../contracts
   npm run dev
   ```

2. Deploy the contracts to the local network:
   ```
   npm run deploy:local
   ```

3. Start the Next.js development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see the app.

## Contract Integration

The contracts package automatically copies compiled contract artifacts to `/src/contracts` when the contracts are
compiled. This enables type-safe interaction with the smart contracts.