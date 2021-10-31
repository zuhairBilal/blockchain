import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;

/**
* @dev Getting the artifacted for the deployed contract to 'hhccoin_artifacts'.
*/

const hhccoin_artifacts = require('../../../build/contracts/CharityFunc.json');

@Component({
  selector: 'app-profilebar',
  templateUrl: './profilebar.component.html',
  styleUrls: ['./profilebar.component.css']
})

export class ProfilebarComponent implements OnInit {
  hhcCoin: any; //We are getting the artifacts for the contract in this variable 

/**
* @dev 'model' is the structure of data we are dealing with the user details.
*/

  model = {
    balance: 0,
    account: '',
    name: 5,
    password: '',
    email: 0,
    key: ''
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
          deployed.Transfer({}, (err, ev) => {
            console.log('Transfer event came in, refreshing balance');
            this.refreshBalance();
          });
        });

      });
  }

/**
* @dev The function subscribe to find the available blockchain account address and save it to model.account.
*/

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.model.account = accounts[0];
      this.refreshBalance();
      this.refreshDetails();
    });
  }

/**
* @dev The function call readDetails function from the blockchain to diplay all the details of 
* the logged in user.
*/

  async refreshDetails() {
    console.log('Getting user details');
  
    try {
      const deployedhhcCoin = await this.hhcCoin.deployed();
      console.log(deployedhhcCoin);
      console.log('Account', this.model.account);

/**
* @dev readDetails function is called with parameter account address.
*/
      
      const hhcCoinDetails = await deployedhhcCoin.readDetails.call(this.model.account);
      //console.log('return'+JSON.stringify(hhcCoinDetails));
      this.model.name = hhcCoinDetails[0];
      this.model.email = hhcCoinDetails[1];
      
/**
* @dev Displaying type of user based on the key received from details of user from blockchain.
*/
      
      if(hhcCoinDetails[3]=="1")  {
        this.model.key = "Person willing to donate for charty organisations";
      }
      else  if(hhcCoinDetails[3]=="2"){
        this.model.key = "Running a charity organisation(s).";
      }
      else  if(hhcCoinDetails[3]=="3"){
        this.model.key = "Authorized vendor for delivering good.";
      }
      else{
        this.model.key = "Our guest.Welcome to our big family. Please register your presense.";
      }
      this.model.password = hhcCoinDetails[2];
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting details.. See log.');
    }
  }

/**
* @dev The function call balanceOf function from the blockchain to update the balance of 
* the logged in user.
*/

  async refreshBalance() {
    console.log('Refreshing balance');
  
    try {
      const deployedhhcCoin = await this.hhcCoin.deployed();

/**
* @dev balanceOf function is called with parameter account address.
*/

      const hhcCoinBalance = await deployedhhcCoin.balanceOf.call(this.model.account);
      this.model.balance = hhcCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance.. see log.');
    }
  }

/**
* @dev The function gives toast notifications in application.
*/

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

}
