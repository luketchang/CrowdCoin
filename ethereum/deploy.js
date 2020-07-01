const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const { MNEUMONIC } = require('../config');

const provider = new HDWalletProvider(
    MNEUMONIC,
    'https://rinkeby.infura.io/v3/118066d6af2e4e049b28a4fc4cc69eb5'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying from account: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                    .deploy({ data: compiledFactory.bytecode })
                    .send({ gas: '1000000', from: accounts[0] });
    
    console.log('Contract deployed to: ', result.options.address);
};
deploy();