var Console = require('../index');
var expect = require('chai').expect;



describe('ConsoleTrap', function() {
  beforeEach(function() {
    Console.disable();
  });

  afterEach(function() {
    Console.empty();
  });

  it('wraps all methods of console except memory and profile', function() {
    var method;
    var except = ['memory', 'profiles'];

    for (method in console) {

      if (console.hasOwnProperty(method) && except.indexOf(method) < 0) {
        var test = Console[method];
        expect(test).to.be.a('function');
      }

    }
  });

  it('captures arguments of calls against methods, accessible via snapshot()', function() {
    var logs;
    var firstCall;
    var secondCall;


    Console.log('first argument', 'second argument');
    Console.log('second call');

    logs = Console.log.snapshot();

    //2 calls
    expect(logs).length.to.be(2);
    firstCall = logs.calls[0];
    secondCall = logs.calls[1];

    //first call arguments
    expect(firstCall[0]).to.equal('first argument');
    expect(firstCall[1]).to.equal('second argument');

    //second call one argument
    expect(secondCall[0]).to.equal('second call');
  });


  it('allows access to specific calls via .getCall() on snapshot object', function() {
    var snapshot;
    var firstCall;
    Console.log('first argument', 'second argument');
    Console.log('second call');

    snapshot = Console.log.snapshot();

    firstCall = snapshot.getCall(0);
    expect(firstCall[0]).to.equal('first argument');
    expect(firstCall[1]).to.equal('second argument');
  });

  it('allows access to specific arguments calls via .getArg() on getCall() object', function() {
    var firstCall;
    Console.log('first argument', 'second argument');
    Console.log('second call');

    firstCall = Console.log.snapshot().getCall(0);

    expect(firstCall.getArg(0)).to.equal('first argument');
    expect(firstCall.getArg(1)).to.equal('second argument');
  });

  it('returns undefined on non existant calls and args', function() {
    var noCall;
    Console.log('first argument', 'second argument');

    noCall = Console.log.snapshot().getCall(10);
    expect(noCall.length).to.equal(0);
    expect(noCall.getArg(0)).to.equal(undefined);
    expect(Console.log.snapshot().getCall(0).getArg(5)).to.equal(undefined);
  });


  it('^^will logged right above this line!', function() {
    Console.enable();
    Console.log('here tis');
    expect(Console.log.snapshot()).length.to.be(1);
  });

  it('^^will dump the logs and empty the buffer when flush() is called on method', function() {
    Console.log('here tis');
    Console.log('and again');
    expect(Console.log.snapshot().calls.callCount).to.equal(2);
    Console.log.flush();
    expect(Console.log.snapshot().calls.callCount).to.equal(0);
  });

  it('^^will retain other method buffers flush() is called on method', function() {
    Console.log('here tis');
    Console.warn('this is on warn...');
    Console.log.flush();
    expect(Console.log.snapshot().calls.callCount).to.equal(0);
    expect(Console.warn.snapshot().calls.callCount).to.equal(1);
  });

  it('^^will flush all buffers in order when Console.flushAll() is called', function() {
    Console.log('here tis');
    Console.warn('this is on warn...');
    expect(Console.log.snapshot().calls.callCount).to.equal(1);
    expect(Console.warn.snapshot().calls.callCount).to.equal(1);
    Console.flushAll();
    expect(Console.log.snapshot().calls.callCount).to.equal(0);
    expect(Console.warn.snapshot().calls.callCount).to.equal(0);
  });


  it('can override and return functionality to built in console when required', function() {
    var original = console;
    expect(original).to.equal(console);
    expect(Console).to.not.equal(console);
    Console.enable();

    //TODO work out how to test this properly as actually
    //overriding console breaks the tester.
/*
    Console.hijack();
    expect(console).to.equal(Console);
    expect(original).to.not.equal(console);
    console.log("first argument");
    expect(console.log.snapshot().callCount).to.equal(1);
*/
    //return original
    Console.noConflict();
    expect(original).to.equal(console);
    expect(Console).to.not.equal(console);
  });
});

