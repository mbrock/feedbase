Feedbase
========

This simple Ethereum contract enables anyone to create a "feed" which
can be used to publish an arbitrary sequence of values.  Feeds can be
transferred between owners and the owner of a feed is able to charge a
fee to on-chain consumers of the information.  Expiration dates can be
set to prevent consumers from reading stale data.


Installation
------------

Feedbase can be installed using npm:

    $ npm install -g feedbase

The following environment variables can be used for configuration:

    ETH_ACCOUNT=0x1234567890123456789012345678901234567890
    ETH_RPC_HOST=localhost
    ETH_RPC_PORT=8545
    ETH_RPC_URL=http://localhost:8545


Claiming a feed
---------------

Before you can start publishing values, you need to claim a feed ID:

    $ feedbase claim
    {
      "id": 15,
      "owner": "0xeb5150cc175e6892c1bd7bf559aab19e3d347e69",
      "description": "",
      "token": "0x0000000000000000000000000000000000000000",
      "fee": "0x0",
      "value": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": 0,
      "expiration": 0,
      "expired": true
    }

If you want to be able to charge a fee, when claiming your feed ID,
you need to specify the address of the token you wish to use:

    $ feedbase claim 0x4244e29ec71fc32a34dba8e89d4856e507d1bc87
    {
      "id": 16,
      "owner": "0xeb5150cc175e6892c1bd7bf559aab19e3d347e69",
      "description": "",
      "token": "0x4244e29ec71fc32a34dba8e89d4856e507d1bc87",
      "fee": "0x0",
      "value": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": 0,
      "expiration": 0,
      "expired": true
    }

The token address of a feed can never be changed, but the fee itself
can be reset at any time (including to zero):

    $ feedbase set-fee 16 0x10000000

Fees are always charged to the first contract to read each value,
but the fee is not charged to subsequent reads of the same value
(ie, there is a single `paid` flag per feed).
When a new value is published, the fee is charged again (`paid` is reset to false).

If you want, you can add a description (32 bytes maximum):

    $ feedbase set-description 16 "Temperature in Central Park"

Inspect the feed to make sure your changes went through:

    $ feedbase inspect 16
    {
      "id": 16,
      "owner": "0xeb5150cc175e6892c1bd7bf559aab19e3d347e69",
      "description": "Temperature in Central Park",
      "token": "0x4244e29ec71fc32a34dba8e89d4856e507d1bc87",
      "fee": "0x10000000",
      "value": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": 0,
      "expiration": 0,
      "expired": true
    }


Publishing feed values
----------------------

Feed values are 32 bytes of arbitrary data plus expiration dates:

    $ feedbase publish 16 \
    0x0000000000000000000000000000000490000000000000000000000000000000 \
    $((`date +%s` + 300))

In this example we're setting the value of the feed to the number 73
represented in 128x128 fixed-point notation.  The expiration date is
set to 5 minutes from now.

See also Keeper <https://github.com/nexusdev/keeper>.


More information
----------------

For more details, please consult the following files:

    bin/feedbase
    lib/feedbase.js
    contracts/feedbase.sol
    contracts/feedbase_test.sol
