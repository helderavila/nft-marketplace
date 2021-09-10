require("@nomiclabs/hardhat-waffle");
require("dotenv").config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: process.env.INFURA_URL,
      accounts: [],
    },
    mainnet: {
      url: process.env.INFURA_URL_MAINNET,
      accounts: [],
    },
  }
};
