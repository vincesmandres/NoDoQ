const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log(`Deploying to network: ${hre.network.name}`);

  try {
    // Get the deployer account
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    console.log(`Deploying with account: ${deployer.address}`);

    // Deploy MockVerifier first (placeholder for real verifier)
    console.log("\n1. Deploying MockVerifier (placeholder)...");
    const MockVerifier = await hre.ethers.getContractFactory("MockVerifier");
    const mockVerifier = await MockVerifier.deploy();
    await mockVerifier.deployed();

    const verifierAddress = mockVerifier.address;
    console.log(`MockVerifier deployed to: ${verifierAddress}`);

    // Set the verifier to return true for testing
    await mockVerifier.setValidProof(true);
    console.log("MockVerifier set to accept all proofs");

    // Deploy NoDoAnchor with the verifier address
    console.log("\n2. Deploying NoDoAnchor...");
    const NoDoAnchor = await hre.ethers.getContractFactory("NoDoAnchor");
    const noDoAnchor = await NoDoAnchor.deploy(verifierAddress);
    await noDoAnchor.deployed();

    const noDoAnchorAddress = noDoAnchor.address;
    console.log(`NoDoAnchor deployed to: ${noDoAnchorAddress}`);

    // Get contract ABI for saving
    const noDoAnchorArtifact = await hre.artifacts.readArtifact("NoDoAnchor");

    // Create deployment info
    const deploymentInfo = {
      address: noDoAnchorAddress,
      abiShort: noDoAnchorArtifact.abi,
      network: {
        name: hre.network.name,
        chainId: hre.network.config.chainId
      },
      verifier: {
        address: verifierAddress,
        type: "MockVerifier (placeholder)"
      },
      deployer: deployer.address,
      deployedAt: new Date().toISOString()
    };

    // Create deployments directory structure
    const deploymentsDir = path.join(__dirname, "../deployments", hre.network.name);
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment info to JSON file
    const deploymentPath = path.join(deploymentsDir, "NoDoAnchor.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log(`\n✅ Deployment completed successfully!`);
    console.log(`📄 Deployment info saved to: ${deploymentPath}`);

    // Print summary
    console.log(`\n📋 Deployment Summary:`);
    console.log(`   Verifier (Mock): ${verifierAddress}`);
    console.log(`   NoDoAnchor: ${noDoAnchorAddress}`);
    console.log(`   Network: ${hre.network.name} (${hre.network.config.chainId})`);
    console.log(`   Deployer: ${deployer.address}`);

    console.log(`\n🔄 To replace MockVerifier with real verifier:`);
    console.log(`   1. Generate real verifier using: snarkjs zkey export verifier`);
    console.log(`   2. Deploy the real verifier contract`);
    console.log(`   3. Call setVerifier() on NoDoAnchor with the new verifier address`);
    console.log(`   4. Update the deployment JSON with the new verifier info`);

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });