const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Environment variable validation
const requiredEnvVars = ['PRIVATE_KEY', 'ALCHEMY_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease create a .env file with these variables:');
  console.error(`
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key  # Optional, for contract verification
  `);
  process.exit(1);
}

// Check ETH balance on Sepolia
async function checkBalance() {
  return new Promise((resolve, reject) => {
    exec('npx hardhat run --network sepolia scripts/check-balance.js', (error, stdout, stderr) => {
      if (error) {
        reject(`Error checking balance: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

// Deploy to Sepolia
async function deployToSepolia() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Deploying contract to Sepolia testnet...');
    exec('npx hardhat run --network sepolia scripts/deploy.js', (error, stdout, stderr) => {
      if (error) {
        reject(`Deployment error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

// Update contract address in frontend .env file
function updateFrontendEnv(contractAddress) {
  const frontendEnvPath = path.join(__dirname, '../../../frontend/.env.local');

  // Create or update .env.local file
  let envContent = '';

  // Read existing file if it exists
  if (fs.existsSync(frontendEnvPath)) {
    envContent = fs.readFileSync(frontendEnvPath, 'utf8');

    // Update contract address
    if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/g,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
    }

    // Update network
    if (envContent.includes('NEXT_PUBLIC_NETWORK=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_NETWORK=.*/g,
        'NEXT_PUBLIC_NETWORK=sepolia'
      );
    } else {
      envContent += '\nNEXT_PUBLIC_NETWORK=sepolia';
    }
  } else {
    // Create new file with required variables
    envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\nNEXT_PUBLIC_NETWORK=sepolia`;
  }

  // Write to file
  fs.writeFileSync(frontendEnvPath, envContent);
  console.log(`✅ Updated contract address in frontend .env.local file`);
}

// Main function
async function main() {
  try {
    console.log('🔍 Checking deployment account balance on Sepolia...');
    await checkBalance();

    // Deploy the contract
    const deployOutput = await deployToSepolia();
    console.log(deployOutput);

    // Extract contract address from deployment output
    const contractAddressMatch = deployOutput.match(/NEXT_PUBLIC_CONTRACT_ADDRESS=([0-9a-fA-Fx]+)/);
    if (contractAddressMatch && contractAddressMatch[1]) {
      const contractAddress = contractAddressMatch[1];
      console.log(`✅ Contract successfully deployed to ${contractAddress}`);

      // Update frontend env file
      updateFrontendEnv(contractAddress);

      console.log('\n🎉 Deployment complete! Next steps:');
      console.log('1. Verify your contract on Etherscan (if you provided an API key)');
      console.log('2. The frontend .env.local file has been updated with the new contract address');
      console.log('3. Rebuild the frontend to use the new contract: npm run build:frontend');
    } else {
      console.error('❌ Could not extract contract address from deployment output');
    }
  } catch (error) {
    console.error(`❌ ${error}`);
    process.exit(1);
  }
}

main();