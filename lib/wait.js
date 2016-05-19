var feedbase = require("../lib/feedbase.js")
var web3 = require("../lib/web3.js")
var TIMEOUT_SECONDS = 120

module.exports = (predicate, callback, errback) => {
  var timeout = setTimeout(() => {
    filter.stopWatching()
    errback()
  }, TIMEOUT_SECONDS * 1000)
  
  var filter = web3.eth.filter({
    address: feedbase.address,
  }, (error, { topics: [event, id] }) => {
    if (predicate(web3.toDecimal(id))) {
      filter.stopWatching()
      clearTimeout(timeout)
      callback(web3.toDecimal(id))
    }
  })
}
