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
            'address': '0xa920e51b82eefd46298cca167d68d6b31c05bbd5'
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
          'address': '0xa920e51b82eefd46298cca167d68d6b31c05bbd5'
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
            'name': 'set',
            'outputs': [],
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
        'bytecode': '60606040526103a3806100126000396000f360606040523615610095576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b31461009757806318160ddd146100ce57806323b872dd146100f157806327e235e3146101315780633825d8281461015d57806352929a0c1461017e57806370a082311461018d578063a9059cbb146101b9578063dd62ed3e146101f057610095565b005b6100b66004808035906020019091908035906020019091905050610225565b60405180821515815260200191505060405180910390f35b6100db600480505061022e565b6040518082815260200191505060405180910390f35b6101196004808035906020019091908035906020019091908035906020019091905050610234565b60405180821515815260200191505060405180910390f35b6101476004808035906020019091905050610319565b6040518082815260200191505060405180910390f35b61017c6004808035906020019091908035906020019091905050610334565b005b61018b600480505061036d565b005b6101a36004808035906020019091905050610389565b6040518082815260200191505060405180910390f35b6101d86004808035906020019091908035906020019091905050610391565b60405180821515815260200191505060405180910390f35b61020f600480803590602001909190803590602001909190505061039a565b6040518082815260200191505060405180910390f35b60005b92915050565b60005b90565b6000600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505482111561029157600160009054906101000a900460ff161561028b5761031256610290565b610002565b5b81600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555060019050610312565b9392505050565b60006000506020528060005260406000206000915090505481565b80600060005060008473ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b5050565b6001600160006101000a81548160ff021916908302179055505b565b60005b919050565b60005b92915050565b60005b9291505056'
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
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': '',
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
            'name': 'description',
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
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              },
              {
                'name': 'description',
                'type': 'bytes32'
              }
            ],
            'name': 'set_description',
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
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint72'
              }
            ],
            'name': 'paid',
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
                'name': 'first',
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
        'bytecode': '6060604052604051602080610f27833981016040528080519060200190919050505b80690700000000000000000060006101000a81548168ffffffffffffffffff021916908302179055505b50610ecd8061005a6000396000f3606060405236156100d7576000357c0100000000000000000000000000000000000000000000000000000000900480631530e4b6146100d95780631e83409a1461011b5780634e71d92d1461015257806357df276814610180578063606dcb8b146101b057806373c0737a146101da5780637c2e41e7146101fb578063836fc8461461022e5780638ff565701461024f57806396c1c6d614610291578063b8e3d19a146102bd578063d1d3d4ae146102eb578063e370a29e1461030c578063fa4fa5031461032d578063ff2c9d3c14610360576100d7565b005b6100ef6004808035906020019091905050610399565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61013160048080359060200190919050506103f8565b604051808268ffffffffffffffffff16815260200191505060405180910390f35b61015f6004805050610570565b604051808268ffffffffffffffffff16815260200191505060405180910390f35b6101966004808035906020019091905050610586565b604051808260001916815260200191505060405180910390f35b6101d860048080359060200190919080359060200190919080359060200190919050506105c8565b005b6101f9600480803590602001909190803590602001909190505061075d565b005b6102116004808035906020019091905050610816565b604051808264ffffffffff16815260200191505060405180910390f35b61024d6004808035906020019091908035906020019091905050610866565b005b61026560048080359060200190919050506109f3565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102a76004808035906020019091905050610a52565b6040518082815260200191505060405180910390f35b6102d36004808035906020019091905050610a94565b60405180821515815260200191505060405180910390f35b61030a6004808035906020019091908035906020019091905050610ae0565b005b61032b6004808035906020019091908035906020019091905050610bba565b005b6103436004808035906020019091905050610c73565b604051808264ffffffffff16815260200191505060405180910390f35b6103766004808035906020019091905050610cc3565b604051808315158152602001826000191681526020019250505060405180910390f35b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506103f3565b919050565b60006907000000000000000000600081819054906101000a900468ffffffffffffffffff168092919060010191906101000a81548168ffffffffffffffffff021916908302179055509050805061047d6000690700000000000000000060009054906101000a900468ffffffffffffffffff1668ffffffffffffffffff161415610d32565b8160006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055503360006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508068ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a25b919050565b600061057c60006103f8565b9050610583565b90565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b506002016000505490506105c3565b919050565b826106086105d582610399565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d32565b4260006000508568ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060040160006101000a81548164ffffffffff021916908302179055508260006000508568ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b50600501600050819055508160006000508568ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060060160006101000a81548164ffffffffff02191690830217905550600060006000508568ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060060160056101000a81548160ff021916908302179055508368ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b505050565b8161079d61076a82610399565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d32565b8160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b50600201600050819055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060040160009054906101000a900464ffffffffff169050610861565b919050565b61089d3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d32565b600160006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060060160056101000a81548160ff021916908302179055506109b36108f0826109f3565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd8461091585610399565b61091e86610a52565b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150610d32565b8068ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a25b5050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610a4d565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b50600301600050549050610a8f565b919050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060060160059054906101000a900460ff169050610adb565b919050565b81610b20610aed82610399565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d32565b8160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b81610bfa610bc782610399565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d32565b8160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b50600301600050819055508268ffffffffffffffffff167f0bccc6b00400b86ce7886ed72243bfe6b39872eafda1d8f6335f628da2de37fe60405180905060405180910390a2505b5050565b600060006000508268ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b5060060160009054906101000a900464ffffffffff169050610cbe565b919050565b60006000610cd13384610d42565b15610d1957600160006000508468ffffffffffffffffff1669010000000000000000008110156100025790906007020160005b506005016000505491509150610d2d56610d2c565b6000600080600102905091509150610d2d565b5b915091565b801515610d3e57610002565b5b50565b6000610d4d82610c73565b64ffffffffff1642101515610d695760009050610dd656610dd5565b600073ffffffffffffffffffffffffffffffffffffffff16610d8a836109f3565b73ffffffffffffffffffffffffffffffffffffffff161480610db15750610db082610a94565b5b15610dc35760019050610dd656610dd4565b610dcd8383610ddc565b9050610dd6565b5b5b92915050565b60003073ffffffffffffffffffffffffffffffffffffffff1660405180807f70617928616464726573732c75696e7437322900000000000000000000000000815260200150601301905060405180910390207c010000000000000000000000000000000000000000000000000000000090048484604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018268ffffffffffffffffff168152602001925050506000604051808303816000876161da5a03f1925050509050610ec7565b9291505056'
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
