import "dapple/test.sol";
import "dappsys/token/base.sol";
import "feedbase.sol";

contract FeedbaseTester is Tester {
    // Type declaration needed to retrieve return value
    function read(uint64 id) returns (bytes32 value) {
        return Feedbase(_t).read(id);
    }
}

contract FeedbaseTest is Test, FeedbaseEvents {
    Feedbase feedbase = new Feedbase();
    DSToken dai = new DSTokenBase(1000);
    FeedbaseTester tester = new FeedbaseTester();

    uint64 id;

    function setUp() {
        tester._target(feedbase);
        id = feedbase.claim(dai);
    }

    function test_claim() {
        assertEq(id, uint(0));
        assertEq(feedbase.claim(dai), uint(1));
    }

    function test_set_description() {
        feedbase.setDescription(id, "foo");
        assertEq32("foo", feedbase.description(id));
    }

    function test_read_free_feed() {
        feedbase.publish(id, 0x42, uint64(block.timestamp + 1));
        assertEq32(tester.read(id), 0x42);
    }

    function testFail_set_fee_without_token() {
        var id2 = feedbase.claim();
        feedbase.setFee(id2, 100);
    }

    function test_read_paid_feed() {
        feedbase.publish(id, 0x42, uint64(block.timestamp + 1));
        feedbase.setFee(id, 100);
        dai.transfer(tester, 100);

        tester._target(dai);
        ERC20(tester).approve(feedbase, 100);

        tester._target(feedbase);
        assertEq(dai.balanceOf(tester), 100);
        var initial = dai.balanceOf(this);
        var value = tester.read(id);
        assertEq(dai.balanceOf(this) - initial, 100);
        assertEq(dai.balanceOf(tester), 0);
        assertEq32(value, 0x42);
    }

    function testFail_read_paid_feed() {
        feedbase.publish(id, 0x42, uint64(block.timestamp + 1));
        feedbase.setFee(id, 100);
        dai.transfer(tester, 99);

        tester._target(dai);
        DSToken(tester).approve(feedbase, 100);

        tester._target(feedbase);
        tester.read(id);
    }

    function test_read_paid_feed_twice() {
        feedbase.publish(id, 0x42, uint64(block.timestamp + 1));
        feedbase.setFee(id, 100);
        dai.transfer(tester, 100);

        tester._target(dai);
        ERC20(tester).approve(feedbase, 100);

        tester._target(feedbase);
        var pre = dai.balanceOf(this);
        var value1 = tester.read(id);
        var post1 = dai.balanceOf(this);
        var value2 = tester.read(id);
        var post2 = dai.balanceOf(this);
        assertEq(post1 - pre, 100);
        assertEq(post2 - post1, 0);
        assertEq32(value1, 0x42);
        assertEq32(value2, 0x42);
    }

    function testFail_read_expired_feed() {
        feedbase.publish(id, 0x42, uint64(block.timestamp - 1));
        feedbase.read(id);
    }

    function test_transfer() {
        feedbase.transfer(id, tester);
        Feedbase(tester).publish(id, 0x123, uint64(block.timestamp + 1));
        assertEq32(feedbase.read(id), 0x123);
    }

    function test_events() {
        expectEventsExact(feedbase);
        feedbase.setFee(id, 0);
        Configure(id);
        feedbase.setDescription(id, "foo");
        Configure(id);
        feedbase.publish(id, 0x42, uint64(block.timestamp + 1));
        Publish(id);
        feedbase.read(id);
        Pay(id);
        feedbase.read(id);
        feedbase.transfer(id, tester);
        Configure(id);
        var id2 = feedbase.claim(dai);
        Claim(id2);
    }
}
