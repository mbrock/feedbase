import "dappsys/token/erc20.sol";

contract Feedbase {
    struct Feed {
        bytes32 value;
        address owner;
        uint timestamp;
        uint expiration;
        ERC20 token;
        uint cost;
        bool paid;
    }

    event FeedUpdate( uint64 indexed id );

    uint32 last_id;
    mapping( uint64 => Feed ) _feeds;

    modifier feed_owner( uint64 id ) {
        if( msg.sender != _feeds[id].owner ) {
            throw;
        }
        _
    }
    function setFeed(uint64 id, bytes32 value, uint expiration)
             feed_owner( id )
    {
        var feed = _feeds[id];
        feed.value = value;
        feed.timestamp = block.timestamp;
        feed.expiration = expiration;
        feed.paid = false;
        FeedUpdate( id );
    }
    function setFeedCost(uint64 id, uint cost, ERC20 token)
             feed_owner( id )
    {
        _feeds[id].cost = cost;
        _feeds[id].token = token;
        FeedUpdate( id );
    }
    function claim() returns (uint64 id) {
        last_id++;
        if( last_id == 0 ) { // ran out of IDs
            throw;
        }
        _feeds[last_id].owner = msg.sender;
        FeedUpdate(last_id);
        return last_id;
    }
    function transfer(uint64 id, address to)
             feed_owner( id )
    {
        _feeds[id].owner = to;
        FeedUpdate( id );
    }

    function get( uint64 id ) returns (bytes32 value) {
        var feed = _feeds[id];
        if( block.timestamp > feed.expiration ) {
            throw;
        }
        if( !feed.paid ) {
            feed.token.transferFrom(msg.sender, feed.owner, feed.cost);
            feed.paid = true;
        }
        return feed.value;
    }
}
