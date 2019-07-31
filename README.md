# Blogchain


Blogchain is a platform, Where bloggers can publish their blocks on the ethereum blockchain and get rewarded by readers sending them ether.


## What do we do!

Ownership, immutability and reward, is what we deliver.

As a reader you can navigate all blogs, search by keyword or blogger address and when ever you feel rich and generous, you can buy a blogger a cup of coffee to keep crafting awesome blogs.
Cup of coffee = sending 1 Ether to blogger

As a Blogger, post your great blogs and wait for readers feedback, a feedback in ether $_$

check out some of our users stories:

> Always hated being forced to pay for  
low quality articles, with blogchain I only  
support when sense great effort and   
a worthy blogger.  
        - Mark, reader


> I post my blogs on blogchain for two reasons:  
1- I am done with my content getting robbed,  
now my blogs are safe and sound on the Ethereum blockchain  
2- A reader can buy a cup of coffee with  
one click, THE POWER OF CRYPTO BABYYY!  
        - Khaled, blogger

### Stretch Requirements
Since storage on Ethereum is expensive, I used IPFS to store only an IPFS hash that I create when the blog is created, and which refer to the blog content on IPFS  
Note: This is only applicable when you use this project front-end. check App.js

### Installation

Locally, Blogchain requires 
- Truffle https://www.trufflesuite.com/docs/truffle/getting-started/installation
- Metamask

Get local environment ready: 
```sh
$ truffle compile
```

In a seperate terminal window
```sh
$ ganache-cli
```

Login to Metamask with the mnemonic generated by Ganache-cli and switch to localhost to get the funded accounts

```sh
$ truffle migrate
```

Start front end server:
```sh
$ cd client
$ npm install
$ cd node_modules/websocket install
$ rm -r .git/
$ cd ../..
$ npm audit fix
$ npm run start
```

### Use Case
  
1- Create a blog using account 1, confirm transaction on Metamask  
2- Switch to account 2, **because a blogger can't reward himself**  
3- Refresh the page  
4- Send ether from account 2 to account 1 by clicking the blog row, confirm transaction on Metamask  
5- Check balances  


### Deployment

Blogchain is currently deployed on Ropsten test network only:

| Tesnet |  Link  |
| ------ | ------ |
| Ropsten | https://ropsten.etherscan.io/address/0xa17f34912812608324d85d91f13e71e110327629 |

Note: I added the function getBlogByTd() to contract after deployment, which I added it for testing porpuses only, so it is not in the deployed contract.

### Testing

I wrote a simple test, but on executing it is throwing error:
 "VM Exception while processing transaction: invalid opcode"

 Note: you might need to downgrade your Node version in order to be able to run the Javascript test this is a truffle node issue


