const dotenv = require('dotenv');
const { Contract, ethers } = require('ethers');
const forwarder = require('../artifacts/contracts/Forwarder.sol/Forwarder.json');
const main = require('../artifacts/contracts/AskGPT.sol/AskGPT.json');

const { forwarderAddress, contractAddress } = require('./constants');

// load env vars
dotenv.config({ path: './.env' });

// Base Goerli Testnet
const provider = new ethers.providers.JsonRpcProvider(
  'https://goerli.base.org'
);

let forwarderC, mainC;

const initializeBlockchain = async () => {
  try {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(
      ethers.utils.formatEther(await provider.getBalance(wallet.address))
    );
    // Forwarder Object
    forwarderC = new Contract(forwarderAddress, forwarder.abi, wallet);
    // AskGPT Object
    mainC = new Contract(contractAddress, main.abi, wallet);
  } catch (err) {
    console.log(err);
  }
};

const getMethods = async () => {
  return {
    forwarderC,
    mainC
  };
};

module.exports = {
  initializeBlockchain,
  provider,
  getMethods,
};
