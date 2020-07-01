import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, CardGroup, Button } from 'semantic-ui-react';
import Layout from'../components/Layout';
import { Link } from '../routes';
import Campaign from '../ethereum/campaign';

class CampaignIndex extends Component {
    state = {
        campaigns: [],
        descriptionMap: {}
    }

    async componentDidMount() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        const descriptionMap = new Map();
        await Promise.allSettled(campaigns.map(async address => {
            const campaign = Campaign(address);
            const description = await campaign.methods.campaignDescription().call();
            descriptionMap.set(address, description);
        }));

        this.setState({ campaigns: campaigns, descriptionMap: descriptionMap  });
    }
    
    renderCampaigns() {
        console.log(this.state.campaigns);
        console.log(this.state.descriptionMap);
        const items = this.state.campaigns.map(address => {
            return {
                header: this.state.descriptionMap.get(address),
                meta: address,
                description: (
                    <Link route={`/campaign/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route="/campaign/new">
                        <a>
                            <Button 
                                floated="right"
                                content="Create Campaign" 
                                icon="add" 
                                primary
                            />
                        </a>    
                    </Link>
                    
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;