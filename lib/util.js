var web3 = require("./web3.js")
var repeat = (x, n) => new Array(n + 1).join(x)

exports.toString = x => web3.toAscii(x).replace(/\u0000.*/, "")
exports.toBytes32 = x => x.replace(/^0x$/, `0x${repeat("0", 64)}`)
