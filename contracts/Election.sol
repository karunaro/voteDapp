pragma solidity >=0.4.20;

contract Election{
    
    //false: not voted 
    //true: voted
    //model a Candidate
    //struct for Candidates
    
    event Regestering_destination(uint256 destination_id,  string name, uint256 total_vote);
    event Voted(uint256 id);
    
    
    
    struct Destination{
        string name;
        uint256 vote_count;
        uint256 id;
    }
    
    
    
    
    
    uint256 constant public destination_count = 4 ;
    
    address public contractOwner;
    
    constructor()public {
        contractOwner = msg.sender;
        Destinations[0] = Destination("Mer",0,0);
        Destinations[1] = Destination("Montagne",0,1);
        Destinations[2] = Destination("Campagne",0,2);
        Destinations[3] = Destination("City-trip",0,3);
    }
    
    
    
    mapping(uint256 => Destination)public Destinations;
    mapping(address => bool) public voters;
    
    modifier onlyOwner(){
        require(contractOwner == msg.sender, "You are not authorised to proceed");
        _;
        
    }
    
    modifier already_voted(){
        require(voters[msg.sender] ==  false, 'The vote has already been casted');
        _;
    }
    
   
    
    //store Candidate    
    //fetch Candidate
    //store candidate count
    
    
    // FUNCTION TO vote
    function add_vote(uint256 _id) public already_voted(){
        require(_id >= 0 && _id < destination_count, "Invalid option");
        voters[msg.sender] = true;
        Destinations[_id].vote_count++;
        emit Voted(_id);
        // ,Candidates[_id].vote_count
    }
    
    
    

}

