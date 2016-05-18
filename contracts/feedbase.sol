// Feedbase -- open-access service for price feed consumers/publishers
//
// This simple contract enables anyone to claim a feed ID which can
// then be used to publish a sequence of arbitrary values over time.
//
// The feed can be updated at any time, and an expiration date can be
// set to prevent anyone from reading stale data.
//
// In addition, the owner of a feed is able to specify a fee which is
// charged to whoever becomes the first to read each published value.

import "dappsys/token/erc20.sol";

contract Feedbase {
    event Update(uint64 indexed id);

    struct Feed {
        address owner;
        bytes32 description;

        bytes32 value;
        uint updated;
        uint expires;

        ERC20 token;
        uint fee;
        bool paid;
    }

    uint32 next_id;
    mapping(uint64 => Feed) feeds;

    modifier auth(uint64 id) {
        if (msg.sender != feeds[id].owner) {
          throw;
        }
        _
    }

    function claim(ERC20 token) returns (uint64 id) {
        id = getNextID();
        feeds[id].owner = msg.sender;
        feeds[id].token = token;
        Update(id);
    }

    function getNextID() internal returns (uint64 id) {
        id = next_id++;
        if (next_id == 0) throw; // Ran out of IDs.
    }

    function setDescription(uint64 id, bytes32 description) auth(id) {
        feeds[id].description = description;
        Update(id);
    }

    function setFee(uint64 id, uint fee) auth(id) {
        feeds[id].fee = fee;
        Update(id);
    }

    function transfer(uint64 id, address new_owner) auth(id) {
        feeds[id].owner = new_owner;
        Update(id);
    }

    function update(uint64 id, bytes32 value, uint expires) auth(id) {
        feeds[id].value = value;
        feeds[id].updated = block.timestamp;
        feeds[id].expires = expires;
        feeds[id].paid = false;
        Update(id);
    }

    function get(uint64 id) returns (bytes32 value) {
        var feed = feeds[id];

        if (block.timestamp > feed.expires) {
            throw;
        }

        if (address(feed.token) != 0 && !feed.paid) {
            feed.token.transferFrom(msg.sender, feed.owner, feed.fee);
            feed.paid = true;
        }

        return feed.value;
    }
}
