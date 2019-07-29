import React, { Component } from "react";
import BountiesContract from './contracts/Bounties.json'
import getWeb3 from "./utils/getWeb3";
import { setJSON, getJSON } from './utils/IPFS.js'

import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
// import HelpBlock from 'react-bootstrap/HelpBlock';
// import { Grid } from  'react-bootstrap/Gri';
import { Row } from  'react-bootstrap';
// import Panel from 'react-bootstrap/Panel'
// import Table from 'react-bootstrap/Table'

import "./App.css";

import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const etherscanBaseUrl = "https://rinkeby.etherscan.io"
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      bountiesInstance: undefined,
      bountyAmount: undefined,
      bountyData: undefined,
      bountyDeadline: undefined,
      bounties: [],
      etherscanLink: "https://rinkeby.etherscan.io",
      account: null,
      web3: null
    }

    this.handleIssueBounty = this.handleIssueBounty.bind(this)
    this.handleChange = this.handleChange.bind(this)
}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BountiesContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BountiesContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ bountiesInstance: instance, web3: web3, account: accounts[0]})
      // this.addEventListener(this)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    this.addEventListener(this)
  };

  // Handle form data change

  handleChange(event)
  {
      switch(event.target.name) {
          case "bountyData":
              this.setState({"bountyData": event.target.value})
              break;
          case "bountyDeadline":
              this.setState({"bountyDeadline": event.target.value})
              break;
          case "bountyAmount":
              this.setState({"bountyAmount": event.target.value})
              break;
          default:
              break;
      }
  }

  // Handle form submit

  // async handleIssueBounty(event)
  // {
  //   console.log(this.state)
  //   if (typeof this.state.bountiesInstance !== 'undefined') {
  //     event.preventDefault();
  // let result = await this.state.bountiesInstance.methods.issueBounty(this.state.bountyData,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
  //     this.setLastTransactionDetails(result)
  //   }
  // }

  async handleIssueBounty(event)
  {
    if (typeof this.state.bountiesInstance !== 'undefined') {
      event.preventDefault();
      const ipfsHash = await setJSON({ bountyData: this.state.bountyData });
      let result = await this.state.bountiesInstance.methods.issueBounty(ipfsHash,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
      this.setLastTransactionDetails(result)
    }
  }

  setLastTransactionDetails(result)
    {
    if(result.tx !== 'undefined')
    {
      this.setState({etherscanLink: etherscanBaseUrl+"/tx/"+result.tx})
    }
    else
    {
      this.setState({etherscanLink: etherscanBaseUrl})
    }
  }

  addEventListener(component) {

    this.state.bountiesInstance.events.BountyIssued({fromBlock: 0, toBlock: 'latest'})
    .on('data', async function(event){
      //First get the data from ipfs and add it to the event
      var ipfsJson = {}
      try{
        ipfsJson = await getJSON(event.returnValues.data);
      }
      catch(e)
      {

      }

      if(ipfsJson.bountyData !== undefined)
      {
        event.returnValues['bountyData'] = ipfsJson.bountyData;
        event.returnValues['ipfsData'] = ipfsBaseUrl+"/"+event.returnValues.data;
      }
      else {
        event.returnValues['ipfsData'] = "none";
        event.returnValues['bountyData'] = event.returnValues['data'];
      }

      var newBountiesArray = component.state.bounties.slice()
      newBountiesArray.push(event.returnValues)
      component.setState({ bounties: newBountiesArray })
    })
    .on('error', console.error);
}

  render() {
    if (!this.state.web3) {
          return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
          <div className="App">
                  
                  
                  {/* <a href={this.state.etherscanLink} target="_blank">Last Transaction Details</a> */}
                  
                
                  
                  <form onSubmit={this.handleIssueBounty}>
                      <div className="form-group"
                      >
                        <div className="form-control">
                          <label>Enter bounty data</label>
                          <textArea
                          name="bountyData"
                          value={this.state.bountyData}
                          placeholder="Enter bounty details"
                          onChange={this.handleChange}></textArea>
                        </div>
                        <br/>
          
                        <div className="form-control">
                          <label>Enter bounty deadline in seconds since epoch</label>
                          <input
                          type="text"
                          name="bountyDeadline"
                          value={this.state.bountyDeadline}
                          placeholder="Enter bounty deadline"
                          onChange={this.handleChange}
                          ></input>
                        </div>
                        <br/>
    
                        <div className="form-control">
                          <label>Enter bounty amount</label>
                          <input
                          type="text"
                          name="bountyAmount"
                          value={this.state.bountyAmount}
                          placeholder="Enter bounty deadline"
                          onChange={this.handleChange}
                          >
                          </input>
                        </div>
                        <br/>
                        <button type="submit">Issue Bounty</button>
                      </div>
                  </form>

                  <br/>

                  <BootstrapTable data={this.state.bounties} striped hover>
                    <TableHeaderColumn isKey dataField='bounty_id'>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='issuer'>Issuer</TableHeaderColumn>
                    <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
                    <TableHeaderColumn dataField='ipfsData'>Bounty Data</TableHeaderColumn>
                    <TableHeaderColumn dataField='bountyData'>Bounty Data</TableHeaderColumn>
                  </BootstrapTable>

                </div>
        );
    }
}

export default App;