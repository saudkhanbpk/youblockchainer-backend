const dotenv = require('dotenv');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

// load env vars
dotenv.config({ path: './.env' });

const privatekey = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.1',
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.2',
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    baseTestnet: {
      url: `https://goerli.base.org`,
      accounts: [`0x${privatekey}`],
      network_id: 84531,
    },
    polygonTestnet: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`0x${privatekey}`],
      network_id: 80001,
    },
    ethereumTestnet: {
      // Goerli
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
  etherscan: {
    apiKey: {
      // Basescan doesn't require an API key, however
      // Hardhat still expects an arbitrary string to be provided.
      baseTestnet: 'PLACEHOLDER_STRING',
    },
    customChains: [
      {
        network: 'baseTestnet',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org',
        },
      },
    ],
  },
};
