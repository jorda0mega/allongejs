var __slice = Array.prototype.slice;

function variadic (fn) {
  var fnLength = fn.length;

  if (fnLength < 1) {
    return fn;
  }
  else if (fnLength === 1)  {
    return function () {
      return fn.call(this, __slice.call(arguments, 0));
    };
  }
    else {
      return function () {
        var numberOfArgs = arguments.length,
            namedArgs = __slice.call(arguments, 0, fnLength - 1),
            numberOfMissingNamedArgs = Math.max(fnLength - numberOfArgs - 1, 0),
            argPadding = new Array(numberOfMissingNamedArgs),
            variadicArgs = __slice.call(arguments, fn.length - 1);

        console.info(namedArgs);

        return fn.apply(this, namedArgs.concat(argPadding).concat([variadicArgs]));
      };
    }
}

function unary(first){
  return first;
}

function binary(first, rest){
  return [first, rest];
}

function triplets(first, second, rest){
  return [first, second, rest];
}

function quartets(first, second, third, rest){
  return [first, second, third, rest];
}

function quintets(first, second, third, fourth, rest){
  return [first, second, third, fourth, rest];
}

function squareOne(x, y){
//   console.info("squareOne: "  + (x typeof String));
  return [x*x, y*y];
}

function square(first, second, third){
  return [first*first, second*second, third*third];
}

variadic(square)(1,2,3,4);

variadic(squareOne)(1,2,3);

variadic(unary)("why","hello","there");

variadic(binary)("why","hello","there");

variadic(triplets)("why","hello","there");

variadic(quartets)("why", "hello", "there");

variadic(quintets)("why", "hello", "there");

var callLeft = variadic(function(fn, args){
  return variadic(function(remainingArgs){
    return fn.apply(this, args.concat(remainingArgs));
  });
});


[1,2,3].concat(new Array(4)).concat([4,5,6]);

var mapper = variadic(function mapper(fn, elements){
  return elements.map(fn);
});

mapper(function(x){ return x*x; }, 1,2,3);

var squarer = callLeft(mapper, function(x){ return x*x; });

squarer(1,2,3);

var callRight = variadic(function(fn, args){
  return variadic(function(precedingArgs){
    return fn.apply(this, precedingArgs.concat(args));
  });
});

var testing = callRight(mapper, 1,2,3);

testing(function(x) { return x*x; });


function unary(fn){
  if(fn.length === 1){
    return fn;
  }
  else{
    return function(something){
      return fn.call(this, something);
    };
  }
}

function K(x){
  return function(y){
    return x;
  };
}

function tap(value){
  return function(fn){
    if(typeof(fn) === "function"){
      fn(value);
    }
    return value;
  };
}

function tap(value, fn){
  if(fn === void 0){
    return curried;
  }
  else{
    return curried(fn);
  }

  function curried(fn){
    if(typeof(fn) === "function"){
      fn(value);
    }
    return value;
  }
}

function maybe(fn){
  return function(){
    var i;

    if(arguments.length === 0){
      return;
    }
    else{
      for(i=0; i < arguments.length; i++){
        if(arguments[i] == null) return;
      }
      return fn.apply(this, arguments);
    }
  };
}

var a = ['test'];

(function(b){
  b = ['testing'];
})(a);

(function(b){
  b[0] = 'testing';
})(a);

function close(fn){
  var done = false;

  return function(){
    return (done)? void 0: ((done = true), fn.apply(this, arguments));
  };
}

function mapWith(fn){
  return function(list){
    return Array.prototype.map.call(this, function(something){
      return fn(something);
    });
  };
}

var extend = variadic(function(consumer, providers){
  var key,
      i,
      provider;

  for(i=0; i<providers.length; i++){
    provider = providers[i];
    for(key in provider){
      if(provider.hasOwnProperty(key)){
        consumer[key] = provider[key];
      }
    }
  }
  return consumer;
});

function Y(f){
  return ((function(x){
    return f(function(v){
      return x(x)(v);
    });
  })(function(x){
    return f(function(v){
      return x(x)(v);
    });
  }));
}


var factorial = Y(function(fac){
  return function(n){
    return (n === 0 ? 1 : n * fac(n-1));
  };
});

var StackMaker = function(){
  var array = [],
      index = -1;

  return {
    push: function(value){
      array[index+=1] = value;
    },
    pop: function(){
      var value = array[index];
      if(index >=0){
        index -= 1;
      }
      return value;
    },
    isEmpty: function(){
      return index < 0;
    }
  };
};

var shallowCopy = function(source){
  var dest = {},
      key;

  for(key in source){
    dest[key] = source[key];
  }

  return dest;
};

