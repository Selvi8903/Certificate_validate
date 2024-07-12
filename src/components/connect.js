import { useState } from 'react';
import Web3 from 'web3';


const contractABI =[
	{
		"inputs": [],
		"name": "allowUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "UserAllowed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "isAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = '0xA61130c792D0D30535A44Dc1C6ce72E4FB61BDBe';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState('');
  const [web3, setWeb3] = useState(null);

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        return web3Instance;
      } else {
        throw new Error("MetaMask not installed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onConnect = async () => {
    try {
      const web3Instance = await connectToMetaMask();
      if (web3Instance) {
        const userAccounts = await web3Instance.eth.getAccounts();
        const account = userAccounts[0];
        const contract = new web3Instance.eth.Contract(contractABI, contractAddress);
        await contract.methods.allowUser().send({ from: account });
        let ethBalance = await web3Instance.eth.getBalance(account);
        ethBalance = web3Instance.utils.fromWei(ethBalance, 'ether');
        setEthBalance(ethBalance);
        setIsConnected(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>React dApp authentication with React, Web3.js and MetaMask</h1>
      </div>
      <div className="app-wrapper">
        {!isConnected && (
          <div>
            <button className="app-button__login" onClick={onConnect}>
              Login with MetaMask
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="app-wrapper">
          <div className="app-details">
            <h2>You are connected to MetaMask.</h2>
            <div className="app-balance">
              <span>Balance: </span>
              {ethBalance} ETH
            </div>
          </div>
          <div>
            <button className="app-buttons__logout" onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
