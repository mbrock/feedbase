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
            'address': '0x1ad56a3f0c722b3feccca7a564c133ef8d05fa40'
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
          'address': '0x1ad56a3f0c722b3feccca7a564c133ef8d05fa40'
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
                'type': 'uint24'
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
        'bytecode': '60606040526101f2806100126000396000f360606040523615610048576000357c0100000000000000000000000000000000000000000000000000000000900480634bbb216c146100c0578063e1ac1a11146100d857610048565b6100be5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600036604051808383808284378201915050925050506000604051808303816000866161da5a03f191505015156100bb57610002565b5b565b005b6100d66004808035906020019091905050610111565b005b6100ee6004808035906020019091905050610140565b604051808360001916815260200182151581526020019250505060405180910390f35b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1184604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f1156100025750505060405180519060200180519060200150915091506101ed565b91509156'
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
                'type': 'uint24'
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
                'name': 'id',
                'type': 'uint24'
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
                'type': 'uint24'
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
                'type': 'uint24'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
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
                'type': 'uint24'
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
                'type': 'uint24'
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
                'name': 'user',
                'type': 'address'
              },
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'pay',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
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
                'type': 'uint24'
              }
            ],
            'name': 'value',
            'outputs': [
              {
                'name': 'value',
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
                'type': 'uint24'
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
                'type': 'uint24'
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
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
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
                'type': 'uint24'
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
                'name': 'id',
                'type': 'uint24'
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
                'type': 'uint24'
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
                'type': 'uint24'
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
                'type': 'uint24'
              }
            ],
            'name': 'FeedChanged',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526001600160006101000a81548162ffffff02191690830217905550610e6b8061002d6000396000f3606060405236156100f8576000357c0100000000000000000000000000000000000000000000000000000000900480630646a6dc146100fa578063140f8dd31461012857806318d2e71a146101525780631e83409a146101825780631f7344fd146101b3578063363123b8146101f55780633f7c7944146102375780634112aef7146102635780634e71d92d1461028457806356fa5449146102ac578063625dd009146102cd578063698f8269146102fd5780637440352c1461032b5780639976b7ea1461035e578063a8b8b7741461038c578063a8e836b5146103bf578063c726b21a146103e0578063e1ac1a1114610401576100f8565b005b610110600480803590602001909190505061043a565b60405180821515815260200191505060405180910390f35b6101506004808035906020019091908035906020019091908035906020019091905050610480565b005b61016860048080359060200190919050506105e2565b604051808260001916815260200191505060405180910390f35b6101986004808035906020019091905050610615565b604051808262ffffff16815260200191505060405180910390f35b6101c9600480803590602001909190505061073f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61020b600480803590602001909190505061078f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61024d60048080359060200190919050506107df565b6040518082815260200191505060405180910390f35b6102826004808035906020019091908035906020019091905050610812565b005b610291600480505061098a565b604051808262ffffff16815260200191505060405180910390f35b6102cb60048080359060200190919080359060200190919050506109a0565b005b6102e36004808035906020019091905050610a56565b604051808260001916815260200191505060405180910390f35b6103136004808035906020019091905050610a6c565b60405180821515815260200191505060405180910390f35b6103416004808035906020019091905050610a9b565b604051808264ffffffffff16815260200191505060405180910390f35b6103746004808035906020019091905050610adc565b60405180821515815260200191505060405180910390f35b6103a26004808035906020019091905050610b19565b604051808264ffffffffff16815260200191505060405180910390f35b6103de6004808035906020019091908035906020019091905050610b5a565b005b6103ff6004808035906020019091908035906020019091905050610c1f565b005b6104176004808035906020019091905050610cc3565b604051808360001916815260200182151581526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff1661045d8361078f565b73ffffffffffffffffffffffffffffffffffffffff1614905061047b565b919050565b826104c061048d8261073f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d0c565b82600060005060008662ffffff168152602001908152602001600020600050600401600050819055506104f1610d1c565b600060005060008662ffffff16815260200190815260200160002060005060050160006101000a81548164ffffffffff0219169083021790555081600060005060008662ffffff16815260200190815260200160002060005060050160056101000a81548164ffffffffff0219169083021790555061056f8461043a565b15600060005060008662ffffff168152602001908152602001600020600050600501600a6101000a81548160ff021916908302179055508362ffffff167feb186e57d0531546cf6bd0046fb405fdd28d9e88b26a67b9577438afa1fa8d5160405180905060405180910390a2505b505050565b6000600060005060008362ffffff168152602001908152602001600020600050600201600050549050610610565b919050565b600061063a6000600160009054906101000a900462ffffff1662ffffff161415610d0c565b6001600081819054906101000a900462ffffff168092919060010191906101000a81548162ffffff021916908302179055509050805081600060005060008362ffffff16815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555033600060005060008362ffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508062ffffff167feb186e57d0531546cf6bd0046fb405fdd28d9e88b26a67b9577438afa1fa8d5160405180905060405180910390a25b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061078a565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506107da565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060030160005054905061080d565b919050565b6108493073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d0c565b6000600060005060008362ffffff168152602001908152602001600020600050600501600a6101000a81548160ff021916908302179055508062ffffff167feb186e57d0531546cf6bd0046fb405fdd28d9e88b26a67b9577438afa1fa8d5160405180905060405180910390a26109856108c28261078f565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd846108e78561073f565b6108f0866107df565b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150610d0c565b5b5050565b60006109966000610615565b905061099d565b90565b816109e06109ad8261073f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d0c565b6109f26109ec8461043a565b15610d0c565b81600060005060008562ffffff168152602001908152602001600020600050600301600050819055508262ffffff167feb186e57d0531546cf6bd0046fb405fdd28d9e88b26a67b9577438afa1fa8d5160405180905060405180910390a2505b5050565b6000610a6182610cc3565b50809150505b919050565b6000610a7782610a9b565b64ffffffffff16610a86610d1c565b64ffffffffff1610159050610a96565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060050160059054906101000a900464ffffffffff169050610ad7565b919050565b6000600060005060008362ffffff168152602001908152602001600020600050600501600a9054906101000a900460ff169050610b14565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060050160009054906101000a900464ffffffffff169050610b55565b919050565b81610b9a610b678261073f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d0c565b81600060005060008562ffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508262ffffff167feb186e57d0531546cf6bd0046fb405fdd28d9e88b26a67b9577438afa1fa8d5160405180905060405180910390a2505b5050565b81610c5f610c2c8261073f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d0c565b81600060005060008562ffffff168152602001908152602001600020600050600201600050819055508262ffffff167feb186e57d0531546cf6bd0046fb405fdd28d9e88b26a67b9577438afa1fa8d5160405180905060405180910390a2505b5050565b60006000610cd13384610d29565b15610d0657600060005060008462ffffff16815260200190815260200160002060005060040160005054600191509150610d07565b5b915091565b801515610d1857610002565b5b50565b6000429050610d26565b90565b6000610d3482610a6c565b15610d465760009050610d7456610d73565b610d4f82610adc565b15610d6957610d5e8383610d7a565b9050610d7456610d72565b60019050610d74565b5b5b92915050565b6000600060405180807f70617928616464726573732c75696e74323429000000000000000000000000008152602001506013019050604051809103902090503073ffffffffffffffffffffffffffffffffffffffff16817c010000000000000000000000000000000000000000000000000000000090048585604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018262ffffff168152602001925050506000604051808303816000876161da5a03f1925050509150610e64565b509291505056'
      },
      'FeedbaseEvents': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
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
