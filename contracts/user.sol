import 'feedbase.sol';

contract FeedbaseUser is MakerUser
{
    Feedbase _feedbase;
    function FeedbaseUser( Feedbase feedbase, MakerUserLinkType makerlink )
             MakerUser( makerlink )
    {
        // static link trick
        if( feedbase == address(0x0) ) {
            // mainnet
            //_feedbase = Feedbase(0x0);
            throw;
        } else if (feedbase == address(0x1) ) {
            // morden
            //_feedbase = Feedbase(0x1);
            throw;
        } else {
            _feedbase = feedbase;
        }
    }
}
