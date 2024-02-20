const dotenv = require('dotenv');
const ipfsClient = require('ipfs-http-client');
const { Contract, ethers } = require('ethers');
const forwarder = require('../artifacts/contracts/Forwarder.sol/Forwarder.json');
const main = require('../artifacts/contracts/AskGPT.sol/AskGPT.json');

const { forwarderAddress, contractAddress } = require('./constants');

// load env vars
dotenv.config({ path: './.env' });

// Base Goerli Testnet
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-test2.arthera.net'
);

let forwarderC, mainC;
let ipfs;

const initIpfs = async () => {
  const auth =
  `Basic ` +
  Buffer.from(
    process.env.PROJECT_ID + `:` + process.env.PROJECT_SECRET
  ).toString(`base64`);
  ipfs = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
}

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
    mainC,
    ipfs
  };
};

module.exports = {
  initializeBlockchain,
  provider,
  getMethods,
  initIpfs
};
