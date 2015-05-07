/* eslint no-console: 0 */
function ConsoleTrap() {
  var originalMethod;
  var _this = this;

  this._originalConsole = global.console;
  this.enabled = true;
  this.buffers = {};
  this.buffersOrder = [];

  //wrap the console method to capture the call
  //and call it if it's currently enabled..
  function createWrapper(method) {
    var wrapper = function() {
      _this.buffers[method].push(arguments);
      _this.buffersOrder.push({method: method, index: _this.buffers[method].length-1});
      if (_this.enabled) {
        this._originalConsole[method].apply(this._originalConsole, arguments);
      }
    };

    //add functions to enable querying the wrapper
    wrapper.snapshot = function() {
      var snap = _this.buffers[method].slice();

      snap.calls = snap;
      snap.callCount = snap.length;
      snap.getCall = function(callIndex) {
        var args = snap.length >= callIndex ? snap[callIndex] : [];
        args.getArg = function(argIndex) {
          var i = argIndex ||0;
          return args.length >= (i) ? args[i] : void 0;
        };
        return args;
      };
      return snap;
    };

    wrapper.empty = function() {
      _this.buffers[method] = [];
    };

    wrapper.flush = function() {
      var newBufferOrder = [];

      _this.buffers[method].forEach(function(callArgs) {
        _this._originalConsole[method].apply(_this._originalConsole, callArgs);
      });

      wrapper.empty();

      _this.buffersOrder.forEach(function(conCall) {
        if (conCall.method !== method) {
          newBufferOrder.push(conCall);
        }
      });

      _this.buffersOrder = newBufferOrder;
    };

    return wrapper;
  }

  //wrap all available console methods
  for (originalMethod in this._originalConsole) {
    if (typeof this._originalConsole[originalMethod] === 'function') {
      this.buffers[originalMethod] = [];
      this[originalMethod] = createWrapper(originalMethod);
    }
  }

}

ConsoleTrap.prototype = {
  disable() {
    this.enabled = false;
  },
  enable() {
    this.enabled = true;
  },
  empty() {
    var methodName;
    for (methodName in this.buffers) {
      // console.log(buffer);
      if (this.buffers.hasOwnProperty(methodName)) {
        this[methodName].empty();
      }
    }
  },
  flushAll() {
    var callArgs;
    var _this = this;

    this.buffersOrder.forEach(function(conCall) {
      callArgs = _this.buffers[conCall.method][conCall.index];
      _this._originalConsole[conCall.method].apply(_this._originalConsole, callArgs);
    });
    this.buffersOrder = [];
    this.empty();
  },
  hijack: function() {
    global.console = this;
  },
  noConflict: function() {
    global.console = this._originalConsole;
  }
};


//crappy singleton (probably anti-)pattern
if (!global.ConsoleTrap) {
  global.ConsoleTrap = new ConsoleTrap();
}

module.exports = global.ConsoleTrap;
