/// feedbase.sol --- feedbase is to feeds as a database is to data

import "erc20/erc20.sol";

// The reason why we use `uint72' for feed IDs is to help prevent
// accidentally confusing different values that have the same type.
//
// In particular, this is very error-prone when dealing with functions
// that take long lists of different parameters or return many values.
//
// Since `uint72' is a very uncommon type, it's much less likely that
// someone would mix up a feed ID with something completely unrelated.

contract FeedbaseEvents
{
    // Events logged by producers
    event Claimed      (uint72 indexed id,  address owner,  ERC20 token);
    event Published    (uint72 indexed id,  uint40  expiration);
    event Repriced     (uint72 indexed id,  uint    price);
    event Redescribed  (uint72 indexed id,  bytes32 description);
    event Transferred  (uint72 indexed id,  address recipient);

    // Events logged by consumers
    event Purchased    (uint72 indexed id,  address consumer);
}

contract Feedbase is FeedbaseEvents
{
    Feed[2**72]    feeds;
    uint72         next;

    struct Feed {
        address    owner;
        ERC20      token;

        bytes32    description;
        uint       price;

        bytes32    value;
        uint40     timestamp;
        uint40     expiration;

        bool       purchased;
    }

    //------------------------------------------------------------------
    // Public accessor functions
    //------------------------------------------------------------------

    function owner(uint72 id)
    constant returns (address) { return feeds[id].owner; }
    function token(uint72 id)
    constant returns (ERC20)   { return feeds[id].token; }
    function charity(uint72 id)
    constant returns (bool)    { return token(id) == ERC20(0); }

    function description(uint72 id)
    constant returns (bytes32) { return feeds[id].description; }
    function price(uint72 id)
    constant returns (uint)    { return feeds[id].price; }

    function timestamp(uint72 id)
    constant returns (uint40)  { return feeds[id].timestamp; }
    function expiration(uint72 id)
    constant returns (uint40)  { return feeds[id].expiration; }
    function expired(uint72 id)
    constant returns (bool)    { return now >= expiration(id); }

    function purchased(uint72 id)
    constant returns (bool)    { return feeds[id].purchased; }

    //------------------------------------------------------------------
    // Feed producer entrypoints
    //------------------------------------------------------------------

    function claim() returns (uint72 id) {
        id = claim(ERC20(0));
    }

    function claim(ERC20 token) returns (uint72 id) {
        id = next++;
        assert(next != 0);

        feeds[id].owner = msg.sender;
        feeds[id].token = token;

        Claimed(id, msg.sender, token);
    }

    modifier auth(uint72 id) {
        assert(msg.sender == owner(id));
        _
    }

    //------------------------------------------------------------------

    function publish(uint72 id, bytes32 value, uint40 expiration)
        auth(id)
    {
        feeds[id].value       = value;
        feeds[id].timestamp   = uint40(now);
        feeds[id].expiration  = expiration;
        feeds[id].purchased   = false;

        Published(id, expiration);
    }

    //------------------------------------------------------------------

    function reprice(uint72 id, uint price)
        auth(id)
    {
        assert(!charity(id));
        feeds[id].price = price;
        Repriced(id, price);
    }

    function redescribe(uint72 id, bytes32 description)
        auth(id)
    {
        feeds[id].description = description;
        Redescribed(id, description);
    }

    function transfer(uint72 id, address recipient)
        auth(id)
    {
        feeds[id].owner = recipient;
        Transferred(id, recipient);
    }

    //------------------------------------------------------------------
    // The feed consumer entrypoint
    //------------------------------------------------------------------

    function read(uint72 id) validate(id)
        returns (bool ok, bytes32 value)
    {
        ok     = true;
        value  = feeds[id].value;
    }

    //------------------------------------------------------------------

    modifier validate(uint72 id) {
        if (!expired(id) && eligible(msg.sender, id)) _
    }

    function eligible(address consumer, uint72 id)
        internal returns (bool ok)
    {
        if (charity(id) || purchased(id)) {
            ok = true;
        } else {
            ok = buy(consumer, id);
        }
    }

    // This wrapper function around `purchase()' normalizes the
    // prescence or abscence of errors into a single boolean value.
    function buy(address consumer, uint72 id)
        internal returns (bool ok)
    {
        ok = this.call(
            bytes4(sha3("purchase(address,uint72)")),
            consumer, id
        );
    }

    modifier loopback() {
        assert(msg.sender == address(this));
        _
    }

    function purchase(address consumer, uint72 id)
        loopback
    {
        feeds[id].purchased = true;
        assert(token(id).transferFrom(consumer, owner(id), price(id)));
        Purchased(id, consumer);
    }

    //------------------------------------------------------------------

    function assert(bool predicate) internal {
        if (!predicate) throw;
    }
}