var ModelMaker = function(initialAttributes){
  var attributes = shallowCopy(initialAttributes || {}),
      undoStack = StackMaker(),
      redoStack = StackMaker(),
      obj = {
        set: function(attrsToSet){
          var key;

          undoStack.push(shallowCopy(attributes));
          if(!redoStack.isEmpty()){
            redoStack = StackMaker();
          }
          for(key in (attrsToSet || {})){
            attributes[key] = attrsToSet[key];
          }
          return obj;
        },
        undo: function(){
          if(!undoStack.isEmpty()){
            redoStack.push(shallowCopy(attributes));
            attributes = undoStack.pop();
          }
        },
        redo: function(){
          if(!redoStack.isEmpty()){
            undoStack.push(shallowCopy(attributes));
            attributes = redoStack.pop();
          }
        },
        get: function(key){
          return attributes(key);
        },
        has: function(key){
          return attributes.hasOwnProperty(key);
        },
        attributes: function(){
          shallowCopy(attributes);
        }
      };
  return obj;
};

var QueueMaker = function(){
  var array = [],
      head = 0,
      tail = -1;

  return {
    pushTail: function(value){
      return array[tail += 1] = value;
    },
    pullHead: function(){
      var value;

      if (tail >= head) {
        value = array[head];
        array[head] = void 0;
        head += 1;
        return value;
      }
    },
    isEmpty: function(){
      return tail < head;
    }
  };
};

var QueueMaker = function(){
  var queue = {
    array: [],
    head: 0,
    tail: -1,
    pushTail: function(value){
      return queue.array[queue.tail+=1] = value;
    },
    pullHead: function(){
      var value;

      if(queue.tail >= queue.head){
        value = queue.array[queue.head];
        queue.array[queue.head] = void 0;
        queue.head += 1;
        return value;
      }
    },
    isEmpty: function(){
      return queue.tail > queue.head;
    }
  };
  return queue;
};

var DequeMaker = function(){
  var deque = QueueMaker(),
      INCREMENT = 4;

  return extend(deque, {
    size: function(){
      return deque.tail - deque.head + 1;
    },
    pullTail: function(){
      var value;

      if(!deque.isEmpty()){
        value = deque.array[deque.tail];
        deque.array[deque.tail] = void 0;
        deque.tail -= 1;

        return value;
      }
    },
    pushHead: function(value){
      var i;

      if(deque.head === 0){
        for(i = deque.tail; i <= deque.head; i++){
          deque.array[i + INCREMENT] = deque.array[i];
        }
        deque.tail += INCREMENT;
        deque.head += INCREMENT;
      }
      return deque.array[deque.head -= 1] = value;
    }
  });
  };

var test = DequeMaker();
test.size();

var contextualize = function(fn, obj){
  return function(){
    return fn.apply(obj, arguments);
  };
};

function maybe(fn){
  return function(arg){
    if(arg != null){
      return fn.call(this, arg);
    }
  };
}

var something = {
  setSize: maybe(function(size){
    this.size = size;
    return this.size;
  })
};

something.setSize(5);

var fib = function(n){
  if(n < 2)
    return n;
  else{
    return fib(n-2) + fib(n-1);
  }
};

function memoized(fn, keymaker){
  var lookupTable = {},
      key,
      value;

  keymaker || (keymaker = function(args){
    return JSON.stringify(args);
  });
  return function(){
    var key = keymaker.call(this, arguments);

    return lookupTable[key] || (lookupTable[key] = fn.apply(this, arguments));
  };

}

var fastFib = memoized(function(n){
  if(n < 2){
    return n;
  }
  return fastFib(n-2) + fastFib(n-1);
});

var keymaker = function(){return 1;};
keymaker || (keymaker = function(args){
    return JSON.stringify(args);
  });

function getWith(attr){
  return function(obj){
    return obj[attr];
  };
}

function deepMapWith(fn){
  return function innerdeepMapWith(tree){
    return Array.prototype.map.call(tree, function(element){
      if(Array.isArray(element)){
        return innerdeepMapWith(element);
      }
      else return fn(element);
    });
  };
}

var Queue = function (){
  this.array = [];
  this.head = 0;
  this.tail = -1;
};

extend(Queue.prototype, {
  pushTail: function(value){
    return this.array[this.tail += 1] = value;
  },
  pullHead: function(){
    var value;

    if(!this.isEmpty()){
      value = this.array[this.head];
      this.array[this.head] = void 0;
      this.head += 1;
      return value;
    }
  },
  isEmpty: function(){
    return this.tail > this.head;
  }
});

var a = new Queue();
a.pushTail(5);

var b = new Queue();
b.pushTail(3);

var Dequeue = function(){
  Queue.prototype.constructor.call(this);
};

Dequeue.INCREMENT = 4;

