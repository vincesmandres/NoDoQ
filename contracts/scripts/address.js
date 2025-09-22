const fs = require("fs");
const path = require("path");

function main() {
  const network = process.argv[2] || 'localhost';

  const deploymentPath = path.join(__dirname, "../deployments", network, "NoDoAnchor.json");

  try {
    if (!fs.existsSync(deploymentPath)) {
      console.error(`❌ No deployment found for network: ${network}`);
      console.error(`   Expected file: ${deploymentPath}`);
      console.error(`   Available networks: ${fs.readdirSync(path.join(__dirname, "../deployments")).join(', ')}`);
      process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

    console.log(`📋 NoDoAnchor Deployment Info (${network})`);
    console.log(`=====================================`);
    console.log(`Address: ${deployment.address}`);
    console.log(`Network: ${deployment.network.name} (Chain ID: ${deployment.network.chainId})`);
    console.log(`Deployer: ${deployment.deployer}`);
    console.log(`Deployed: ${new Date(deployment.deployedAt).toLocaleString()}`);
    console.log(`Block: ${deployment.blockNumber}`);
    console.log(`Verifier: ${deployment.verifier.address} (${deployment.verifier.type})`);

    // Also output in JSON format for programmatic use
    console.log(`\n📄 JSON:`);
    console.log(JSON.stringify({
      address: deployment.address,
      network: deployment.network.name,
      chainId: deployment.network.chainId,
      verifier: deployment.verifier.address
    }, null, 2));

  } catch (error) {
    console.error(`❌ Error reading deployment info:`, error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };