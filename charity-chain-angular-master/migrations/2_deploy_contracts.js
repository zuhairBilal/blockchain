
var CharityFunc = artifacts.require("./CharityFunc.sol");

/**
* @dev We are deploying our contract to Blockchain.
*/

module.exports = function(deployer) {
  
  deployer.deploy(CharityFunc);
};
