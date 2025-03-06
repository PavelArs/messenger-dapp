const { formatEther } = require('viem');
const hre = require('hardhat');
require('dotenv').config();

async function main() {
  // Get network info
  const network = hre.network.name;
  console.log(`Checking balance on ${network} network...`);

  // Get wallet client and address
  const [wallet] = await hre.viem.getWalletClients();
  const address = wallet.account.address;

  // Get public client and balance
  const publicClient = await hre.viem.getPublicClient();
  const balance = await publicClient.getBalance({ address });
  const balanceInEth = formatEther(balance);

  console.log(`\nWallet address: ${address}`);
  console.log(`Balance: ${balanceInEth} ETH`);

  // Check if balance is too low
  if (parseFloat(balanceInEth) < 0.01) {
    console.warn('\n⚠️ WARNING: Your wallet balance is very low!');
    console.warn('You may not have enough ETH to deploy and interact with contracts.');
    
    if (network === 'sepolia') {
      console.log('\n💡 To get Sepolia testnet ETH, you can use a faucet:');
      console.log('- Alchemy Sepolia Faucet: https://sepoliafaucet.com/');
      console.log('- Infura Sepolia Faucet: https://infura.io/faucet/sepolia');
      console.log('- ChainLink Sepolia Faucet: https://faucets.chain.link/sepolia');
    }
  } else {
    console.log('\n✅ Balance is sufficient for deployment');
  }

  return {
    address,
    balance: balanceInEth
  };
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;