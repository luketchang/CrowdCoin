import React, { Component } from 'react';
import { Button, Form, Input, Message} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    submitContribution = async (event) => {
        event.preventDefault();
        this.setState({ errorMessage: '', loading: false });

        const accounts = await web3.eth.getAccounts();
        const campaign = await Campaign(this.props.campaignAddress);

        try {
            this.setState({ loading: true });
            await campaign.methods.contribute()
                .send({ 
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.value, 'ether')
                });

            Router.replaceRoute(`/campaign/${this.props.campaignAddress}`);
        } catch(error) {
            this.setState({ errorMessage: error.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Form onSubmit={this.submitContribution} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input 
                        label="ether"
                        placeholder="Amount you would like to contribute"
                        labelPosition="right"
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                    />
                </Form.Field>
                <Button primary loading={this.state.loading}>Contribute!</Button>
                <Message error header="Oops!" content={this.state.errorMessage} />
            </Form>
        );
    }
}

export default ContributeForm;