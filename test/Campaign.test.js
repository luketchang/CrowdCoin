const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json');

// get local accounts
// deploy factory contract
// create new instance of campaign using deployed factory
// get address of new campaign deployed through factory
// give compiled contract code to address of new campaign?

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' })

    await factory.methods.createCampaign('100')
        .send({ from: accounts[0], gas: 1000000 });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaign', () => {
    it('deploys a factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks the creator of the campaign as the manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it('allows contributers to join the campaign', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '1000'
        });

        const contributerCount = await campaign.methods.contributerCount().call();
        const isContributer = await campaign.methods.contributers(accounts[1]).call()

        assert(isContributer);
        assert.equal(1, contributerCount);
    });

    it('requires a minimum contribution amount', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '1'
            });
            assert(false);
        } catch(error) {
            assert(error);
        }
    });

    it('allows manager to create request', async () => {
        await campaign.methods
            .createRequest('buy food', '100', accounts[2])
            .send({ from: accounts[0], gas: '1000000' });
        
        const request = await campaign.methods.requests(0).call();
        assert.equal('buy food', request.description);
        assert.equal('100', request.value);
        assert.equal(accounts[2], request.recipient);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('buy food', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({ from: accounts[0], gas: '1000000' });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        console.log(balance);
        assert(balance > 103);
    });
});
