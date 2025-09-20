async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hola Comunidad 👋");
  await greeter.waitForDeployment();

  console.log("Greeter desplegado en:", await greeter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
