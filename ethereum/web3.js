import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined') {
  // in browser with metamask
  web3 = new Web3(window.web3.currentProvider);
} else {
  // in server with no metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/118066d6af2e4e049b28a4fc4cc69eb5'
  );
  web3 = new Web3(provider);
}

export default web3;