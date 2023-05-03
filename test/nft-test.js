// Import the necessary Hardhat objects
const { ethers } = require("hardhat");
const { expect } = require("chai");

// Start by defining the contract and some test variables
describe("MyNFT contract", function () {
  let myNFT;
  let owner;
  let addr1;
  let addr2;

  const uri1 = "https://example.com/nft/1";
  const uri2 = "https://example.com/nft/2";

  beforeEach(async function () {
    // Deploy the MyNFT contract and retrieve the owner address
    const MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    await myNFT.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();

    // Mint two NFTs to the owner's address
    await myNFT.safeMint(owner.address, uri1);
    await myNFT.safeMint(owner.address, uri2);
  });

  // Test the token count
  describe("getTokenCount()", function () {
    it("should return 2", async function () {
      expect(await myNFT.getTokenCount()).to.equal(2);
    });
  });

  // Test the token URIs
  describe("tokenURI()", function () {
    it("should return the correct URI for each token", async function () {
      expect(await myNFT.tokenURI(0)).to.equal(uri1);
      expect(await myNFT.tokenURI(1)).to.equal(uri2);
    });
  });

  // Test the setTokenURI function
  describe("setTokenURI()", function () {
    it("should allow the owner to update the token URI", async function () {
      const newUri = "https://example.com/nft/3";
      await myNFT.setTokenURI(0, newUri);
      expect(await myNFT.tokenURI(0)).to.equal(newUri);
    });

    it("should not allow non-owners to update the token URI", async function () {
      const newUri = "https://example.com/nft/3";
      await expect(myNFT.connect(addr1).setTokenURI(0, newUri)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should revert if the token ID does not exist", async function () {
      const newUri = "https://example.com/nft/3";
      await expect(myNFT.setTokenURI(2, newUri)).to.be.revertedWith(
        "Token ID does not exist"
      );
    });
  });
});
