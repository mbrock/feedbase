import "dapple/test.sol";
import "dappsys/token/base.sol";
import "feedbase.sol";

contract GetProxy is Tester {
    function doGet(uint64 id) returns (bytes32 value) {
        return Feedbase(_t).get(id);
    }
}
contract FeedbaseTest is Test {
    Feedbase fb;
    GetProxy t1;
    uint64 feed1;
    DSToken dai = new DSTokenBase(1000);
    function setUp() {
        fb = new Feedbase();
        t1 = new GetProxy();
        t1._target(fb);
        feed1 = fb.claim();
    }
    function testSetup() {
        assertEq(uint(0), uint(feed1));
    }
    function testUpdateGetFree() {
        fb.update(feed1, 0x42, block.timestamp+1);
        assertEq32(t1.doGet(feed1), 0x42);
    }
    function testUpdateGetPaid() {
        fb.update(feed1, 0x42, block.timestamp+1);
        fb.setFee(feed1, 100, dai);
        dai.transfer(t1, 100);

        t1._target(dai);
        DSToken(t1).approve(fb, 100);
        
        t1._target(fb);
        assertEq(dai.balanceOf(t1), 100);
        var pre = dai.balanceOf(this);
        var value = t1.doGet(feed1);
        var post = dai.balanceOf(this);
        assertEq(post - pre, 100);
        assertEq(dai.balanceOf(t1), 0);
        assertEq32(value, 0x42);
    }
    function testFailUpdateGetPaid() {
        fb.update(feed1, 0x42, block.timestamp+1);
        fb.setFee(feed1, 100, dai);
        dai.transfer(t1, 99);

        t1._target(dai);
        DSToken(t1).approve(fb, 100);

        t1._target(fb);
        t1.doGet(feed1);
    }
    function testUpdateGetTwicePaidOnce() {
        fb.update(feed1, 0x42, block.timestamp+1);
        fb.setFee(feed1, 100, dai);
        dai.transfer(t1, 100);
        
        t1._target(dai);
        DSToken(t1).approve(fb, 100);
        
        t1._target(fb);
        var pre = dai.balanceOf(this);
        var value1 = t1.doGet(feed1);
        var post1 = dai.balanceOf(this);
        var value2 = t1.doGet(feed1);
        var post2 = dai.balanceOf(this);
        assertEq(post1 - pre, 100);
        assertEq(post2 - post1, 0);
        assertEq32(value1, 0x42);
        assertEq32(value2, 0x42);
    }
    function testUpdateGetPaidTokenBogus() {
        // A bogus token cost behaves as a zero cost
        fb.update(feed1, 0x42, block.timestamp+1);
        fb.setFee(feed1, 100, ERC20(0xdeadbeef));
        assertEq32(t1.doGet(feed1), 0x42);
    }
    function testFailGetExpiredFeed() {
        fb.update(feed1, 0x42, block.timestamp-1);
        fb.get(feed1);
    }
    function testTransfer() {
        fb.transfer(feed1, t1);
        Feedbase(t1).update(feed1, 0x123, block.timestamp+1);
        assertEq32(fb.get(feed1), 0x123);
    }
    event Update( uint64 indexed id );
    function testEvents() {
        expectEventsExact(fb);
        fb.setFee(feed1, 0, dai);
        Update(feed1);
        fb.update(feed1, 0x42, block.timestamp+1);
        Update(feed1);
        fb.transfer(feed1, t1);
        Update(feed1);
        var feed2 = fb.claim();
        Update(feed2);
    }
}
