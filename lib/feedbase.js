var web3 = require("./web3.js")
var Feedbase = require("../build/js_module.js").class

module.exports = new Feedbase(web3).objects.feedbase
