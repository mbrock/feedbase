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

contract Feedbase {
    event Update(uint64 indexed id);

    struct Feed {
        address owner;
        bytes32 name;
        uint fee;
        ERC20 feeToken;

        int256 value;
        uint timestamp;
        uint expiration;
        bool feePaid;
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

    function create() returns (uint64) { return create(ERC20(0)); }
    function create(ERC20 feeToken) returns (uint64 id) {
        id = getNextID();
        feeds[id].owner = msg.sender;
        feeds[id].feeToken = feeToken;
        Update(id);
    }

    function setName(uint64 id, bytes32 name) auth(id) {
        feeds[id].name = name;
        Update(id);
    }

    function setFee(uint64 id, uint fee) auth(id) {
        if (isAlwaysFree(id)) throw;
        feeds[id].fee = fee;
        Update(id);
    }

    function update(uint64 id, int256 value, uint expiration) auth(id) {
        feeds[id].value = value;
        feeds[id].timestamp = block.timestamp;
        feeds[id].expiration = expiration;
        feeds[id].feePaid = false;
        Update(id);
    }

    function transfer(uint64 id, address newOwner) auth(id) {
        feeds[id].owner = newOwner;
        Update(id);
    }

    //------------------------------------------------------------------
    // For consumers
    //------------------------------------------------------------------

    function read(uint64 id) returns (int256 value) {
        var feed = feeds[id];

        if (isExpired(id)) throw;

        if (!isFeePaid(id) && !isAlwaysFree(id)) {
            feed.feeToken.transferFrom(msg.sender, feed.owner, feed.fee);
            feed.feePaid = true;
        }

        return feed.value;
    }

    function getOwner(uint64 id) constant returns (address) {
        return feeds[id].owner;
    }
    function getName(uint64 id) constant returns (bytes32) {
        return feeds[id].name;
    }
    function getFee(uint64 id) constant returns (uint) {
        return feeds[id].fee;
    }
    function getFeeToken(uint64 id) constant returns (ERC20) {
        return feeds[id].feeToken;
    }

    function getTimestamp(uint64 id) constant returns (uint) {
        return feeds[id].timestamp;
    }
    function getExpiration(uint64 id) constant returns (uint) {
        return feeds[id].expiration;
    }
    function isFeePaid(uint64 id) constant returns (bool) {
        return feeds[id].feePaid;
    }

    function isNew(uint64 id) constant returns (bool) {
        return feeds[id].timestamp == 0;
    }
    function isExpired(uint64 id) constant returns (bool) {
        return block.timestamp > feeds[id].expiration;
    }
    function isAlwaysFree(uint64 id) constant returns (bool) {
        return address(feeds[id].feeToken) == 0;
    }
}
