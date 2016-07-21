import "dapple/test.sol";
import "erc20/erc20.sol";
import "feedbase.sol";

contract FeedbaseTest is Test,
    FeedbaseEvents
{
    FakePerson  assistant  = new FakePerson();
    FakeToken   token      = new FakeToken();
    Feedbase    feedbase   = new Feedbase();

    uint72      id;

    function setUp() {
        assistant._target(feedbase);
        id = feedbase.claim(token);
    }

    function soon()     returns (uint40) { return uint40(now + 1); }
    function recently() returns (uint40) { return uint40(now - 1); }

    //------------------------------------------------------------------
    // Feed configuration and setup
    //------------------------------------------------------------------

    function test_claim() {
        expectEventsExact(feedbase);

        Claimed(feedbase.claim(), address(this), ERC20(0));
        Claimed(feedbase.claim(token), address(this), token);
    }

    //------------------------------------------------------------------

    function test_reprice() {
        expectEventsExact(feedbase);

        feedbase.reprice (id, 50);
        Repriced         (id, 50);

        assertEq(feedbase.price(id), 50);
    }

    function testFail_reprice_illicit() {
        Feedbase(assistant).reprice(id, 50);
    }

    function testFail_reprice_charity() {
        feedbase.reprice(feedbase.claim(), 50);
    }

    //------------------------------------------------------------------

    function test_redescribe() {
        expectEventsExact(feedbase);

        feedbase.redescribe (id, "foo");
        Redescribed         (id, "foo");

        assertEq32(feedbase.description(id), "foo");
    }

    function testFail_redescribe_illicit() {
        Feedbase(assistant).redescribe(id, "foo");
    }

    //------------------------------------------------------------------

    function test_transfer() {
        expectEventsExact(feedbase);

        feedbase.transfer (id, assistant);
        Transferred       (id, assistant);

        Feedbase(assistant).reprice (id, 50);
        Repriced                    (id, 50);

        assertEq(feedbase.price(id), 50);
    }

    //------------------------------------------------------------------
    // Publishing and reading values
    //------------------------------------------------------------------

    function test_read_free() {
        expectEventsExact(feedbase);
        
        id = feedbase.claim();
        Claimed          (id, address(this), ERC20(0));

        feedbase.publish (id, 0xffffffff, soon());
        Published        (id,             soon());

        var (ok, value) = assistant.read(id);
        assertTrue(ok);
        assertEq32(value, 0xffffffff);
    }

    function test_read_priced() {
        expectEventsExact(feedbase);

        feedbase.reprice (id, 50);
        Repriced         (id, 50);

        feedbase.publish (id, 0xffffffff, soon());
        Published        (id,             soon());

        token.allocate(assistant, 2000);

        var (ok, value) = assistant.read(id);
        Purchased(id, address(assistant));
        assertTrue(ok);
        assertEq32(value, 0xffffffff);

        assertEq(token.balances(assistant), 1950);
    }

    function test_read_priced_again() {
        expectEventsExact(feedbase);

        feedbase.reprice (id, 50);
        Repriced         (id, 50);

        feedbase.publish (id, 0xffffffff, soon());
        Published        (id,             soon());

        token.allocate(assistant, 2000);

        var (ok_1, value_1) = assistant.read(id);
        Purchased(id, address(assistant));
        assertTrue(ok_1);
        assertEq32(value_1, 0xffffffff);

        var (ok_2, value_2) = assistant.read(id);
        assertTrue(ok_2);
        assertEq32(value_2, 0xffffffff);

        assertEq(token.balances(assistant), 1950);
    }

    function test_read_priced_no_money() {
        expectEventsExact(feedbase);

        feedbase.reprice (id, 50);
        Repriced         (id, 50);

        feedbase.publish (id, 0xffffffff, soon());
        Published        (id,             soon());

        token.allocate(assistant, 49);

        var (ok, value) = assistant.read(id);
        assertFalse(ok);
        assertEq32(value, 0x0);

        assertEq(token.balances(assistant), 49);
    }

    function test_read_priced_no_money_no_throwing() {
        expectEventsExact(feedbase);

        feedbase.reprice (id, 50);
        Repriced         (id, 50);

        feedbase.publish (id, 0xffffffff, soon());
        Published        (id,             soon());

        token.allocate(assistant, 49);
        token.disable_throwing();

        var (ok, value) = assistant.read(id);
        assertFalse(ok);
        assertEq32(value, 0x0);

        assertEq(token.balances(assistant), 49);
    }

    function test_read_expired() {
        expectEventsExact(feedbase);

        feedbase.publish (id, 0xffffffff, recently());
        Published        (id,             recently());

        var (ok, value) = feedbase.read(id);
        assertFalse(ok);
        assertEq32(value, 0x0);
    }
}

//----------------------------------------------------------------------

contract FakePerson is Tester
{
    // We need to have a custom implementation of this particular
    // function in order to be able to access these return values.
    function read(uint72 id) returns (bool, bytes32) {
        return Feedbase(_t).read(id);
    }
}

contract FakeToken is ERC20
{
    mapping (address => uint) public   balances;
    bool                               throwing_disabled;

    function allocate(address account, uint balance) {
        balances[account] = balance;
    }

    function disable_throwing() {
        throwing_disabled = true;
    }

    function transferFrom(
        address  account,
        address  recipient,
        uint     amount
    ) returns (
        bool     ok
    ) {
        if (amount <= balances[account]) {
            balances[account]   -= amount;
            balances[recipient] += amount;
            ok = true;
        } else if (throwing_disabled) {
            ok = false;
        } else {
            throw;
        }
    }

    function totalSupply ()                     constant returns (uint) {}
    function balanceOf   (address a)            constant returns (uint) {}
    function allowance   (address a, address b) constant returns (uint) {}
    function approve     (address a, uint x)             returns (bool) {}
    function transfer    (address a, uint x)             returns (bool) {}
}
