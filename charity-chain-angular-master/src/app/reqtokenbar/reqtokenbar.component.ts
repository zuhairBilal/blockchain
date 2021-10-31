import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;

/**
* @dev Getting the artifacted for the deployed contract to 'hhccoin_artifacts'.
*/

const hhccoin_artifacts = require('../../../build/contracts/CharityFunc.json'); 

@Component({
  selector: 'app-reqtokenbar',
  templateUrl: './reqtokenbar.component.html',
  styleUrls: ['./reqtokenbar.component.css']
})
export class ReqtokenbarComponent implements OnInit {

  accounts: string[];
  hhcCoin: any;
  arrayList: any[] = []; //Used to store address of all token requested users.
  arrayJson: any[] = []; //Used to store the details of token requested users.
  owner: any;

  /**
* @dev 'model' is the structure of data we are dealing with the user requests.
*/

model = {
  reqtoken: 0,
  account: ''
};

/**
* @dev Initiating the Web3Services.
*/

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);

  }

  ngOnInit(): void {

    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(hhccoin_artifacts)
      .then((hhcCoinAbstraction) => {
        this.hhcCoin = hhcCoinAbstraction;
        this.hhcCoin.deployed().then(deployed => {
          console.log(deployed);
        });

      });
  }

/**
* @dev The function subscribe to find the available blockchain account address and save it to model.account.
*/

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.tokenRequests();
    });
  }


/**
* @dev The function call userTokenRequest function from the blockchain and transact the user token request to
* blockchain.
*/

async reqToken() {

  if (!this.hhcCoin) {
    this.setStatus('HelpingHandCoin is not loaded, unable to send transaction');
    return;
  }

/**
* @dev Putting the values received from frontend to model.
*/

  const reqtoken = this.model.reqtoken;

  this.setStatus('Your request is procssing... (please wait)');
  try {
    const deployedhhcCoin = await this.hhcCoin.deployed();

/**
* @dev userTokenRequest function is called with parameter amount of Tokens.
*/

    const transaction = await deployedhhcCoin.userTokenRequest.sendTransaction(reqtoken, {from: this.model.account});

    if (!transaction) {
      this.setStatus('Request failed!');
    } else {
      this.setStatus('Request complete!');
    }
  } catch (e) {
    console.log(e);
    this.setStatus('Error in user token request; see log.');
  }
}


/**
* @dev The function call tokenReqList function from the blockchain to get all the user address requested for
* HelpingHand Tokens.
*/

async tokenRequests() {
  console.log('Getting request details');

  try {
    const deployedhhcCoin = await this.hhcCoin.deployed();

/**
* @dev tokenReqList function is called.
*/

    const reqDetails = await deployedhhcCoin.tokenReqList.call();

/**
* @dev returnOwnership function is called to get the owner of the contract.
*/

    this.owner = await deployedhhcCoin.returnOwnership.call();
    
/**
* @dev Checking for requested user's addresses and saving the address to arrayList[].
*/

    for (var i = 0,j = 0; i < reqDetails.length; i++) {
      if (reqDetails[i] !== '0x0000000000000000000000000000000000000000') {
        this.arrayList[j++] = reqDetails[i];
      }
    }

/**
* @dev Getting all the details of requested address by calling tokenDetails and passing each address in arrayList[].
* The details are saved in an another array arrayJson[] which contains the JSON data of users.
*/

    for(var i=0,j=0;i<this.arrayList.length;i++)  {
       this.arrayJson[i] = await deployedhhcCoin.tokenDetails.call(this.arrayList[i]);
       this.arrayJson[i][1] = this.arrayList[i];

    }
  } 
  catch (e) {
    console.log(e);
    this.setStatus('Error getting token details; see log.');
  }
}


/**
* @dev The function gives toast notifications in application.
*/

setStatus(status) {
  this.matSnackBar.open(status, null, {duration: 3000});
}

  /**
* @dev The function set the model.reqtoken value with the received value from the frontend.
*/
  
setToken(e) {
  console.log('Setting tokenreq: ' + e.target.value);
  this.model.reqtoken = e.target.value;
}

/**
* @dev The function call tokenReverse function from the blockchain to reject all the user address requested for
* HelpingHand Tokens.
*/

async reject(e) {
  this.setStatus('Your request is procssing... (please wait)');
  try {
  const deployedhhcCoin = await this.hhcCoin.deployed();
  const reje = await deployedhhcCoin.tokenReverse.sendTransaction(e,  {from: this.model.account});
  if (!reje) {
    this.setStatus('Request failed!');
  } else {
    this.setStatus('Request complete!');
  }
} catch (e) {
  console.log(e);
  this.setStatus('Error in user token request; see log.');
}
}

/**
* @dev The function call userApproval function from the blockchain to accept all the user address requested for
* HelpingHand Tokens.
*/

async accept(e) {
  this.setStatus('Your request is procssing... (please wait)');
  try {
  const deployedhhcCoin = await this.hhcCoin.deployed();
  const reje1 = await deployedhhcCoin.userApproval.sendTransaction(e,  {from: this.model.account});
  if (!reje1) {
    this.setStatus('Request failed!');
  } else {
    this.setStatus('Request complete!');
  }
} catch (e) {
  console.log(e);
  this.setStatus('Error in user token request; see log.');
}
}

}
