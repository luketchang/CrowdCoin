import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends Component {

    approve = async () => {
        const { campaignAddress, id } = this.props;
        const campaign = Campaign(this.props.campaignAddress);
        const accounts = await web3.eth.getAccounts();

        await campaign.methods.approveRequest(id)
            .send({ from: accounts[0] });
    };

    finalize = async () => {
        const { campaignAddress, id } = this.props;
        const campaign = Campaign(this.props.campaignAddress);
        const accounts = await web3.eth.getAccounts();

        await campaign.methods.finalizeRequest(id)
            .send({ from: accounts[0] });
    };

    render() {
        const { Row, Cell } = Table;
        const { request, id, contributerCount } = this.props;
        const finalizeReady = request.approvalCount > contributerCount/2;

        return (
            <Row disabled={request.completed} positive={finalizeReady && !request.completed}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{`${request.approvalCount}/${contributerCount}`}</Cell>

                <Cell>
                    { request.completed ? null : (
                        <Button basic color="green" onClick={this.approve}>Approve</Button>
                    )}
                </Cell>
                    
                <Cell>
                    { request.completed ? null : (
                        <Button basic color="teal" onClick={this.finalize}>Finalize</Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;