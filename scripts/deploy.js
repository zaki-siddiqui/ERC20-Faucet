const hre = require("hardhat");

async function main() {
  const SuperToken = await hre.ethers.getContractFactory("SuperToken");
  const superToken = await SuperToken.deploy(100000000, 50);

  await superToken.deployed();

  console.log("Super Token deployed: ", superToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xB22A43E1F1dBAD336ddFCb4D06dFA34CF8370ced
