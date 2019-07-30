import React, { Component } from "react";
import BlogsContract from './contracts/Blogs.json'
import getWeb3 from "./utils/getWeb3";
import { setJSON, getJSON } from './utils/IPFS.js'

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
      blogsInstance: undefined,
      blogContent: undefined,
      supportAmount: undefined,
      blogs: [],
      value: '1',
      etherscanLink: "https://rinkeby.etherscan.io",
      account: null,
      web3: null
    }

    this.handleCreateBlog = this.handleCreateBlog.bind(this)
    this.handleBuyCoffee = this.handleBuyCoffee.bind(this)
    this.handleChange = this.handleChange.bind(this)
}

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BlogsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BlogsContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ blogsInstance: instance, web3: web3, account: accounts[0]})
      this.addEventListener(this)
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Handle form data change
  handleChange(event)
  {
      switch(event.target.name) {
          case "blogContent":
              this.setState({"blogContent": event.target.value})
              break;
          case "supportAmount":
              this.setState({"supportAmount": event.target.value})
              break;
          default:
              break;
      }
  }

  async handleCreateBlog(event)
  {
    console.log('whaaa')
    if (typeof this.state.blogsInstance !== 'undefined') {
      event.preventDefault();
      const ipfsHash = await setJSON({ blogContent: this.state.blogContent });
      let result = await this.state.blogsInstance.methods.createBlog(ipfsHash).send({from: this.state.account});
      this.setLastTransactionDetails(result)
    }
  }

  async handleBuyCoffee(row)
  {
    console.log('in', row.blog_id)
    if (typeof this.state.blogsInstance !== 'undefined') {
      let result = await this.state.blogsInstance.methods.buyCoffee(row.blog_id).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.value, 'ether')});
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

    this.state.blogsInstance.events.BlogCreated({fromBlock: 0, toBlock: 'latest'})
    .on('data', async function(event){
      var ipfsJson = {}
      try{
        ipfsJson = await getJSON(event.returnValues.data);
      }
      catch(e)
      {
        console.log(e)
      }

      if(ipfsJson.blogContent !== undefined)
      {
        event.returnValues['blogContent'] = ipfsJson.blogContent;
        event.returnValues['blogContent'] = ipfsJson.blogContent;
        event.returnValues['ipfsData'] = ipfsBaseUrl+"/"+event.returnValues.data;
      }
      else {
        event.returnValues['ipfsData'] = "none";
        event.returnValues['blogContent'] = event.returnValues['data'];
      }

      
      var newBlogssArray = component.state.blogs.slice()
      newBlogssArray.push(event.returnValues)
      component.setState({ blogs: newBlogssArray })
    })
    .on('error', console.error);
}

  render() {
    const options = {
      onRowClick: this.handleBuyCoffee
    }

    if (!this.state.web3) {
          return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
          <div className="App">
            <a href={this.state.etherscanLink} target="_blank">Last Transaction Details</a>
            <form onSubmit={this.handleCreateBlog}>
              {/* <div className="form-group"> */}
              <h3>New Blog</h3>
              <div>
                <textarea
                  name="blogContent"
                  value={this.state.blogContent}
                  style={{'width':'500px', 'height':'150px'}}
                  placeholder="Write your blog here"
                  onChange={this.handleChange}></textarea>
              </div>
              <br/>
              <br/>
                <button type="submit">Post Blog</button>
              {/* </div> */}
            </form>

                  <br/>
                  <h3>Click on blog's row to buy blogger a cup of coffee = 1 Ether</h3>
                  <BootstrapTable data={this.state.blogs} search={ true } options={ options } striped hover>
                    <TableHeaderColumn isKey dataField='blog_id' width='100'>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='blogger' width='150'>blogger</TableHeaderColumn>
                    <TableHeaderColumn dataField='ipfsData' width='150'>IPFS Data</TableHeaderColumn>
                    <TableHeaderColumn dataField='blogContent' tdStyle={ { whiteSpace: 'normal' } }>Blog Content</TableHeaderColumn>
                  </BootstrapTable>

                </div>
        );
    }
}

export default App;
