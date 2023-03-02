const { expect } = require("chai");

describe("MyNFT", function () {
  let MyNFT;
  let myNFT;
  let owner;
  let addr1;
  let addr2;
  const uri = "https://example.com/token";

  beforeEach(async function () {
    MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("should mint a new NFT and transfer 0.1 ETH to the contract owner", async function () {
    // Set the payment amount to 0.1 ETH
    const paymentAmount = ethers.utils.parseEther("0.1");

    // Call the safeMint function with the correct payment amount
    await expect(() =>
      myNFT.safeMint(addr1.address, uri, { value: paymentAmount })
    ).to.changeEtherBalance(owner, paymentAmount);

    // Check that the NFT was minted
    expect(await myNFT.totalSupply()).to.equal(1);
    expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
    expect(await myNFT.tokenURI(0)).to.equal(uri);
  });
});
