require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/unipop_nft.sol/UNIPOP.json"); 

const contractAddress = "0x930e1c20c8e4be7d14b7bcc922f20501da06f8d2";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
const nonce = web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

async function mintUnipop(nonce, tokenURI) {

    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {

        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
            if (!err) {
                console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!");
            } else {
                console.log("Something went wrong with your transaction", err);
            }
        });
    }).catch((err) => {
        console.log("Promise failed", err);
    });
}


const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTg8cvX483WNbaiP4AbXVL4WQ1rhHwDgks9QnaRiQL9Nx";
const unipops = require("../UNIPOPs/unipops");
mintUnipop(nonce, unipops[2].tokenURI);

module.exports = mintUnipop; 

