/// feedbase.sol --- simple feed-oriented data access pattern

// Copyright (C) 2015-2016  Nexus Development <https://nexusdev.us>
// Copyright (C) 2015-2016  Nikolai Mushegian <nikolai@nexusdev.us>
// Copyright (C) 2016       Daniel Brockman   <daniel@brockman.se>

// This file is part of Feedbase.

// Feedbase is free software; you can redistribute and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.
//
// Feedbase is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Feedbase.  If not, see <http://www.gnu.org/licenses/>.

/// Commentary:

// The reason why we use `uint72' for feed IDs is to help prevent
// accidentally confusing different values that have the same type.
//
// In particular, this is very error-prone when dealing with functions
// that take long lists of different parameters or return many values.
//
// Because `uint72' is an unusual type, it's less likely that someone
// would confuse a feed ID with something else.

/// Code:

import "erc20/erc20.sol";

contract FeedbaseEvents {
    event FeedChanged(uint72 indexed id);
}

contract Feedbase is FeedbaseEvents {
    Feed[2**72]  feeds;
    uint72       next_id;

    function Feedbase(uint72 first_id) {
        next_id = first_id;
    }

    function assert(bool ok) internal {
        if (!ok) throw;
    }

    struct Feed {
        bytes32    value;       // What is the current feed value?
        uint40     updated;     // When was the current value set?
        uint40     expires;     // When will this value be obsolete?

        bool       unpaid;      // Is payment due for this value?
        ERC20      token;       // Which token is used for payment?
        uint       price;       // What is the price to be paid?

        address    owner;       // Who currently owns this feed?
        bytes32    label;       // How can this feed be described?
    }

    function updated     (uint72 id) constant returns (uint40) {
        return feeds[id].updated;
    }
    function expires     (uint72 id) constant returns (uint40) {
        return feeds[id].expires;
    }
    function expired     (uint72 id) constant returns (bool) {
        return now >= feeds[id].expires;
    }

    function unpaid      (uint72 id) constant returns (bool) {
        return feeds[id].unpaid;
    }
    function token       (uint72 id) constant returns (ERC20) {
        return feeds[id].token;
    }
    function gratis      (uint72 id) constant returns (bool) {
        return token(id) == ERC20(0);
    }
    function price       (uint72 id) constant returns (uint) {
        return feeds[id].price;
    }

    function owner       (uint72 id) constant returns (address) {
        return feeds[id].owner;
    }
    function label       (uint72 id) constant returns (bytes32) {
        return feeds[id].label;
    }

    //------------------------------------------------------------------
    // Creating feeds
    //------------------------------------------------------------------

    function claim() returns (uint72 feed_id) {
        return claim(ERC20(0));
    }

    function claim(ERC20 token) returns (uint72 id) {
        id = next_id++;
        assert(next_id != 0);

        feeds[id].owner  = msg.sender;
        feeds[id].token  = token;

        FeedChanged(id);
    }

    modifier auth(uint72 id) {
        assert(msg.sender == owner(id));
        _
    }

    //------------------------------------------------------------------
    // Updating feeds
    //------------------------------------------------------------------

    function set(uint72 id, bytes32 value, uint40 expires)
        auth(id)
    {
        feeds[id].value   = value;
        feeds[id].updated = uint40(now);
        feeds[id].expires = expires;
        feeds[id].unpaid  = !gratis(id);

        FeedChanged(id);
    }

    function set_price(uint72 id, uint price)
        auth(id)
    {
        assert(!gratis(id));
        feeds[id].price = price;
        FeedChanged(id);
    }

    function set_owner(uint72 id, address owner)
        auth(id)
    {
        feeds[id].owner = owner;
        FeedChanged(id);
    }

    function set_label(uint72 id, bytes32 label)
        auth(id)
    {
        feeds[id].label = label;
        FeedChanged(id);
    }

    //------------------------------------------------------------------
    // Reading feeds
    //------------------------------------------------------------------

    function get(uint72 id)
        returns (bool ok, bytes32 value)
    {
        if (can_get(msg.sender, id)) {
            return (true, feeds[id].value);
        }
    }

    function can_get(address user, uint72 id)
        internal returns (bool)
    {
        if (expired(id)) {
            return false;
        } else if (unpaid(id)) {
            return try_paying(user, id);
        } else {
            return true;
        }
    }

    function try_paying(address user, uint72 id) internal returns (bool) {
        return this.call(bytes4(sha3("pay(address,uint72)")), user, id);
    }

    function pay(address user, uint72 id)
        pseudo_internal
    {
        feeds[id].unpaid = false;
        assert(token(id).transferFrom(user, owner(id), price(id)));
        FeedChanged(id);
    }

    modifier pseudo_internal() {
        assert(msg.sender == address(this));
        _
    }
}
