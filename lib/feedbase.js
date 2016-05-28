var Feedbase = require("../build/js_module.js").class

module.exports = (web3, env) => {
  web3 = web3 || getDefaultWeb3()
  env = env || getDefaultEnv(web3)

  var feedbase = new Feedbase(web3, env).objects.feedbase
  var toString = x => web3.toAscii(x).replace(/\0/g, "")

  feedbase.account = web3.eth.defaultAccount

  feedbase.inspect = id => ({
    id,
    owner:       feedbase.owner(id),
    description: toString(feedbase.description(id)),
    token:       feedbase.token(id),
    fee:         web3.toHex(feedbase.fee(id)),
    value:       web3.toHex(feedbase.value(id)),
    timestamp:   web3.toDecimal(feedbase.timestamp(id)),
    expiration:  web3.toDecimal(feedbase.expiration(id)),
    expired:     feedbase.expired(id),
  })

  feedbase.filter = (options, callback) => {
    web3.eth.filter(Object.assign({
      address: feedbase.address,
    }, options), (error, { topics } = {}) => {
      if (error) {
        callback(error)
      } else {
        var [event, id] = topics
        callback(null, web3.toDecimal(id))
      }
    })
  }

  return feedbase
}

var getDefaultWeb3 = () => {
  var Web3 = require("web3")
  var HOST = process.env.ETH_RPC_HOST || "localhost"
  var PORT = process.env.ETH_RPC_PORT || 8545
  var URL = process.env.ETH_RPC_URL || `http://${HOST}:${PORT}`
  var web3 = new Web3(new Web3.providers.HttpProvider(URL))

  web3.eth.defaultAccount = process.env.ETH_ACCOUNT || web3.eth.coinbase

  return web3
}

var getDefaultEnv = web3 =>
  process.env.ETH_ENV || getNetworkName(web3.version.network)

var getNetworkName = version => {
  if (version == 1) return "live"
  if (version == 2) return "morden"
  throw new Error("Unknown network version: " + version)
}
