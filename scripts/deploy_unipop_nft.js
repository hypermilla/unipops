const { ethers } = require("hardhat");

async function main() {
    const UNIPOP = await ethers.getContractFactory("UNIPOP");
    
    // Start deployment, returning a promise that resolves to a contract object
    const unipop_nft = await UNIPOP.deploy();   
    console.log("Contract deployed to address:", unipop_nft.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });