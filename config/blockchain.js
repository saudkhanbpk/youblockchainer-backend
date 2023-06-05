const dotenv = require('dotenv');
const { Contract, ethers } = require('ethers');
const forwarder = require('../artifacts/contracts/Forwarder.sol/Forwarder.json');

const { forwarderAddress } = require('./constants');

// load env vars
dotenv.config({ path: './.env' });

// Goerli Testnet
const provider = new ethers.providers.JsonRpcProvider(
  'https://goerli.base.org'
);

let forwarderC;

const initializeBlockchain = async () => {
  try {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(
      ethers.utils.formatEther(await provider.getBalance(wallet.address))
    );
    // Forwarder Object
    forwarderC = new Contract(forwarderAddress, forwarder.abi, wallet);
  } catch (err) {
    console.log(err);
  }
};

const getMethods = async () => {
  return {
    forwarderC
  };
};

module.exports = {
  initializeBlockchain,
  provider,
  getMethods,
};
