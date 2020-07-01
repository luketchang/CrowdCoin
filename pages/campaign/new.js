import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router, Link } from '../../routes';

class NewCampaign extends Component {
    state = { 
        minimumContribution: '',
        description: '',
        errorMessage: '',
        loading: false
    }

    submitCampaign = async (event) => {
        event.preventDefault();
        this.setState({ errorMessage: '', loading: false });

        const accounts = await web3.eth.getAccounts();

        try {
            this.setState({ loading: true });
            await factory.methods.createCampaign(this.state.minimumContribution, this.state.description)
                .send({ from: accounts[0] });
            
            Router.pushRoute('/');
        } catch(error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ loading: false });
    }

    render() {
        return ( 
            <Layout>
                <h3>New Campaign</h3>
                <Form onSubmit={this.submitCampaign} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Campaign Description</label>
                        <Input 
                            placeholder='Description of your campaign...'
                            value={this.state.description}
                            onChange={event => 
                                this.setState({ description: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label='wei' 
                            placeholder='Minimum contribution to join campaign...'
                            labelPosition='right'
                            value={this.state.minimumContribution}
                            onChange={event => 
                                this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>

                    <Button primary loading={this.state.loading}>Create!</Button>
                    <Message error header='Oops!' content={this.state.errorMessage} />
                </Form>
            </Layout>
        );
    }
}

export default NewCampaign;