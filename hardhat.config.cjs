require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    aia: {
      url: process.env.AIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
