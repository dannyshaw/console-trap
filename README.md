# console-capture

A simple wrapper for console allowing the capturing calls to all methods on the
console object.

It will create a wrapper for every method that the console object has in the 
browser/environment it is run under and save all calls against the object
to a buffer that can be queried for testing, or other, purposes.

I wrote this to facilitate the testing of modules used in design/development 
that write to the console as a method of feedback


## Installation

`npm install console-capture`

## Example

```js
var console = require("console-capture")

console.log("hello world!")
console.log("second call!")

console.log.snapshot().getCall(0).getArg(0);
//outputs: "hello world!"
```

## Api

Disable the call to original console method
```js
console.disable();
```

Enable the call to original console method [on by default]
```js
console.enable();
```

Empty the buffer:
```js
console.log.empty();
```

Flush a buffer
```js
console.log.flush();
```

Flush all buffers to console (in order called)
```js
console.flushAll();
```



Each console method has a snapshot method attached to it.
This returns an array of all the calls that have been made to that method in
the form of the arguments passed to it.
```js
var snapshot = console.log.snapshot();
//[{0: "hello world!"},{0: "second call!"}]
```

It also can be queried for exact calls or arguments
```js
var firstCall = snapshot.getCall(0);
//{0: "hello world!"}

snapshot.getCall(1).getArg(0); or
firstCall.getArg(0);
//"second call!"

## Contributors

 - Danny Shaw

## MIT Licenced
