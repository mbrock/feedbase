import "dappsys/token/erc20.sol";

contract FeedbaseEvents {
    event Claimed    (uint72 indexed id);
    event Configured (uint72 indexed id);
    event Published  (uint72 indexed id);
    event Paid       (uint72 indexed id);
}

contract Feedbase is FeedbaseEvents {
    Feed[2**72]  feeds;
    uint72       next;

    struct Feed {
        address  owner;
        bytes32  description;
        uint     fee;
        ERC20    token;

        bytes32  value;
        uint40   timestamp;
        uint40   expiration;
        bool     paid;
    }

    function owner(uint72 id)
    constant returns (address) { return feeds[id].owner; }

    function description(uint72 id)
    constant returns (bytes32) { return feeds[id].description; }

    function fee(uint72 id)
    constant returns (uint)    { return feeds[id].fee; }

    function token(uint72 id)
    constant returns (ERC20)   { return feeds[id].token; }

    function timestamp(uint72 id)
    constant returns (uint40)  { return feeds[id].timestamp; }

    function expiration(uint72 id)
    constant returns (uint40)  { return feeds[id].expiration; }

    function paid(uint72 id)
    constant returns (bool)    { return feeds[id].paid; }

    //------------------------------------------------------------------

    function expired(uint72 id) constant returns (bool) {
        return block.timestamp > feeds[id].expiration;
    }

    function free(uint72 id) constant returns (bool) {
        return address(feeds[id].token) == address(0);
    }

    function unpaid(uint72 id) constant returns (bool) {
        return !free(id) && !feeds[id].paid;
    }

    //------------------------------------------------------------------
    // For feed owners
    //------------------------------------------------------------------

    function claim(ERC20 token) returns (uint72 id) {
        id = next++;
        if (next == 0) throw;
        feeds[id].owner = msg.sender;
        feeds[id].token = token;
        Claimed(id);
    }

    function claim() returns (uint72 id) {
        return claim(ERC20(0));
    }

    modifier auth(uint72 id) {
        if (msg.sender != feeds[id].owner) throw;
        _
    }

    function set_description(uint72 id, bytes32 description)
        auth(id)
    {
        feeds[id].description = description;
        Configured(id);
    }

    function set_fee(uint72 id, uint fee)
        auth(id)
    {
        if (free(id)) throw;
        feeds[id].fee = fee;
        Configured(id);
    }

    function publish(uint72 id, bytes32 value, uint40 expiration)
        auth(id)
    {
        feeds[id].value       = value;
        feeds[id].timestamp   = uint40(block.timestamp);
        feeds[id].expiration  = expiration;
        feeds[id].paid        = false;
        Published(id);
    }

    function transfer(uint72 id, address owner)
        auth(id)
    {
        feeds[id].owner = owner;
        Configured(id);
    }

    //------------------------------------------------------------------
    // For consumers
    //------------------------------------------------------------------

    function read(uint72 id) returns (bool ok, bytes32 value) {
        if (!expired(id) && pay(id, msg.sender)) {
            return (true, feeds[id].value);
        } else {
            return (false, 0);
        }
    }

    function pay(uint72 id, address payer) internal returns (bool ok) {
        if (!unpaid(id)) return true;

        var feed = feeds[id];

        feed.paid = true;

        ok = feed.token.call(bytes4(sha3(
            "transferFrom(address,address,uint256)"
        )), payer, feed.owner, feed.fee);

        if (ok) {
            Paid(id);
        } else {
            feed.paid = false;
        }
    }
}
