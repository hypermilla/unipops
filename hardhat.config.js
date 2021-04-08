/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("ethers");
require("ethereum-waffle");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: {
      compilers: [
        {
          version: "0.7.3"
        },
        {
          version: "0.6.12"
        }
      ]
   },
   defaultNetwork: "rinkeby",
   networks: {
      hardhat: {},
      rinkeby: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
}
