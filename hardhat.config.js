const dotenv = require('dotenv');
require('@nomiclabs/hardhat-waffle');

// load env vars
dotenv.config({ path: './.env' });

const privatekey = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      // optimizer: {
      //   enabled: true,
      //   runs: 200,
      // },
    },
  },
  networks: {
    polygonTestnet: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`0x${privatekey}`],
      network_id: 80001,
    },
    ethereumTestnet: { // Goerli
      url: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: [`0x${privatekey}`],
      network_id: 5,
    },
    ethereumMainnet: { 
      url: `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: [`0x${privatekey}`],
      network_id: 1,
    },
  },
};
