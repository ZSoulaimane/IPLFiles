import React,{  Component } from "react";
import SolidityDriveContract from "./contracts/SolidityDrive.json";
import getWeb3 from "./utils/getWeb3";
import { StyledDropZone } from "react-drop-zone";
import  FileIcon,{ defaultStyles } from "react-file-icon";
import "react-drop-zone/dist/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { Table } from "reactstrap";
import fileReaderPullStream from 'pull-file-reader';
import ipfs from './utils/ipfs';
import Moment from "react-moment";
import "./App.css";
import Download from './tools/download.png';
import { FaChevronDown } from "react-icons/fa";


export class App extends Component {
  state = { solidityDrive: [], web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SolidityDriveContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SolidityDriveContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getFiles);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getFiles = async () => {
    try {
      const { accounts, contract } = this.state;
      let filesLength = await contract.methods
        .getLength()
        .call({ from: accounts[0] });
      let files = [];
      for (let i = 0; i < filesLength; i++) {
        let file = await contract.methods.getFile(i).call({ from: accounts[0] });
        console.log(typeof file[4]);
        if (file[4]!=="1"){
          files.push(file);
        }

      }
      this.setState({ solidityDrive: files });
    } catch (error) {
     console.log(error);
    }
  };

  onDrop = async (file) => {
    try {

      //Part 1

      const {contract, accounts,solidityDrive} = this.state;
      const stream = fileReaderPullStream(file);
      const result = await ipfs.add(stream);
      const timestamp = Math.round(+new Date() / 1000);
      const type = file.name.substr(file.name.lastIndexOf(".")+1);
      console.log(solidityDrive);
      let hashfile = result[0].hash;

      //    **check if the balance is enough in the wallet**
      // let balance = await this.contract.getBalance().call()
      // console.log(balance);


      //    ** upload file while showing hash instead of amount**
      // let uploaded = await contract.methods
      //.add(result[0].hash, file.name, type, timestamp,hashfile )
      //.send({from: accounts[0], gas: 300000});

      // if we want to switch to more security and show hashes instead of amount 
      // we need to comment the part 2 and make some simple changes

      // part 2

      //    **take list of hashes from the essential object full of lists**
      let listhash = [];
      if(solidityDrive.length !== 0){
        for (let i = 0 ; i< solidityDrive.length ;i++){
          let tempfile = solidityDrive[i];
          listhash.push(tempfile[0]);
        }
      }

      //    **set of hashes to not repeat the same hash**
      let sethash = new Set(listhash);
      if (sethash.has(hashfile)){
        alert("Already exist");
      }

      // 
      else {
        let objtransaction = 1;
        let uploaded = await contract.methods
        .add(result[0].hash, file.name, type, timestamp,objtransaction)
        .send({from: accounts[0], gas: 1200000})
        .on('receipt',function(receipt){
          console.log(receipt.gasUsed);
          objtransaction=receipt.gasUsed;
        });
        console.log(uploaded);
        let x = await contract.methods
        .add(result[0].hash, file.name, type, timestamp,objtransaction)
        .send({from: accounts[0], gas: 0});
        console.log(x);

        //.then((response)=> {objtransaction=response;console.log(objtransaction);});

        this.getFiles();
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {solidityDrive} = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
       
      <div className="intro">
        <div className="containers" >
      
          <h1>SLK-Vault</h1>
          <h2>A safe and fast way to secure your large data files!</h2>
          <div className="container11">
            <a href="#edit" className="scrollb button"><FaChevronDown/></a>
          </div>
      </div>
      </div >
      <div id="edit" className="container2">
      <div className="container pt-3">
      
   
      <StyledDropZone className="dropZone"  onDrop={this.onDrop} />
        
        
      <Table striped bordered variant="dark" className="tbl">
        <thead className="theadr">
          <tr>
            <th width="7%" scope="row">
              Type
            </th>
            <th className="text-center">File Name</th>
            <th className="text-center">Date</th>
            <th className="text-center">Amount</th>
            <th className="text-center">Download</th>
          </tr>
        </thead>
        <tbody>
          {solidityDrive !== [] ? solidityDrive.map((item, key)=>(
            <tr>
            <th>
              <FileIcon
                size={40}
                extension={item[2]}
                {...defaultStyles[item[2]]}
              />
            </th>
            <th className="text-center">{item[1]}</th>
            <th className="text-center">
              <Moment format="YYYY/MM/DD" unix>{item[3]}</Moment>
            </th>
            {/* the item[4] could be the amount of money for the first case or the hash file for the second case */}

            {/*  <td>{item[4]}</td> */}

            <th className="text-center">{item[4]}</th>

            <th className="text-center"><a href={"https://ipfs.io/ipfs/"+item[0]}><img src={Download} className="logo"/></a></th>
          </tr>
          )) : null}
        </tbody>
      </Table>
    </div>
  </div>
            <div className="containerk">
            <p>© 2021 SLK-Vault.A safe and fast way to secure your large data files!</p>
            </div>
   </div>
    );
  }
}

export default App;