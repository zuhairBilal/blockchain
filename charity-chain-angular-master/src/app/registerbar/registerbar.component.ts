import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;

/**
* @dev Getting the artifacted for the deployed contract to 'hhccoin_artifacts'.
*/

const hhccoin_artifacts = require('../../../build/contracts/CharityFunc.json');

@Component({
  selector: 'app-registerbar',
  templateUrl: './registerbar.component.html',
  styleUrls: ['./registerbar.component.css']
})
export class RegisterbarComponent implements OnInit {
  accounts: string[];
  hhcCoin: any;

/**
* @dev 'model' is the structure of data we are dealing with the user details.
*/

  model = {
    name: 5,
    password: '',
    email: 0,
    account: '',
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
* @dev The function call userDetails function from the blockchain and transact the input values to 
* blockchain.
*/

  async registerHHC() {

    if (!this.hhcCoin) {
      this.setStatus('HelpingHandCoin is not loaded, unable to send transaction');
      return;
    }

/**
* @dev Putting the values received from frontend to model.
*/

    const name = this.model.name;
    const password = this.model.password;
    const email = this.model.email;
    const key = this.model.key;

    console.log('Registering user' + name + email + key );

    this.setStatus('We are happy to have you here... (please wait)');
    try {
      const deployedhhcCoin = await this.hhcCoin.deployed();

/**
* @dev userDetails function is called with parameters name,password,email & key.
*/

      const transaction = await deployedhhcCoin.userDetails.sendTransaction(name, password, email , key,{from: this.model.account});

      if (!transaction) {
        this.setStatus('Registration failed!');
      } else {
        this.setStatus('Registration complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error in user registration; see log.');
    }
  }

/**
* @dev The function subscribe to find the available blockchain account address and save it to model.account.
*/

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
    });
  }

/**
* @dev The function gives toast notifications in application.
*/

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

/**
* @dev The function set the model.name value with the received value from the frontend.
*/
  
  setName(e) {
    console.log('Setting name: ' + e.target.value);
    this.model.name = e.target.value;
  }

/**
* @dev The function set the model.email value with the received value from the frontend.
*/
  
  setEmail(e) {
    console.log('Setting email: ' + e.target.value);
    this.model.email = e.target.value;
  }
  
/**
* @dev The function set the model.password value with the received value from the frontend.
*/

  setPassword(e) {
    this.model.password = e.target.value;
  }

/**
* @dev The function set the model.key value with the received value from the frontend.
*/

  setType(e) {
    console.log('Setting Type: ' + e.target.value);
    this.model.key = e.target.value;
  }
  
}