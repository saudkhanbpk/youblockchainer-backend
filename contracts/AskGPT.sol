// contracts/AskGPT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AskGPT {
    // -------------- State Variables ------------
    uint256 public marketFee = 25; // 2.5% (MarketPlace)
    uint256 public agreementCount; // Number of Agreements
    address public creator;

    // -------------- Structs ---------------------
    struct AgreementData {
        address contractAddress;
        string data;
    }

    // --------------- Mappings ------------------
    mapping(uint256 => address) public agreements; // All Agreements
    mapping(address => uint256[]) public userAgreements; // Individual user agreements
    mapping(address => string) public agreementUri; // Agreement metadata
    mapping(uint256 => AgreementData) public agreementsData;

    // ---------------- Events -------------------
    event AgreementCreated(
        address indexed _firstParty,
        address indexed _secondParty,
        address _contractAddress,
        uint256 _timestamp
    );

    constructor() {
        creator = msg.sender;
    }

    receive() external payable {}

    fallback() external payable {}

    modifier onlyOwner() {
        require(msg.sender == creator, "Not the manager!");
        _;
    }

    // -------------- Agreement Functions ---------
    // Create Offer
    function createAgreement(
        string memory _agreementUri,
        uint256 _startsAt,
        string memory _name,
        address _secondParty
    ) public {
        agreementCount++;

        address newAgreement = (address)(
            new Agreement(
                msg.sender,
                _secondParty,
                agreementCount,
                _agreementUri,
                _startsAt,
                address(this),
                _name,
                marketFee,
                creator
            )
        );

        agreementUri[newAgreement] = _agreementUri;

        agreements[agreementCount] = newAgreement;
        agreementsData[agreementCount] = AgreementData(
            newAgreement,
            _agreementUri
        );

        userAgreements[msg.sender].push(agreementCount);
        userAgreements[_secondParty].push(agreementCount);

        emit AgreementCreated(
            msg.sender,
            _secondParty,
            newAgreement,
            block.timestamp
        );
    }

    // Get All Agreements
    function getAllAgreements()
        public
        view
        returns (AgreementData[] memory allAgreements)
    {
        AgreementData[] memory temp = new AgreementData[](agreementCount);

        for (uint256 i = 1; i < agreementCount + 1; i++) {
            temp[i - 1] = agreementsData[i];
        }

        return temp;
    }

    // Get Agreements by user
    function getUserAgreements(
        address _creator
    ) public view returns (AgreementData[] memory allCreatorAgreements) {
        uint256[] memory agreementIds = userAgreements[_creator];

        AgreementData[] memory temp = new AgreementData[](agreementIds.length);

        for (uint256 i = 0; i < agreementIds.length; i++) {
            temp[i] = agreementsData[agreementIds[i]];
        }

        return temp;
    }

    // -------------- Admin Functions -------------
    function setMarketFee(uint256 _amount) public onlyOwner {
        marketFee = _amount;
    }

    function withdraw() public onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}

