import "dappsys/token/erc20.sol";

contract Feedbase {
    event Update(uint64 indexed id);

    struct Feed {
        bytes32 value;
        address owner;
        uint timestamp;
        uint expires;
        ERC20 token;
        uint cost;
        bool paid;
    }

    uint32 next_id;
    mapping(uint64 => Feed) _feeds;

    modifier auth(uint64 id) {
        if (msg.sender != _feeds[id].owner) {
          throw;
        }
        _
    }

    function claim() returns (uint64 id) {
        id = next_id++;

        if (next_id == 0) {
            throw; // Ran out of IDs.
        }

        var feed = _feeds[id];
        feed.owner = msg.sender;
        Update(id);
    }

    function set(uint64 id, bytes32 value, uint expires) auth(id) {
        var feed = _feeds[id];

        feed.value = value;
        feed.timestamp = block.timestamp;
        feed.expires = expires;
        feed.paid = false;

        Update(id);
    }

    function configure(uint64 id, uint cost, ERC20 token) auth(id) {
        var feed = _feeds[id];

        feed.cost = cost;
        feed.token = token;

        Update( id );
    }

    function transfer(uint64 id, address to) auth(id) {
        _feeds[id].owner = to;
        Update(id);
    }

    function get(uint64 id) returns (bytes32 value) {
        var feed = _feeds[id];

        if (block.timestamp > feed.expires) {
            throw;
        }

        if (!feed.paid) {
            feed.token.transferFrom(msg.sender, feed.owner, feed.cost);
            feed.paid = true;
        }

        return feed.value;
    }
}
