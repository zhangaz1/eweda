(function (root, factory) {if (typeof exports === 'object') {module.exports = factory();} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.eweda = factory();}}(this, function () { // see https://github.com/umdjs/umd/blob/master/returnExports.js

    var E = {};

    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var isArray = function(val) {return toString.call(val) === "[object Array]";};
    var alias = function(oldName, newName) {
        E[newName] = E[oldName];
    };

    var _ = function(fn) { // should we spell out "curry" or "partial" or leave super-short?
        var arity = fn.length;
        var f = function(args) {
            return function () {
                var newArgs = args.concat(slice.call(arguments, 0));
                if (newArgs.length >= arity) {
                    return fn.apply(this, newArgs)
                }
                else return f(newArgs)
            }
        };
        return f([]);
    };

    var emptyList = function(list) {
        return !list || !list.length;
    };

    // should prepend, head, tail, isAtom, etc be exposed?

    var prepend = E.prepend = function(el, arr) {
        return [el].concat(arr);
    };

    var head = E.head = function(arr) {
        arr = arr || [];
        return (arr.length) ? arr[0] : [];
    };

    var tail = E.tail = function(arr) {
        arr = arr || [];
        return (arr.length > 1) ? arr.slice(1) : [];
    };

    var isAtom = E.isAtom = function(x) {
        return (x !== null) && (x !== undefined) && !isArray(x);
    };

    var and = E.and = _(function (a, b) {
        return !!(a && b);
    });

    var or = E.or = _(function (a, b) {
        return !!(a || b);
    });

    var not = E.not = function (a) {
        return !a;
    };

    // Still not particularly happy with the names `andFn`, `orFn`, `notFn`, but at least Oliver Twist can pronounce one...

    var andFn = E.andFn = _(function(f, g) { // TODO: arity?
       return function() {return !!(f.apply(this, arguments) && g.apply(this, arguments));}
    });

    var orFn = E.orFn = _(function(f, g) { // TODO: arity?
       return function() {return !!(f.apply(this, arguments) || g.apply(this, arguments));}
    });

    var notFn = E.notFn = function (f) {
        return function() {return !f.apply(this, arguments)};
    };

    var foldl = E.foldl = _(function(fn, acc, arr) {
        return (emptyList(arr)) ? acc : foldl(fn, fn(acc, head(arr)), tail(arr));
    });
    alias("foldl", "reduce");

    var fold11 = E.fold11 = _(function (fn, arr) {
        if (emptyList(arr)) {
            throw new Error("foldl1 does not work on empty lists");
        }
        return foldl(fn, head(arr), tail(arr));
    });

    var foldr = E.foldr =_(function(fn, acc, arr) {
        return (emptyList(arr)) ? acc : fn(head(arr), foldr(fn, acc, tail(arr)));
    });
    alias("foldr", "reduceRight");

    var foldr1 = E.foldr1 = _(function (fn, arr) {
        if (emptyList(arr)) {
            throw new Error("foldr1 does not work on empty lists");
        }
        var rev = reverse(arr);
        return foldr(fn, head(rev), reverse(tail(rev)));
    });

    var flip = function(fn) {
        return function(a, b) {
            return fn.call(this, b, a);
        };
    };

    var append = E.append = _(function(arr1, arr2) {
        return (emptyList(arr1)) ? arr2 :  prepend(head(arr1), append(tail(arr1), arr2));
    });

    var reverse = E.reverse = foldl(flip(prepend), []);

    var map = E.map = _(function(fn, arr) {
        return (emptyList(arr)) ? [] : prepend(fn(head(arr)), map(fn, tail(arr)));
    });

// I think this was built around the wrong notion that all([]) => false... ask Mike
//    var all = E.all = _(function(fn, arr) {
//        function allAcc(list, acc) {
//            return (emptyList(list)) ? acc : allAcc(tail(list), fn(head(list)) && acc);
//        }
//        return (emptyList(arr)) ? false : allAcc(arr, true);
//    });

// elegant but doesn't short-circuit in our non-lazy language...
//    var all = E.all = _(function (fn, arr) {
//        return foldl(and, true, map(fn, arr));
//    });

    var all = E.all = _(function (fn, arr) {
        return (emptyList(arr)) ? true : fn(head(arr)) && all(fn, tail(arr));
    });
    alias("all", "every");

    var some = E.some = _(function(fn, arr) {
        return (emptyList(arr)) ? false : fn(head(arr)) || some(fn, tail(arr));
    });
    alias("some", "any");

    var filter = E.filter = _(function(fn, arr) {
        return (emptyList(arr)) ? [] : (fn(head(arr))) ? prepend(head(arr), filter(fn, tail(arr))) : filter(fn, tail(arr));
    });

    return E;
}));