contract Agreement {
    // ---------------- State Variables -------------------
    // Constructor set
    string name;
    uint256 marketFee;
    address agreementFactoryAddress;
    address creator;
    address manager;
    address secondParty;
    uint256 agreementId;
    string agreementUri;
    uint256 startsAt;

    // Set at contract end
    uint256 endsAt;

    uint256 milestoneCount;
    uint256 refundCount;

    // ---------------- Mappings -------------------
    mapping(uint256 => MilestoneInfo) public milestones; // All Milestones
    mapping(uint256 => RefundInfo) public refunds; // Refund requests

    // ---------------- Structs -------------------
    struct MilestoneInfo {
        string name;
        uint256 amount;
        string description;
        bool funded;
        bool paymentRequested;
        bool paid;
    }

    struct RefundInfo {
        uint256 milestoneId;
        uint256 amount;
        bool resolved;
    }

    // ---------------- Events -------------------
    event MilestoneAdded(uint256 indexed _milestoneId, string _name, uint256 _amount, uint256 _timestamp);
    event MilestoneUpdated(uint256 indexed _milestoneId, uint256 _timestamp);
    event MilestoneRemoved(uint256 indexed _milestoneId, uint256 _timestamp);
    event MilestoneFunded(uint256 indexed _milestoneId, uint256 _timestamp);
    event PaymentRequested(uint256 indexed _milestoneId, uint256 _timestamp);
    event MilestoneApproved(uint256 indexed _milestoneId, uint256 _timestamp);
    event RefundRequested(uint256 indexed _milestoneId, uint256 _amount, uint256 _timestamp);
    event RequestUpdated(uint256 indexed _requestId, uint256 _amount, uint256 _timestamp);
    event RefundGranted(uint256 indexed _requestId, uint256 _timestamp);

    constructor(
        address _firstParty, // Creator
        address _secondParty,
        uint256 _agreementCount,
        string memory _agreementUri,
        uint256 _startsAt,
        address _agreementFactory,
        string memory _name,
        uint256 _marketFee,
        address _creator
    ) {
        agreementId = _agreementCount;
        creator = _creator;
        manager = _firstParty;
        secondParty = _secondParty;
        agreementUri = _agreementUri;
        startsAt = _startsAt;
        agreementFactoryAddress = _agreementFactory;
        name = _name;
        marketFee = _marketFee;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Not the manager!");
        _;
    }

    modifier onlyReceiver() {
        require(msg.sender == secondParty, "Not the receiver!");
        _;
    }

    modifier onlyDisputeResolver() {
        require(
            msg.sender == manager || msg.sender == creator,
            "Not the dispute resolver!"
        );
        _;
    }

    function addMilestone(
        string memory _name,
        uint256 _amount,
        string memory _description
    ) public onlyManager {
        milestoneCount++;
        milestones[milestoneCount] = MilestoneInfo(
            _name,
            _amount,
            _description,
            false,
            false,
            false
        );

        emit MilestoneAdded(milestoneCount, _name, _amount, block.timestamp);
    }

    function updateMilestone(
        uint256 _milestoneId,
        string memory _name,
        uint256 _amount,
        string memory _description
    ) public onlyManager {
        require(!milestones[_milestoneId].funded, "Milestone already funded!");
        milestones[_milestoneId] = MilestoneInfo(
            _name,
            _amount,
            _description,
            false,
            false,
            false
        );

        emit MilestoneUpdated(_milestoneId, block.timestamp);
    }

    function removeMilestone(uint256 _milestoneId) public onlyManager {
        require(!milestones[_milestoneId].funded, "Milestone already funded!");
        delete milestones[_milestoneId];

        emit MilestoneRemoved(_milestoneId, block.timestamp);
    }

    function fundMilestone(uint256 _milestoneId) public payable onlyManager {
        uint256 marketFeeAmount = (msg.value * marketFee) / 1000;

        require(!milestones[_milestoneId].funded, "Milestone already funded!");
        require(
            msg.value >= (milestones[_milestoneId].amount + marketFeeAmount),
            "Amount sent does not match the specified amount + fees!"
        );

        payable(agreementFactoryAddress).transfer(marketFeeAmount);

        milestones[_milestoneId].funded = true;

        emit MilestoneFunded(_milestoneId, block.timestamp);
    }

    function requestPayment(uint256 _milestoneId) public onlyReceiver {
        require(milestones[_milestoneId].funded, "Milestone isn't funded!");
        require(!milestones[_milestoneId].paid, "Milestone already approved!");

        milestones[_milestoneId].paymentRequested = true;

        emit PaymentRequested(_milestoneId, block.timestamp);
    }

    function approveMilestone(uint256 _milestoneId) public payable onlyDisputeResolver {
        require(milestones[_milestoneId].funded, "Milestone isn't funded!");
        require(!milestones[_milestoneId].paid, "Milestone already approved!");

        milestones[_milestoneId].paid = true;
        payable(secondParty).transfer(milestones[_milestoneId].amount);

        emit MilestoneApproved(_milestoneId, block.timestamp);
    }

    function requestRefund(
        uint256 _milestoneId,
        uint256 _amount
    ) public onlyDisputeResolver {
        require(milestones[_milestoneId].funded, "Milestone isn't funded!");
        require(!milestones[_milestoneId].paid, "Milestone already approved!");
        require(
            _amount <= milestones[_milestoneId].amount,
            "Refund amount cannot be greater than the milestone amount!"
        );

        refunds[refundCount] = RefundInfo(_milestoneId, _amount, false);

        emit RefundRequested(_milestoneId, _amount, block.timestamp);
    }

    function updateRequest(
        uint256 _requestId,
        uint256 _amount
    ) public onlyDisputeResolver {
        require(!refunds[_requestId].resolved, "Request already resolved!");
        require(
            _amount <= milestones[refunds[_requestId].milestoneId].amount,
            "Refund amount cannot be greater than the milestone amount!"
        );

        refunds[_requestId].amount = _amount;
        
        emit RequestUpdated(_requestId, _amount, block.timestamp);
    }

    function grantRefund(uint256 _requestId) public payable onlyDisputeResolver {
        require(!refunds[_requestId].resolved, "Request already resolved!");
        
        refunds[_requestId].resolved = true;
        milestones[refunds[_requestId].milestoneId].amount -= refunds[_requestId].amount;
        payable(manager).transfer(refunds[_requestId].amount);

        emit RefundGranted(_requestId, block.timestamp);
    }
    
    function endContract() public onlyManager {
        endsAt = block.timestamp;
    }

    // Get All Milestones
    function getAllMilestones()
        public
        view
        returns (MilestoneInfo[] memory allMilestones)
    {
        MilestoneInfo[] memory temp = new MilestoneInfo[](milestoneCount);

        for (uint256 i = 1; i < milestoneCount + 1; i++) {
            temp[i - 1] = milestones[i];
        }

        return temp;
    }

    // Get All Refund requests
    function getAllRefundRequests()
        public
        view
        returns (RefundInfo[] memory allRequests)
    {
        RefundInfo[] memory temp = new RefundInfo[](refundCount);

        for (uint256 i = 1; i < refundCount + 1; i++) {
            temp[i - 1] = refunds[i];
        }

        return temp;
    }

    // Get Offer Summary
    function getAgreementSummary()
        public
        view
        returns (
            address,
            address,
            uint256,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            string memory,
            uint256,
            address
        )
    {
        return (
            manager,
            secondParty,
            agreementId,
            agreementUri,
            startsAt,
            endsAt,
            address(this).balance, // Escrow balance
            milestoneCount,
            refundCount,
            name,
            marketFee,
            creator
        );
    }
}
