'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['feedbase'] = (function builder () {
  var environments = {
      'morden': {
        'objects': {
          'feedbase': {
            'class': 'Feedbase',
            'address': '0x3957b01a4f86454b6b1283f1cc550d8af34d7e7c'
          }
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {
        'feedbase': {
          'class': 'Feedbase',
          'address': '0x3957b01a4f86454b6b1283f1cc550d8af34d7e7c'
        }
      }
    };
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'FakePerson': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'name': '_target',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              },
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '60606040526101f8806100126000396000f360606040523615610048576000357c0100000000000000000000000000000000000000000000000000000000900480634bbb216c146100c0578063ff2c9d3c146100d857610048565b6100be5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600036604051808383808284378201915050925050506000604051808303816000866161da5a03f191505015156100bb57610002565b5b565b005b6100d66004808035906020019091905050610111565b005b6100ee6004808035906020019091905050610140565b604051808315158152602001826000191681526020019250505060405180910390f35b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ff2c9d3c84604051827c0100000000000000000000000000000000000000000000000000000000028152600401808268ffffffffffffffffff1681526020019150506040604051808303816000876161da5a03f1156100025750505060405180519060200180519060200150915091506101f3565b91509156'
      },
      'FakeToken': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'account',
                'type': 'address'
              },
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'name': 'set_balance',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'x',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'from',
                'type': 'address'
              },
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'balances',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'disable_throwing',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'x',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'b',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526103a7806100126000396000f360606040523615610095576000357c0100000000000000000000000000000000000000000000000000000000900480630776e4fa14610097578063095ea7b3146100b857806318160ddd146100ef57806323b872dd1461011257806327e235e31461015257806352929a0c1461017e57806370a082311461018d578063a9059cbb146101b9578063dd62ed3e146101f057610095565b005b6100b66004808035906020019091908035906020019091905050610225565b005b6100d7600480803590602001909190803590602001909190505061025e565b60405180821515815260200191505060405180910390f35b6100fc6004805050610267565b6040518082815260200191505060405180910390f35b61013a600480803590602001909190803590602001909190803590602001909190505061026d565b60405180821515815260200191505060405180910390f35b6101686004808035906020019091905050610356565b6040518082815260200191505060405180910390f35b61018b6004805050610371565b005b6101a3600480803590602001909190505061038d565b6040518082815260200191505060405180910390f35b6101d86004808035906020019091908035906020019091905050610395565b60405180821515815260200191505060405180910390f35b61020f600480803590602001909190803590602001909190505061039e565b6040518082815260200191505060405180910390f35b80600060005060008473ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b5050565b60005b92915050565b60005b90565b6000600060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548211156102ce57600160009054906101000a900460ff16156102c8576000905061034f566102cd565b610002565b5b81600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055506001905061034f565b9392505050565b60006000506020528060005260406000206000915090505481565b6001600160006101000a81548160ff021916908302179055505b565b60005b919050565b60005b92915050565b60005b9291505056'
      },
      'Feedbase': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'token',
                'type': 'address'
              }
            ],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'gratis',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'feed_id',
                'type': 'uint72'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'expires',
                'type': 'uint40'
              }
            ],
            'name': 'set',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'user',
                'type': 'address'
              },
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'pay',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'updated',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'token',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'price',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'expires',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              },
              {
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'set_owner',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              },
              {
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'set_label',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              },
              {
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'set_price',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'expired',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'label',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'unpaid',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'first_id',
                'type': 'uint72'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'FeedChanged',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604051602080610ff3833981016040528080519060200190919050505b80690500000000000000000060006101000a81548168ffffffffffffffffff021916908302179055505b50610f998061005a6000396000f3606060405236156100ed576000357c0100000000000000000000000000000000000000000000000000000000900480631530e4b6146100ef5780631e83409a146101315780632b138565146101685780634e71d92d14610196578063606dcb8b146101c4578063836fc846146101ee5780638b5be0e31461020f5780638ff565701461024257806396c1c6d614610284578063b122c730146102b0578063d1d3d4ae146102e3578063dccc31dc14610304578063e370a29e14610325578063e39f772c14610346578063ef5113a614610374578063f56edfc9146103a4578063ff2c9d3c146103d2576100ed565b005b610105600480803590602001909190505061040b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610147600480803590602001909190505061046a565b604051808268ffffffffffffffffff16815260200191505060405180910390f35b61017e60048080359060200190919050506105e2565b60405180821515815260200191505060405180910390f35b6101a36004805050610628565b604051808268ffffffffffffffffff16815260200191505060405180910390f35b6101ec600480803590602001909190803590602001909190803590602001909190505061063e565b005b61020d60048080359060200190919080359060200190919050506107db565b005b6102256004808035906020019091905050610968565b604051808264ffffffffff16815260200191505060405180910390f35b61025860048080359060200190919050506109b8565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61029a6004808035906020019091905050610a17565b6040518082815260200191505060405180910390f35b6102c66004808035906020019091905050610a59565b604051808264ffffffffff16815260200191505060405180910390f35b6103026004808035906020019091908035906020019091905050610aa9565b005b6103236004808035906020019091908035906020019091905050610b83565b005b6103446004808035906020019091908035906020019091905050610c3c565b005b61035c6004808035906020019091905050610d07565b60405180821515815260200191505060405180910390f35b61038a6004808035906020019091905050610d61565b604051808260001916815260200191505060405180910390f35b6103ba6004808035906020019091905050610da3565b60405180821515815260200191505060405180910390f35b6103e86004808035906020019091905050610def565b604051808315158152602001826000191681526020019250505060405180910390f35b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610465565b919050565b60006905000000000000000000600081819054906101000a900468ffffffffffffffffff168092919060010191906101000a81548168ffffffffffffffffff02191690830217905550905080506104ef6000690500000000000000000060009054906101000a900468ffffffffffffffffff1668ffffffffffffffffff161415610e47565b3360006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508160006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600101600b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508068ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a25b919050565b6000600073ffffffffffffffffffffffffffffffffffffffff16610605836109b8565b73ffffffffffffffffffffffffffffffffffffffff16149050610623565b919050565b6000610634600061046a565b905061063b565b90565b8261067e61064b8261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e47565b8260006000508568ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600001600050819055504260006000508568ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060010160006101000a81548164ffffffffff021916908302179055508160006000508568ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060010160056101000a81548164ffffffffff02191690830217905550610753846105e2565b1560006000508568ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600101600a6101000a81548160ff021916908302179055508368ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b505050565b6108123073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e47565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600101600a6101000a81548160ff02191690830217905550610928610865826109b8565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd8461088a8561040b565b61089386610a17565b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150610e47565b8068ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a25b5050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060010160009054906101000a900464ffffffffff1690506109b3565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600101600b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610a12565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600201600050549050610a54565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060010160059054906101000a900464ffffffffff169050610aa4565b919050565b81610ae9610ab68261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e47565b8160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b81610bc3610b908261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e47565b8160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600401600050819055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b81610c7c610c498261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e47565b610c8e610c88846105e2565b15610e47565b8160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600201600050819055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b5060010160059054906101000a900464ffffffffff1664ffffffffff164210159050610d5c565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600401600050549050610d9e565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b50600101600a9054906101000a900460ff169050610dea565b919050565b60006000610dfd3384610e57565b15610e4157600160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906005020160005b506000016000505491509150610e42565b5b915091565b801515610e5357610002565b5b50565b6000610e6282610d07565b15610e745760009050610ea256610ea1565b610e7d82610da3565b15610e9757610e8c8383610ea8565b9050610ea256610ea0565b60019050610ea2565b5b5b92915050565b60003073ffffffffffffffffffffffffffffffffffffffff1660405180807f70617928616464726573732c75696e7437322900000000000000000000000000815260200150601301905060405180910390207c010000000000000000000000000000000000000000000000000000000090048484604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018268ffffffffffffffffff168152602001925050506000604051808303816000876161da5a03f1925050509050610f93565b9291505056'
      },
      'FeedbaseEvents': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'FeedChanged',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052600a8060106000396000f360606040526008565b00'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['feedbase'];
}
