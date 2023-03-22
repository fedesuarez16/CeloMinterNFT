// Test file: test/MyNFT.test.js

const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MyNFT", function () {
  let MyNFT;
  let myNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    MyNFT = await ethers.getContractFactory("MyNFT");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    myNFT = await MyNFT.deploy([addr1.address, addr2.address], [1, 1]);
    await myNFT.deployed();
  });

  describe("mint", function () {
    it("should set the right owner", async function () {
      await myNFT.safeMint(addr1.address, "https://example.com/token/1");
      expect(await myNFT.ownerOf(0)).to.equal(owner.address);
    });

    it("should increase the token ID counter", async function () {
      const tokenIdBefore = await myNFT.tokenIdCounter();
      await myNFT.safeMint(addr1.address, "https://example.com/token/1");
      const tokenIdAfter = await myNFT.tokenIdCounter();
      expect(tokenIdAfter).to.equal(tokenIdBefore.add(1));
    });

    it("should set the token URI", async function () {
      await myNFT.safeMint(addr1.address, "https://example.com/token/1");
      expect(await myNFT.tokenURI(0)).to.equal("https://example.com/token/1");
    });

    it("should split the payment to payees", async function () {
      const value = ethers.utils.parseEther("1");
      await expect(() => myNFT.safeMint(addr1.address, "https://example.com/token/1", { value }))
        .to.changeEtherBalances([owner, addr1, addr2], [value.div(2).mul(-1), value.div(2), value.div(2)]);
    });

    it("should revert when payment amount is incorrect", async function () {
      const value = ethers.utils.parseEther("0.5");
      await expect(myNFT.safeMint(addr1.address, "https://example.com/token/1", { value }))
        .to.be.revertedWith("Payment amount is incorrect.");
    });
  });

  describe("paymentSplitter", function () {
    it("should return the payment splitter address", async function () {
      expect(await myNFT.paymentSplitter()).to.equal((await ethers.getContractAt("PaymentSplitter", myNFT.paymentSplitter())).address);
    });
  });
});
