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
            'address': '0x6da5a2a2c47b62306cc1874d677fff5fe02f409f'
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
          'address': '0x6da5a2a2c47b62306cc1874d677fff5fe02f409f'
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
                'type': 'bytes32'
              },
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '60606040526101f8806100126000396000f360606040523615610048576000357c0100000000000000000000000000000000000000000000000000000000900480634bbb216c146100c0578063ff2c9d3c146100d857610048565b6100be5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600036604051808383808284378201915050925050506000604051808303816000866161da5a03f191505015156100bb57610002565b5b565b005b6100d66004808035906020019091905050610111565b005b6100ee6004808035906020019091905050610140565b604051808360001916815260200182151581526020019250505060405180910390f35b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ff2c9d3c84604051827c0100000000000000000000000000000000000000000000000000000000028152600401808268ffffffffffffffffff1681526020019150506040604051808303816000876161da5a03f1156100025750505060405180519060200180519060200150915091506101f3565b91509156'
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
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'free',
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
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'set',
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
            'name': 'timestamp',
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
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'expiration',
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
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
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
        'bytecode': '606060405263044aa200600160006101000a81548168ffffffffffffffffff02191690830217905550610ed4806100366000396000f3606060405236156100ed576000357c0100000000000000000000000000000000000000000000000000000000900480631530e4b6146100ef5780631c7d8e5a146101315780631e83409a1461015f5780634e71d92d14610196578063606dcb8b146101c45780637c2e41e7146101ee578063836fc846146102215780638ff565701461024257806396c1c6d614610284578063d1d3d4ae146102b0578063dccc31dc146102d1578063e370a29e146102f2578063e39f772c14610313578063ef5113a614610341578063f56edfc914610371578063fa4fa5031461039f578063ff2c9d3c146103d2576100ed565b005b610105600480803590602001909190505061040b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101476004808035906020019091905050610461565b60405180821515815260200191505060405180910390f35b61017560048080359060200190919050506104a7565b604051808268ffffffffffffffffff16815260200191505060405180910390f35b6101a360048050506105fb565b604051808268ffffffffffffffffff16815260200191505060405180910390f35b6101ec6004808035906020019091908035906020019091908035906020019091905050610611565b005b6102046004808035906020019091905050610791565b604051808264ffffffffff16815260200191505060405180910390f35b61024060048080359060200190919080359060200190919050506107d8565b005b610258600480803590602001909190505061095c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61029a60048080359060200190919050506109b2565b6040518082815260200191505060405180910390f35b6102cf60048080359060200190919080359060200190919050506109eb565b005b6102f06004808035906020019091908035906020019091905050610abc565b005b6103116004808035906020019091908035906020019091905050610b6c565b005b6103296004808035906020019091905050610c2e565b60405180821515815260200191505060405180910390f35b6103576004808035906020019091905050610c5d565b604051808260001916815260200191505060405180910390f35b6103876004808035906020019091905050610c96565b60405180821515815260200191505060405180910390f35b6103b56004808035906020019091905050610cd9565b604051808264ffffffffff16815260200191505060405180910390f35b6103e86004808035906020019091905050610d20565b604051808360001916815260200182151581526020019250505060405180910390f35b6000600060005060008368ffffffffffffffffff16815260200190815260200160002060005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061045c565b919050565b6000600073ffffffffffffffffffffffffffffffffffffffff166104848361095c565b73ffffffffffffffffffffffffffffffffffffffff161490506104a2565b919050565b60006001600081819054906101000a900468ffffffffffffffffff168092919060010191906101000a81548168ffffffffffffffffff021916908302179055509050805061051a6000600160009054906101000a900468ffffffffffffffffff1668ffffffffffffffffff161415610d6f565b81600060005060008368ffffffffffffffffff16815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555033600060005060008368ffffffffffffffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508068ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a25b919050565b600061060760006104a7565b905061060e565b90565b8261065161061e8261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d6f565b82600060005060008668ffffffffffffffffff16815260200190815260200160002060005060040160005081905550610688610d7f565b600060005060008668ffffffffffffffffff16815260200190815260200160002060005060050160006101000a81548164ffffffffff0219169083021790555081600060005060008668ffffffffffffffffff16815260200190815260200160002060005060050160056101000a81548164ffffffffff0219169083021790555061071284610461565b15600060005060008668ffffffffffffffffff168152602001908152602001600020600050600501600a6101000a81548160ff021916908302179055508368ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b505050565b6000600060005060008368ffffffffffffffffff16815260200190815260200160002060005060050160009054906101000a900464ffffffffff1690506107d3565b919050565b61080f3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d6f565b6000600060005060008368ffffffffffffffffff168152602001908152602001600020600050600501600a6101000a81548160ff0219169083021790555061091c6108598261095c565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd8461087e8561040b565b610887866109b2565b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150610d6f565b8068ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a25b5050565b6000600060005060008368ffffffffffffffffff16815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506109ad565b919050565b6000600060005060008368ffffffffffffffffff1681526020019081526020016000206000506003016000505490506109e6565b919050565b81610a2b6109f88261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d6f565b81600060005060008568ffffffffffffffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b81610afc610ac98261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d6f565b81600060005060008568ffffffffffffffffff168152602001908152602001600020600050600201600050819055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b81610bac610b798261040b565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d6f565b610bbe610bb884610461565b15610d6f565b81600060005060008568ffffffffffffffffff168152602001908152602001600020600050600301600050819055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b6000610c3982610cd9565b64ffffffffff16610c48610d7f565b64ffffffffff1610159050610c58565b919050565b6000600060005060008368ffffffffffffffffff168152602001908152602001600020600050600201600050549050610c91565b919050565b6000600060005060008368ffffffffffffffffff168152602001908152602001600020600050600501600a9054906101000a900460ff169050610cd4565b919050565b6000600060005060008368ffffffffffffffffff16815260200190815260200160002060005060050160059054906101000a900464ffffffffff169050610d1b565b919050565b60006000610d2e3384610d8c565b15610d6957600060005060008468ffffffffffffffffff16815260200190815260200160002060005060040160005054600191509150610d6a565b5b915091565b801515610d7b57610002565b5b50565b6000429050610d89565b90565b6000610d9782610c2e565b15610da95760009050610dd756610dd6565b610db282610c96565b15610dcc57610dc18383610ddd565b9050610dd756610dd5565b60019050610dd7565b5b5b92915050565b6000600060405180807f70617928616464726573732c75696e74373229000000000000000000000000008152602001506013019050604051809103902090503073ffffffffffffffffffffffffffffffffffffffff16817c010000000000000000000000000000000000000000000000000000000090048585604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018268ffffffffffffffffff168152602001925050506000604051808303816000876161da5a03f1925050509150610ecd565b509291505056'
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
