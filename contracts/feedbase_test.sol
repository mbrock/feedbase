import "dapple/test.sol";
import "dappsys/token/base.sol";
import "feedbase.sol";

contract FeedbaseTester is Tester {
    // Type declaration needed to retrieve return value
    function getValue(uint64 id) returns (bytes32 value) {
        return Feedbase(_t).getValue(id);
    }
}

contract FeedbaseTest is Test {
    event Update(uint64 indexed id);
    
    Feedbase feedbase = new Feedbase();
    DSToken dai = new DSTokenBase(1000);
    FeedbaseTester tester = new FeedbaseTester();

    uint64 id;

    function setUp() {
        tester._target(feedbase);
        id = feedbase.claim(dai);
    }

    function test_claim() {
        assertEq(uint(0), uint(id));
        assertEq(uint(1), feedbase.claim(dai));
        assertEq(uint(2), feedbase.claim(dai));
    }

    function test_get_free_feed() {
        feedbase.setValue(id, 0x42, block.timestamp + 1);
        assertEq32(tester.getValue(id), 0x42);
    }

    function test_get_paid_feed() {
        feedbase.setValue(id, 0x42, block.timestamp + 1);
        feedbase.setFee(id, 100);
        dai.transfer(tester, 100);

        tester._target(dai);
        ERC20(tester).approve(feedbase, 100);

        tester._target(feedbase);
        assertEq(dai.balanceOf(tester), 100);
        var initial = dai.balanceOf(this);
        var value = tester.getValue(id);
        assertEq(dai.balanceOf(this) - initial, 100);
        assertEq(dai.balanceOf(tester), 0);
        assertEq32(value, 0x42);
    }
    
    function testFail_get_paid_feed() {
        feedbase.setValue(id, 0x42, block.timestamp + 1);
        feedbase.setFee(id, 100);
        dai.transfer(tester, 99);

        tester._target(dai);
        DSToken(tester).approve(feedbase, 100);

        tester._target(feedbase);
        tester.getValue(id);
    }
    
    function test_get_paid_feed_twice() {
        feedbase.setValue(id, 0x42, block.timestamp + 1);
        feedbase.setFee(id, 100);
        dai.transfer(tester, 100);

        tester._target(dai);
        ERC20(tester).approve(feedbase, 100);

        tester._target(feedbase);
        var pre = dai.balanceOf(this);
        var value1 = tester.getValue(id);
        var post1 = dai.balanceOf(this);
        var value2 = tester.getValue(id);
        var post2 = dai.balanceOf(this);
        assertEq(post1 - pre, 100);
        assertEq(post2 - post1, 0);
        assertEq32(value1, 0x42);
        assertEq32(value2, 0x42);
    }
    
    function testFail_get_expired_feed() {
        feedbase.setValue(id, 0x42, block.timestamp - 1);
        feedbase.getValue(id);
    }
    
    function test_transfer() {
        feedbase.transfer(id, tester);
        Feedbase(tester).setValue(id, 0x123, block.timestamp + 1);
        assertEq32(feedbase.getValue(id), 0x123);
    }
    
    function test_events() {
        expectEventsExact(feedbase);
        feedbase.setFee(id, 0);
        Update(id);
        feedbase.setDescription(id, "foo");
        Update(id);
        feedbase.setValue(id, 0x42, block.timestamp + 1);
        Update(id);
        feedbase.transfer(id, tester);
        Update(id);
        var id2 = feedbase.claim(dai);
        Update(id2);
    }
}
