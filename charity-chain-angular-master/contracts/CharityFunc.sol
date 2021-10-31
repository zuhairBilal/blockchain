pragma solidity >=0.5.0;

/**
 * @title CharityFunc
 * @dev The CharityFunc contract has the basic functionalities of the application, and provides user read ,display,request,approval
 * functions.
 */

import "./TokenFunc.sol";

contract CharityFunc is Token  {

    address payable owner;

/**
* @dev The structure 'godPeople' is for user information store.
*/

    struct godPeople {
        string name;
        string password;
        string emailId;
        address payable godAdd;
        string key;
    }

/**
* @dev userID & tokenRequestCount are counters for the number of user registrations & Token requests respectively.
*/

    uint16 public userID;
    uint16 public tokenRequestCount;

/**
* @dev The CharityFunc constructor sets the original `owner` of the contract to the sender
* account.
*/

    constructor() public {
        owner = msg.sender;
    }

    event regCheck(address payable _userAdd);
    event regSuccess(address payable _userAdd,string _name);

/**
* @dev userDonation is the mapping of key address with value type of godPeople structure.
*/

    mapping(address => godPeople) userDonation;

/**
* @dev 'peopleAdd' is an array to store the address of registered users.Inorder to not get in a out of gas exception 
* of dynamic arrays size we are given a limited amount of user for registration fixed to 50. 
*/

    address[50] public peopleAdd;
    
/**
* @dev 'requestedUser' is an array to store the address of users requesting for tokens.Inorder to not get in a out of gas exception 
* of dynamic arrays size we are given a limited amount of user for registration fixed to 10. 
*/
    
    address[10] public requestedUser;


/**
* @dev Allows the user to register for new account in our application and details will be saved saved blockchain using userDetails.
* @param _name The name of user.
* @param _password The password for user.
* @param _emailId The email for user.
* @param _key A key to identify which type of user is registering(1.Person,2.Charity,3.Goods vendor).
*/

    function userDetails(string memory _name,string memory _password,string memory _emailId,string memory _key) public {

        emit regCheck(msg.sender);

        require(userDonation[msg.sender].godAdd != msg.sender,"User already registered");
        require(userID<=50);

        userDonation[msg.sender].name = _name;
        userDonation[msg.sender].password = _password;
        userDonation[msg.sender].emailId = _emailId;
        userDonation[msg.sender].godAdd = msg.sender;
        peopleAdd[userID] = msg.sender;
        userDonation[msg.sender].key = _key;
        userID+=1;


        emit regSuccess(msg.sender,_name);
    }

/**
* @dev Allows the application to read information of registered user from blockchain.
* @param _readUser The address of the user to which the data to be displayed.
*/

    function readDetails(address _readUser) public view returns(string memory, string memory,string memory,string memory){

        return (userDonation[_readUser].name,userDonation[_readUser].emailId,userDonation[_readUser].password,userDonation[_readUser].key);
    }

/**
* @dev Allows the application to list all the registered users.
*/

    function arrayListGet() public view returns(address[50] memory) {
            return(peopleAdd);
    }

/**
* @dev requestToken is the mapping of key address with value uint256.
*/

    mapping(address => uint256) requestToken;

/**
* @dev Allows the user to request for HelpingHandTokens
* @param _token The amount of token needed by the user.
*/

    function userTokenRequest(uint256 _token) public {
        
        require(tokenRequestCount<=10,"Maximum token request achieved, Please try again later.");
        
        requestToken[msg.sender] = _token;
        requestedUser[tokenRequestCount] = msg.sender;
        tokenRequestCount+=1;
    }
    
/**
* @dev Allows the application to list all the Users requested for Tokens.
*/

    function tokenReqList() public view returns(address[10] memory) {
            return(requestedUser);
    }


/**
* @dev Allows the application to read information of token requested by each user from blockchain.
* @param _readUser The address of the user which requested for HelpingHand Token.
*/

    function tokenDetails(address _readUser) public view returns(uint256){

        return (requestToken[_readUser]);
    } 

/**
* @dev Allows the application to delete/remove information of token requested by each user from blockchain.
* @param _readUser The address of the user which requested for HelpingHand Token.
*/

    function tokenReverse(address _readUser) public returns(bool){

        requestToken[_readUser] = 0;
        for(uint8 i = 0;i<requestedUser.length;i++)   {
            if(_readUser == requestedUser[i])   {
                tokenRequestCount = i;
                requestedUser[i] = 0x0000000000000000000000000000000000000000;
            }
        }
        return true;
    }        
    

/**
* @dev Allows the owner to transfer tokens to requested user if conditions are met & delete the request from requestedUser[] 
* array.
* @param _userIn The address of the requested user.
*/

    function userApproval(address payable _userIn) payable public onlyOwner {
        transfer(_userIn,requestToken[_userIn]);
        requestToken[_userIn] = 0;
        for(uint8 i = 0;i<requestedUser.length;i++)   {
            if(_userIn == requestedUser[i])   {
                tokenRequestCount = i;
                requestedUser[i] = 0x0000000000000000000000000000000000000000;
            }
        }
    }
}