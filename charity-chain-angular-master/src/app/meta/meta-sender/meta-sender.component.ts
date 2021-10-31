import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;

/**
* @dev Getting the artifacted for the deployed contract to 'hhccoin_artifacts'.
*/

const hhccoin_artifacts = require('../../../../build/contracts/CharityFunc.json');

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {
  accounts: string[];
  hhcCoin: any;

/**
* @dev 'model' is the structure of data we are dealing with the user details.
*/

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    name: 5,
    email: 0,
    key: ''
  };

  status = '';

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
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
    });
  }

/**
* @dev The function gives toast notifications in application.
*/

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

/**
* @dev The function call transfer function from the blockchain and make the token transaction between
* the logged in user and provided user address.
*/

  async sendCoin() {
    if (!this.hhcCoin) {
      this.setStatus('HelpingHandCoin is not loaded, unable to send transaction');
      return;
    }

/**
* @dev Putting the values received from frontend to model.
*/

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    console.log('Sending coins' + amount + ' to ' + receiver);

    this.setStatus('Initiating transaction... (please wait)');
    try {

      const deployedhhcCoin = await this.hhcCoin.deployed();
/**
* @dev Transfer function is called with parameters receiver & amount.
*/
      const transaction = await deployedhhcCoin.transfer.sendTransaction(receiver, amount, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
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
    console.log(deployedhhcCoin);
    console.log('Account', this.model.account);

/**
* @dev balanceOf function is called with parameter account address.
*/

    const hhcCoinBalance = await deployedhhcCoin.balanceOf.call(this.model.account);
    console.log('Found balance: ' + hhcCoinBalance);
    this.model.balance = hhcCoinBalance;
  } catch (e) {
    console.log(e);
    this.setStatus('Error getting balance; see log.');
  }
}

/**
* @dev The function set the model.amount value with the received value from the frontend.
*/

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

/**
* @dev The function set the model.receiver value with the received value from the frontend.
*/

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }

}
