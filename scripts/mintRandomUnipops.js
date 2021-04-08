require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/unipop_nft.sol/UNIPOP.json"); 
const unipops = require("../UNIPOPs/unipops");
//const mintUnipop = require('./mintUnipop');

const contractAddress = "0x930e1c20c8e4be7d14b7bcc922f20501da06f8d2";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
let nonce;
let randomUnipop;


// Hardcoded for now
const numberOfWinners = 5; 
let unipopsMinted = 0; 

mintUnipopPerWinner(numberOfWinners);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


async function mintUnipopPerWinner(number) {
    
    try {
        randomUnipop = unipops[getRandomInt(0, unipops.length)];
        console.log("Generated random ID of", randomUnipop, "from a maximum of", unipops.length);
        nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

        console.log("Preparing to mint UNIPOP....");

        mintUnipop(nonce, randomUnipop);
    }
    catch (error) {
        console.log(error);
    }
}

async function mintUnipop(nonce, unipop) {

    const signPromise = web3.eth.accounts.signTransaction(getMintUnipopTransaction(nonce, unipop.tokenURI), PRIVATE_KEY);
        
    signPromise.then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
            if (!err) {
                console.log("Minted", unipop.name);
                onTransactionEnded(hash);
            } else { 
                console.log("Something went wrong with your transaction", err);
                throw err;
            }
        });
    }).catch((err) => {
        console.log("Promise failed", err);
        throw err;
    });
}


async function onTransactionEnded (hash) {

    console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!");

    unipopsMinted++;

    if (unipopsMinted < numberOfWinners) {
        //nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
        nonce++; 
        randomUnipop = unipops[getRandomInt(0, unipops.length)];
        await mintUnipop(nonce, randomUnipop);
    } else {
        console.log("Finished minting!");
        return;
    }
}

function getMintUnipopTransaction (nonce, tokenURI) {
    return {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };
}