import { ethers, network, artifacts } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log(`Deploying to network: ${network.name}`);

  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);

    // Deploy MockVerifier first (placeholder for real verifier)
    console.log("\n1. Deploying MockVerifier (placeholder)...");
    const MockVerifier = await ethers.getContractFactory("MockVerifier");
    const mockVerifier = await MockVerifier.deploy();
    await mockVerifier.waitForDeployment();

    const verifierAddress = await mockVerifier.getAddress();
    console.log(`MockVerifier deployed to: ${verifierAddress}`);

    // Set the verifier to return true for testing
    await mockVerifier.setValidProof(true);
    console.log("MockVerifier set to accept all proofs");

    // Deploy NoDoAnchor with the verifier address
    console.log("\n2. Deploying NoDoAnchor...");
    const NoDoAnchor = await ethers.getContractFactory("NoDoAnchor");
    const noDoAnchor = await NoDoAnchor.deploy(verifierAddress);
    await noDoAnchor.waitForDeployment();

    const noDoAnchorAddress = await noDoAnchor.getAddress();
    console.log(`NoDoAnchor deployed to: ${noDoAnchorAddress}`);

    // Get contract ABI for saving
    const noDoAnchorArtifact = await artifacts.readArtifact("NoDoAnchor");

    // Create deployment info
    const deploymentInfo = {
      address: noDoAnchorAddress,
      abiShort: noDoAnchorArtifact.abi,
      network: {
        name: network.name,
        chainId: network.config.chainId
      },
      verifier: {
        address: verifierAddress,
        type: "MockVerifier (placeholder)"
      },
      deployer: deployer.address,
      deployedAt: new Date().toISOString()
    };

    // Create deployments directory structure
    const deploymentsDir = path.join(__dirname, "../deployments", network.name);
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
    console.log(`   Network: ${network.name} (${network.config.chainId})`);
    console.log(`   Deployer: ${deployer.address}`);

    console.log(`\n🔄 To replace MockVerifier with real verifier:`);
    console.log(`   1. Generate real verifier using: snarkjs zkey export verifier`);
    console.log(`   2. Deploy the real verifier contract`);
    console.log(`   3. Call setVerifier() on NoDoAnchor with the new verifier address`);
    console.log(`   4. Update the deployment JSON with the new verifier info`);

  } catch (error: any) {
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