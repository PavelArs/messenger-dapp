const { formatEther } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Network configuration
  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  // Get deployer info
  const [deployer] = await hre.viem.getWalletClients();
  const deployerAddress = deployer.account.address;

  // Display account info
  const publicClient = await hre.viem.getPublicClient();
  const balance = await publicClient.getBalance({ address: deployerAddress });

  console.log(`Deploying from: ${deployerAddress}`);
  console.log(`Account balance: ${formatEther(balance)} ETH`);

  // Deploy contract
  console.log("\nDeploying Messenger contract...");
  const messenger = await hre.viem.deployContract("Messenger");

  console.log(`Messenger contract deployed to: ${messenger.address}`);
  console.log("Waiting for confirmations...");

  // Wait for confirmations (only for live networks)
  if (network !== "localhost" && network !== "hardhat") {
    await publicClient.waitForTransactionReceipt({
      hash: messenger.deploymentTransaction.hash,
      confirmations: 5,
    });
    console.log("Confirmed with 5 blocks!");

    // Verify the contract on Etherscan if API key exists
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\nVerifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: messenger.address,
          constructorArguments: [],
        });
        console.log("Contract verified on Etherscan!");
      } catch (error) {
        console.log("Error verifying contract:", error.message);
      }
    }
  }

  // Create .env file for the web
  console.log("\nDeployment information:");
  console.log(`CONTRACT_ADDRESS=${messenger.address}`);
  console.log(`NETWORK=${network}`);

  // Output deployment summary
  console.log("\nDeployment summary:");
  console.log(`- Network: ${network}`);
  console.log(`- Contract address: ${messenger.address}`);
  console.log(`- Deployer address: ${deployerAddress}`);
  console.log(
    `- Transaction hash: ${messenger.deploymentTransaction?.hash || "N/A"}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
