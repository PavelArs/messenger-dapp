const { formatEther } = require('viem');
const hre = require('hardhat');
const { vars } = require('hardhat/config');
const { join } = require('path');
const { artifacts } = require('hardhat');

async function main() {
  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  const [deployer] = await hre.viem.getWalletClients();
  const deployerAddress = deployer.account.address;

  const publicClient = await hre.viem.getPublicClient();
  const balance = await publicClient.getBalance({ address: deployerAddress });

  console.log(`Deploying from: ${deployerAddress}`);
  console.log(`Account balance: ${formatEther(balance)} ETH`);

  console.log('\nDeploying Messenger contract...');
  const messenger = await hre.viem.deployContract('Messenger');

  console.log(`Messenger contract deployed to: ${messenger.address}`);
  console.log('Waiting for confirmations...');

  if (network !== 'localhost' && network !== 'hardhat') {
    // TODO TypeError: Cannot read properties of undefined (reading 'hash') on sepolia deploy
    await publicClient.waitForTransactionReceipt({
      hash: messenger.deploymentTransaction.hash,
      confirmations: 5
    });
    console.log('Confirmed with 5 blocks!');

    if (vars.get('ETHERSCAN_API_KEY')) {
      console.log('\nVerifying contract on Etherscan...');
      try {
        await hre.run('verify:verify', {
          address: messenger.address,
          constructorArguments: []
        });
        console.log('Contract verified on Etherscan!');
      } catch (error) {
        console.log('Error verifying contract:', error.message);
      }
    }
  }

  saveFrontendFiles(messenger);

  console.log('\nDeployment summary:');
  console.log(`- Network: ${network}`);
  console.log(`- Contract address: ${messenger.address}`);
  console.log(`- Deployer address: ${deployerAddress}`);
  console.log(
    `- Transaction hash: ${messenger.deploymentTransaction?.hash || 'N/A'}`
  );
}

function saveFrontendFiles(messenger) {
  const fs = require('fs');
  const contractsDir = join(__dirname, '..', 'frontend', 'src', 'contracts');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    join(contractsDir, 'contract-address.json'),
    JSON.stringify({ Messenger: messenger.address }, undefined, 2)
  );

  const MessengerArtifact = artifacts.readArtifactSync('Messenger');

  fs.writeFileSync(
    join(contractsDir, 'Messenger.json'),
    JSON.stringify(MessengerArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
