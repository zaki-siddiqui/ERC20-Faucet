const hre = require("hardhat");

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(
    "0xf02b4aAcF3A25229a9f168B9803d6f311697c761"
  );

  await faucet.deployed();

  console.log("Faucet contract deployed: ", faucet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// ERC20 COntract Address: 0xf02b4aAcF3A25229a9f168B9803d6f311697c761
// Faucet Contract Address: 0x86DDA49F89056A62412C71F514872Ca93777E853
