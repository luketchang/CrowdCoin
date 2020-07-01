import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

class NewRequest extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    };
    
    static async getInitialProps(props) {
        const address = props.query.address;

        return {
            campaignAddress: address
        };
    }

    submitRequest = async (event) => {
        event.preventDefault();
        this.setState({ loading: false, errorMessage: '' });

        const campaign = Campaign(this.props.campaignAddress);
        const accounts = await web3.eth.getAccounts();

        const { description, value, recipient } = this.state;

        try {
            this.setState({ loading: true });
            await campaign.methods.createRequest(
                description, 
                web3.utils.toWei(value, 'ether'), 
                recipient
            ).send({ from: accounts[0] });
        } catch(error) {
            this.setState({ errorMessage: error.message })
        }
        this.setState({ loading: false });
    }

    render() {
        return(
            <Layout>
                <Link route={`/campaign/${this.props.campaignAddress}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.submitRequest} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            placeholder="Description of new request..."
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Amount in Ether</label>
                        <Input
                            placeholder="Amount you need for request..."
                            label="ether"
                            labelPosition="right"
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            placeholder="Who you pay for your to fulfill your request..."
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value })}
                        />
                    </Form.Field>

                    <Button primary loading={this.state.loading}>Create</Button>
                    <Message error header='Oops!' content={this.state.errorMessage} />
                </Form>
            </Layout>
        );
    }
}

export default NewRequest;