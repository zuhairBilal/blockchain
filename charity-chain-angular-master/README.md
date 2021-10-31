# Charity-Chain

A Blockchain based charity dapp helping donations for Charity organizations.

This is a Dapp ( Decentralized application) build and deployed in Ethereum blockchain which helps Charity Organisations , Persons willing to help the Organsations and The vendors who provide goods to the organsations. We are introducing a token 'HelpingHandToken' for the transactions inside the application which can be bought in exchange of any currency. The symbol for the token is HHC. With the help of our application transactions will be secure, transparent and decentralized. We make sure the help is reaching right place in right time around the world.

"No one is useless in this world who lightens the burdens of another."
                                                        - Charles Dickens

COME JOIN US !! 

Steps to install the application and use.

1.Open terminal and make a new directory : 
    - mkdir charitychain

2.Open the folder :
    - cd charitychain

3.Initiate git inside the folder :
    - git init

4.Clone the application from our repository :
    - git clone https://gitlab.com/akshaysrinivas/charity-chain-angular

5.Open the folder :
    - cd charity-chain-angular

6.Install node_modules :
    - npm install

7.Remove old build file from the folder :
    - rm -rf build

8.Compile the contracts :
    - truffle compile

9.Run the ethereum client 'ganache-cli' in new terminal in same folder location.
    - ganache-cli

10.Step 9 is optional , we have an online Rinkeby clinet with Infura

11.If you are deploying the application in local machine , Link metamask with Local machine and add ganache accounts.If you are         willing to deploy the application in Rinkeby test network login in Rinkeby account in metamask.

12.For deploying in localmachine run :
    - truffle migrate --network development

13.Or deploying in Rinkeby network run :
    - truffle migrate --network rinkeby

14.Now big time , Run the application :
    - ng serve

15.Open browser :
    - https://localhost:4200
    
The Installation & Working Demo can be viewd in the youtube video linked below,

    - https://youtu.be/K763uQVgYAc

