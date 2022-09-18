const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Super Token Contract", function () {
  // Global vars
  let Token;
  let superToken;
  let owner;
  let address1;
  let address2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // Get the contract factory and the signer here
    Token = await ethers.getContractFactory("SuperToken");
    [owner, address1, address2] = await hre.ethers.getSigners();

    superToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await superToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of Token to the owner", async function () {
      const ownerBalance = await superToken.balanceOf(owner.address);
      expect(await superToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await superToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the block reward to the argument provided during the deployment", async function () {
      const blockReward = await superToken.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
        tokenBlockReward
      );
    });
  });

  describe("Transaction", function () {
    it("Should transfer tokens between accounts", async function () {
      //Transfer 50 tokens from owner to address1
      await superToken.transfer(address1.address, 50);
      const addr1Balance = await superToken.balanceOf(address1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from address1 to address2
      // We use .connect(singer) to send a transaction from another account.
      await superToken.connect(address1).transfer(address2.address, 50);
      const addr2Balance = await superToken.balanceOf(address2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender does not have enough tokens", async function () {
      const initialOwnerBalance = await superToken.balanceOf(owner.address);
      // Lets try to send 2 tokens from address1 (it has 0 token) to the owner (it has 1000000 tokens)
      // require will evaluate false and will revert the transaction
      await expect(
        superToken.connect(address1).transfer(owner.address, 2)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // balance of owner should not have changed
      expect(await superToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await superToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to address1
      await superToken.transfer(address1.address, 100);

      // Transfer another 200 tokens from owner to address2
      await superToken.transfer(address2.address, 200);

      // Check balances
      const finalOwnerBalance = await superToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(300));

      const address1Balance = await superToken.balanceOf(address1.address);
      expect(address1Balance).to.equal(100);

      const address2Balance = await superToken.balanceOf(address2.address);
      expect(address2Balance).to.equal(200);
    });
  });
});
