const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");

async function main() {
  const ContractFactory = await ethers.getContractFactory("Messenger");

  console.log("Deploying contract...");
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`Contract deployed to: ${contractAddress}`);

  const networkName = network.name;
  console.log(`Network: ${networkName}`);

  const frontendContractsDir = path.join(
    __dirname,
    "../frontend/src/contracts",
  );
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  const artifactPath = path.join(
    __dirname,
    `../artifacts/contracts/Messenger.sol/Messenger.json`,
  );

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const deploymentData = {
    address: contractAddress,
    abi: artifact.abi,
  };

  fs.writeFileSync(
    path.join(frontendContractsDir, "Messenger.json"),
    JSON.stringify(deploymentData, null, 2),
  );

  const typechainSource = path.join(__dirname, "../typechain-types");
  const typechainDest = path.join(frontendContractsDir, "typechain-types");

  copyDirectoryRecursive(typechainSource, typechainDest);

  console.log("Deployment complete! Contract artifacts copied to frontend.");
}

function copyDirectoryRecursive(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
