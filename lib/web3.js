var URL = process.env.ETH_RPC_URL || "http://localhost:8545"
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider(URL))

web3.eth.defaultAccount = web3.eth.coinbase

module.exports = web3
