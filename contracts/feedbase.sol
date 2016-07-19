import "dappsys/token/erc20.sol";

contract FeedbaseEvents {
    event Claimed    (uint64 indexed id);
    event Configured (uint64 indexed id);
    event Published  (uint64 indexed id);
    event Paid       (uint64 indexed id);
}

contract Feedbase is FeedbaseEvents {
    struct Feed {
        address  owner;
        bytes32  description;
        uint     fee;
        ERC20    token;

        bytes32  value;
        uint64   timestamp;
        uint64   expiration;
        bool     paid;
    }

    Feed[2 ** 64] feeds;
    uint64 next;

    function owner(uint64 id) constant returns (address) {
        return feeds[id].owner;
    }

    function description(uint64 id) constant returns (bytes32) {
        return feeds[id].description;
    }

    function fee(uint64 id) constant returns (uint) {
        return feeds[id].fee;
    }

    function token(uint64 id) constant returns (ERC20) {
        return feeds[id].token;
    }

    function timestamp(uint64 id) constant returns (uint64) {
        return feeds[id].timestamp;
    }

    function expiration(uint64 id) constant returns (uint64) {
        return feeds[id].expiration;
    }

    function paid(uint64 id) constant returns (bool) {
        return feeds[id].paid;
    }

    function expired(uint64 id) constant returns (bool) {
        return block.timestamp > feeds[id].expiration;
    }

    function free(uint64 id) constant returns (bool) {
        return address(feeds[id].token) == address(0);
    }

    function paymentNeeded(uint64 id) constant returns (bool) {
        return !free(id) && !feeds[id].paid;
    }

    //------------------------------------------------------------------
    // For feed owners
    //------------------------------------------------------------------

    function claim(ERC20 token) returns (uint64 id) {
        id = next++;
        if (next == 0) throw;
        feeds[id].owner = msg.sender;
        feeds[id].token = token;
        Claimed(id);
    }

    function claim() returns (uint64) {
        return claim(ERC20(0));
    }

    modifier auth(uint64 id) {
        if (msg.sender != feeds[id].owner) throw;
        _
    }

    function setDescription(uint64 id, bytes32 description)
        auth(id)
    {
        feeds[id].description = description;
        Configured(id);
    }

    function setFee(uint64 id, uint fee)
        auth(id)
    {
        if (free(id)) throw;
        feeds[id].fee = fee;
        Configured(id);
    }

    function publish(uint64 id, bytes32 value, uint64 expiration)
        auth(id)
    {
        feeds[id].value = value;
        feeds[id].timestamp = uint64(block.timestamp);
        feeds[id].expiration = expiration;
        feeds[id].paid = false;
        Published(id);
    }

    function transfer(uint64 id, address owner)
        auth(id)
    {
        feeds[id].owner = owner;
        Configured(id);
    }

    //------------------------------------------------------------------
    // For consumers
    //------------------------------------------------------------------

    function read(uint64 id) returns (bytes32) {
        var (value, ok) = tryRead(id);
        if (!ok) throw;
        return value;
    }

    function tryRead(uint64 id) returns (bytes32 value, bool ok) {
        if (expired(id) || !pay(id, msg.sender)) {
            return (0x0, false);
        } else {
            return (feeds[id].value, true);
        }
    }

    function pay(uint64 id, address payer) internal returns (bool ok) {
        var feed = feeds[id];

        if (!paymentNeeded(id)) {
            ok = true;
        } else {
            feed.paid = true;
            if (feed.token.transferFrom(payer, feed.owner, feed.fee)) {
                Paid(id);
                ok = true;
            } else {
                ok = false;
                feed.paid = false;
            }
        }
    }
}
