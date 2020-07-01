pragma solidity >= 0.4.17;

/* Contract: CampaignFactory
 * _________________________
 *  - creators call on this contract to create new campaign
 *  - houses address of deployed campaigns
 *  - createCampaign function creates new campaign with msg.sender and minimum
 *  - getDeployedCampaigns returns list of deployed campaigns
 */
contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(msg.sender, minimum);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}

/* Contract: Campaign
 * _________________________
 *  - houses address of manager, minimum contribution amount, count of contributers
 *    map of addresses and true/false if entered as contributers, and list of request structs
 *  - request struct contains string description, amount of money to spend, address of recipient
 *    completed bool, number of approval votes, and map of addresses of approval voters
 *  - contribute() adds msg.sender to contributers mapping and increments count
 *  = createRequest() pushes newly instantiated request struct to requests list
 *  - approveRequest() checks that msg.sender is a contributer and has not yet voted for given request
 *      - if true, msg.sender added to requests approval mapping and requests approval account incremented
 *  - finalizeRequest() checks that > 1/2 of contributers approved request and that it hasn't been completed
 *      - if true, money in contract is transfered to address and completed marked true
 *  - getSummary() returns necessary information for specific campaign summary pagess
 */
contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool completed;
        
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    uint public contributerCount;
    mapping(address => bool) public contributers;
    Request[] public requests;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(address creator, uint minimum) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributers[msg.sender] = true;
        contributerCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            completed: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(contributers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (contributerCount/2));
        require(!request.completed);
        
        request.recipient.transfer(request.value);
        request.completed = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            contributerCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
}