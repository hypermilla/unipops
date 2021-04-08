async function main() {
    // We get the contract to deploy
    const UnipopPrizeStrategyContract = await ethers.getContractFactory("UnipopPrizeStrategy");
    const UnipopPrizeStrategy = await UnipopPrizeStrategyContract.deploy();
  
    console.log("UNIPOP POOL Prize Strategy deployed to:", UnipopPrizeStrategy.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });