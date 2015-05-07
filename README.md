# console-trap

A simple wrapper for console allowing the capturing calls to all methods on the
console object.

Creates a wrapper for every method in the console object.
Saves all calls against the object to a buffer that can be queried for testing
or other purposes.

I wrote this to facilitate the testing of devtools used in design/development
that log/warn to console as a method of feedback


## Installation

`npm install console-trap`

## Example

CommonJS

```js
var Console = require("console-trap")

Console.log("hello world!")
Console.log("second call!")

Console.log.snapshot().getCall(0).getArg(0);
//outputs: "hello world!"
```

## Note

The object is instantiated as a global varable named Console. Therefore it is 
a singleton and the same instance will be returned no matter where you 
call it from in separate source files. The true order of calls will 
be preserved.

## Api


Empty the buffer:
```js
Console.log.empty();
```

Flush all calls to this method to the original console and empty the buffer
```js
Console.log.flush();
```


Each console method has a snapshot method attached to it.
This returns an array of all the calls that have been made to that method in
the form of the arguments passed to it.
```js
var snapshot = console.log.snapshot();
//[{0: "hello world!"},{0: "second call!"}]
```

It also can be queried for specific calls or arguments
```js
var firstCall = snapshot.getCall(0);
//{0: "hello world!"}

snapshot.getCall(1).getArg(0); or
firstCall.getArg(0);
//"second call!"

snapshot.calls;
//[{0: "hello world!"},{0: "second call!"}]

snapshot.callCount;
//2

```


The global Console object also has some 'master' controls.


Disable the call to original console method.
```js
Console.disable();
```

Enable the call to original console method [on by default]
```js
Console.enable();
```

Flush all buffers to console (in order called, usefull with .disable())
```js
Console.flushAll();
```

Override the default console object
```js
Console.hijack();
```

Return the console object back to its original
```js
Console.noConflict();
```

## Contributors

 - Danny Shaw

## MIT Licenced