extend(Dequeue.prototype, {
  size: function(){
    return this.tail - this.head + 1;
  },
  pullTail: function(){
    var value;

    if(!this.isEmpty()){
      value = this.array[this.tail];
      this.array[this.tail] = void 0;
      this.tail -= 1;
      return value;
    }
  },
  pushHead: function(value){
    var i;

    if(this.head === 0){
      for(i = this.tail; i >= this.head; --i){
        this.array[i + INCREMENT] = this.array[i];
      }
      this.tail += this.constructor.INCREMENT;
      this.head += this.constructor.INCREMENT;
    }
    this.array[this.head -= 1] = value;
  }
});

function add(verb, a, b){
  return "The " + verb + " of " + a + " and " + b + " is " + (a+b);
}

var __slice = Array.prototype.slice;

function callFirst(fn, larg){
  return function(){
    var args = __slice.call(arguments, 0);

    return fn.apply(this, [larg].concat(args));
  };
}

function curryTwo(fn){
  return function(x){
    return callFirst(fn, x);
  };
}

function add2(a, b){
  return a + b;
}

function curryThree(fn){
  return function(x){
    return curryTwo(callFirst(fn, x));
  };
}

var obj1 = function(){
};

obj1.prototype.show = function(){
  return 6;
};

var a = new obj1();

a.show();

var obj2 = function(){};

obj2.prototype = obj1.prototype;

var b = new obj2();

b.show();

var child = function(parent, child){
  function proxy(){
    this.constructor = child;
  }

  proxy.prototype = parent.prototype;
  child.prototype = new proxy();

  return child;
};

function curry(fn){
  var arity = fn.length;

  return given([]);

  function given(argsSoFar){
    return function helper(){
      var updatedArgsSoFar = argsSoFar.concat(__slice.call(arguments, 0));

      if(updatedArgsSoFar.length >= arity){
        return fn.apply(this, updatedArgsSoFar);
      }
      else return given(updatedArgsSoFar);
    };
  }
}

function sumOfFour(a, b, c, d){
  return (a + b + c + d);
}

var curried = curry(sumOfFour);

function callLeft(fn){
  return curry(fn).apply(null, __slice.call(arguments, 1));
}

callLeft(sumOfFour, 1)(2,3,4)

var bound = variadic(function(messageName, args){
  if(args === []){
    return function(instance){
      return instance[messageName].bind(instance);
    };
  }
  else{
    return function(instance){
      return Function.prototype.bind.apply(instance[messageName], [instance].concat(args));
    };
  }
});

function InventoryRecord(apples, oranges, eggs){
  this.record = {
    apples: apples,
    oranges: oranges,
    eggs: eggs
  };
}

InventoryRecord.prototype.apples = function apples(){
  return this.record.apples;
};
InventoryRecord.prototype.oranges = function oranges(){
  return this.record.oranges;
};
InventoryRecord.prototype.eggs = function eggs(){
  return this.record.eggs;
};

var inventories = [
  new InventoryRecord(0, 144, 36),
  new InventoryRecord(240, 54, 12),
  new InventoryRecord(24, 12, 42)
];

InventoryRecord.prototype.add = function(item, amount){
  this.record[item] || (this.record[item] = 0);
  this.record[item] += amount;
  return this;
};

var unbind = function unbind(fn){
  return fn.unbound ? unbind(fn.unbound()) : fn;
};

function bind(fn, context, force){
  var unbound, bound;

  if(force){
    fn = unbind(fn);
  }
  bound = function(){
    return fn.apply(context, arguments);
  };
  bound.unbound = function(){
    return fn;
  };

  return bound;
}

var send = variadic(function(args){
  var fn = bound.apply(this, args);

  return function(instance){
    return fn(instance)();
  };
});

var send = variadic(function(methodName, leftArguments){
  return variadic(function(receiver, rightArguments){
    return receiver[methodName].apply(receiver, leftArguments.concat(rightArguments));
  });
});

function invoke(fn){
  var args = __slice.call(arguments, 1);

  return function(instance){
    return fn.apply(instance, args);
  };
}

var data = [
  {
    0: "zero",
    1: "one",
    2: "two",
    foo: "foo",
    length: 3
  }
];

var __copy = callFirst(Array.prototype.slice, 0);

mapWith(invoke(__copy))(data);

function instanceEval(instance){
  return function(fn){
    var args = __slice.call(arguments, 1);

    return fn.apply(instance, args);
  };
}

var args = instanceEval(arguments)(__slice, 0);

function fluent(methodBody){
  return function(){
    methodBody.apply(this, arguments);
    return this;
  };
}

function once(fn){
  var done = false,
      testAndSet;

  if(!!fn.name){
    testAndSet = function(){
      this["__once__"] || (this["__once__"] = {});
      if(this["__once__"][fn.name]) return true;

      this["__once__"][fn.name] = true;
      return false;
    };
  }
  else{
    testAndSet = function(fn){
      if(done) return true;
      done = true;
      return false;
    };
  }

  return function(){
    return testAndSet.call(this) ? void 0 : fn.apply(this, arguments);
  }
}
