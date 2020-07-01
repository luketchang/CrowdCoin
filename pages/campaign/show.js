import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import { Link } from '../../routes';
import ContributeForm from '../../components/ContributeForm';
import web3 from '../../ethereum/web3';

class ShowCampaign extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        
        return {
            campaignAddress: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            contributerCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const { 
            minimumContribution, 
            balance,
            requestCount,
            contributerCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description: "The manager created this campaign and can create purchase requests.",
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (Wei)",
                description: "You must contribute at least this much wei to become a campaign contributer.",
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestCount,
                meta: "Number of Requests",
                description: "Managers make requests to use contribution money from their campaign. Contributers approve requests.",
                style: { overflowWrap: 'break-word' }
            },
            {
                header: contributerCount,
                meta: "Number of Contributers",
                description: "Number of people who have already donated to this campaign.",
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Campaign Balance",
                description: "How much money this campaign currently has left.",
                style: { overflowWrap: 'break-word' }
            }

        ];
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Show Campaign</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm campaignAddress={this.props.campaignAddress}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaign/${this.props.campaignAddress}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ShowCampaign;