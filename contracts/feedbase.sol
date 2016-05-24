//------------------------------------------------------------------
// feedbase -- open-access price feed services on Ethereum
//------------------------------------------------------------------
// This simple contract enables anyone to create "price feeds" which
// can be used to publish an arbitrary sequence of values over time.
//
// The feeds can be updated by their owners at any time, and expiry
// dates can be set to prevent consumers from reading stale data.
//
// The owner of a price feed can also choose to charge a fee, which
// is paid by the first caller to read each newly published value.

import "dappsys/token/erc20.sol";

contract FeedbaseEvents {
    event Create    (uint64 indexed id);
    event Configure (uint64 indexed id);
    event Update    (uint64 indexed id);
    event Pay       (uint64 indexed id);
}

contract Feedbase is FeedbaseEvents {
    struct Feed {
        address  owner;
        bytes32  description;
        uint     fee;
        ERC20    feeToken;

        bytes32  value;
        uint     timestamp;
        uint     expiration;
        bool     feePaid;
    }

    uint64 nextID;
    mapping(uint64 => Feed) feeds;

    function getNextID() internal returns (uint64 id) {
        id = nextID++;
        if (nextID == 0) throw; // Ran out of IDs.
    }

    modifier auth(uint64 id) {
        if (msg.sender != feeds[id].owner) throw;
        _
    }

    //------------------------------------------------------------------
    // For feed owners
    //------------------------------------------------------------------

    function create(ERC20 feeToken) returns (uint64 id) {
        id = getNextID();
        feeds[id].owner = msg.sender;
        feeds[id].feeToken = feeToken;
        Create(id);
    }

    function create() returns (uint64) {
        return create(ERC20(0));
    }

    function setDescription(uint64 id, bytes32 description) auth(id) {
        feeds[id].description = description;
        Configure(id);
    }

    function setFee(uint64 id, uint fee) auth(id) {
        if (isAlwaysFree(id)) throw;
        feeds[id].fee = fee;
        Configure(id);
    }

    function update(uint64 id, bytes32 value, uint expiration) auth(id) {
        feeds[id].value = value;
        feeds[id].timestamp = block.timestamp;
        feeds[id].expiration = expiration;
        feeds[id].feePaid = false;
        Update(id);
    }

    function transfer(uint64 id, address newOwner) auth(id) {
        feeds[id].owner = newOwner;
        Configure(id);
    }

    //------------------------------------------------------------------
    // For consumers
    //------------------------------------------------------------------

    function read(uint64 id) returns (bytes32) {
        if (isExpired(id)) throw;
        return readExpired(id);
    }

    function readExpired(uint64 id) returns (bytes32) {
        var feed = feeds[id];

        if (!isFeePaid(id) && !isAlwaysFree(id)) {
            feed.feeToken.transferFrom(msg.sender, feed.owner, feed.fee);
            feed.feePaid = true;
            Pay(id);
        }

        return feed.value;
    }

    function getOwner(uint64 id)
    constant returns (address) { return feeds[id].owner; }
    function getDescription(uint64 id)
    constant returns (bytes32) { return feeds[id].description; }
    function getFee(uint64 id)
    constant returns (uint)    { return feeds[id].fee; }
    function getFeeToken(uint64 id)
    constant returns (ERC20)   { return feeds[id].feeToken; }

    function getTimestamp(uint64 id)
    constant returns (uint)    { return feeds[id].timestamp; }
    function getExpiration(uint64 id)
    constant returns (uint)    { return feeds[id].expiration; }
    function isFeePaid(uint64 id)
    constant returns (bool)    { return feeds[id].feePaid; }

    function isExpired(uint64 id) constant returns (bool) {
        return block.timestamp > feeds[id].expiration;
    }

    function isFree(uint64 id) constant returns (bool) {
        return feeds[id].fee == 0;
    }

    function isAlwaysFree(uint64 id) constant returns (bool) {
        return address(feeds[id].feeToken) == address(0);
    }
}
