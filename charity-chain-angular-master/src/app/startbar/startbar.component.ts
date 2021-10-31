import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;

/**
* @dev Getting the artifacted for the deployed contract to 'hhccoin_artifacts'.
*/

const hhccoin_artifacts = require('../../../build/contracts/CharityFunc.json');

@Component({
  selector: 'app-startbar',
  templateUrl: './startbar.component.html',
  styleUrls: ['./startbar.component.css']
})
export class StartbarComponent implements OnInit {
  hhcCoin: any;
  arrayList: any[] = []; //Used to store address of all registered users.
  arrayJson: any[] = []; //Used to store all the details of users.
  charityList: any[] = []; //Used to store only the address of Charities.

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
* @dev The function call balanceOf function from the blockchain to update the balance of 
* the logged in user.
*/

  async refreshBalance() {
    console.log('Refreshing balance');
  
    try {
      const deployedhhcCoin = await this.hhcCoin.deployed();
      console.log(deployedhhcCoin);
      
/**
* @dev balanceOf function is called with parameter account address.
*/      

      const hhcCoinBalance = await deployedhhcCoin.balanceOf.call(this.model.account);
      this.model.balance = hhcCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

/**
* @dev The function call readDetails function from the blockchain to diplay all the details of 
* the logged in user.
*/

  async refreshDetails() {
    console.log('Getting user details');
  
    try {
      const deployedhhcCoin = await this.hhcCoin.deployed();

/**
* @dev readDetails function is called with parameter account address.
*/

      const hhcCoinDetails = await deployedhhcCoin.readDetails.call(this.model.account);

/**
* @dev arrayListGet function is called.
*/

      const peopleDetails = await deployedhhcCoin.arrayListGet.call();
      
/**
* @dev Checking for registered users addresses and saving the address to arrayList[].
*/

      for (var i = 0,j = 0; i < peopleDetails.length; i++) {
        if (peopleDetails[i] !== '0x0000000000000000000000000000000000000000') {
          this.arrayList[j++] = peopleDetails[i];
        }
      }

/**
* @dev Getting all the details of registered address by calling readDetails and passing each address in arrayList[].
* The details are saved in an another array arrayJson[] which contains the JSON data of users.
*/

      for(var i=0,j=0;i<this.arrayList.length;i++)  {
         this.arrayJson[i] = await deployedhhcCoin.readDetails.call(this.arrayList[i]);
         this.arrayJson[i][4] = await deployedhhcCoin.balanceOf.call(this.arrayList[i]);
         this.arrayJson[i][5] = this.arrayList[i];

/**
* @dev Checking for charity users addresses and saving the address to charityList[].
*/

         if(this.arrayJson[i][3] == "2")  {
          this.charityList[j++] = this.arrayJson[i];
         }
      }
      
      this.model.name = hhcCoinDetails[0];
      this.model.email = hhcCoinDetails[1];
      this.model.key = hhcCoinDetails[2];
      this.model.password = hhcCoinDetails[3];

/**
* @dev Checking if the logged in user is already registered or not.
*/

      if(this.model.password == '')  {
        this.setStatus('It seems you have not yet part of this marvellous family. Come on join in..');
      }
      else {
        this.setStatus('Welcome back '+ this.model.name + ' good to see you again !! :)');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting Details; see log.');
    }
  }

/**
* @dev The function gives toast notifications in application.
*/

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

}
