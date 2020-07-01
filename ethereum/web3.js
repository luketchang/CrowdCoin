import Web3 from 'web3';
import { INFURA_LINK } from '../config';

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined') {
  // in browser with metamask
  web3 = new Web3(window.web3.currentProvider);
} else {
  // in server with no metamask
  const provider = new Web3.providers.HttpProvider(
    INFURA_LINK
  );
  web3 = new Web3(provider);
}

export default web3;