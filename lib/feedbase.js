var Feedbase = require("../build/js_module.js").class

module.exports = function(web3, env) {
  web3 = web3 || getDefaultWeb3()
  env  = env  || getDefaultEnv(web3)

  var feedbase = new Feedbase(web3, env).objects.feedbase
  var toString = function(x) { return web3.toAscii(x).replace(/\0/g, "") }

  feedbase.account = web3.eth.defaultAccount

  feedbase.inspect = function(id) {
    return {
      id:           id,
                    
      owner:        feedbase.owner(id),
      token:        feedbase.token(id),
      charity:      feedbase.charity(id),
                    
      description:  toString(feedbase.description(id)),
      price:        web3.toHex(feedbase.price(id)),
                    
      timestamp:    web3.toDecimal(feedbase.timestamp(id)),
      expiration:   web3.toDecimal(feedbase.expiration(id)),
      expired:      feedbase.expired(id),
                    
      purchased:    feedbase.purchased(id),
    }
  }

  feedbase.filter = function(options, callback) {
    web3.eth.filter(Object.assign({
      address: feedbase.address,
    }, options), function(error, event) {
      if (error) {
        callback(error)
      } else {
        callback(null, web3.toDecimal((event || {}).topics.id))
      }
    })
  }

  return feedbase
}

function getDefaultWeb3() {
  var Web3 = require("web3")
  var HOST = process.env.ETH_RPC_HOST || "localhost"
  var PORT = process.env.ETH_RPC_PORT || 8545
  var URL  = process.env.ETH_RPC_URL  || "http://" + HOST + ":" + PORT
  var web3 = new Web3(new Web3.providers.HttpProvider(URL))

  try {
    web3.eth.coinbase
  } catch (err) {
    var message = "Could not connect to Ethereum RPC server at " + URL
    var error = new Error(message)
    error.eth_rpc_connection = true
    throw error
  }

  web3.eth.defaultAccount = process.env.ETH_ACCOUNT || web3.eth.coinbase

  return web3
}

function getDefaultEnv(web3) {
  process.env.ETH_ENV || getNetworkName(web3.version.network)
}

function getNetworkName(version) {
  if (version == 1) return "live"
  if (version == 2) return "morden"
  throw new Error("Unknown network version: " + version)
}
