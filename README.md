Project Eweda
=============

A practical functional library for Javascript programmers.  _Eweda lamb!_



Goals
-----

Using this library should feel as much like using Javascript as possible.  Of course it's functional Javascript, but
we're not introducting lambda expressions in strings, we're not borrowing CONsed lists, we're not porting over all of
the Clojure functions.

Our basic data structures will be normal Javascript objects, and our usual collections will be Javascript arrays.  We
will not try to reach the point where all the functions have only zero, one, or two arguments.  We will certainly try
to keep some of the normal features of Javascript that seem to be unusual in functional languages, including variable
length function signatures and functions as objects with properties.

Functional programming is in good part about immutable objects and side-effect free functions.  We will stick to that
as much as feasible, but will not be dogmatic about it.

As much as we can, we would like the implementation to be both clean and elegant.  But the API is king: we will
sacrifice a great deal of implementation elegance for even a slightly cleaner API.


Documentation
-------------

Annoated source code documentation generated by [Docco](http://jashkenas.github.io/docco/) is at
https://rawgithub.com/CrossEye/eweda/master/docs/eweda.html.  So far, that's the only documentation available.


The Name
--------

Ok, so we like bad puns.  That's all.  It's a short name, not already taken.  It could as easily have been `ramda`, but
then we wouldn't be able to say " _eweda lamb!_ "  For non-English speakers, lambs are baby sheep, ewes are female sheep,
and rams are male sheep.  So perhaps eweda is a grown-up lambda... but probably not.



Structure
---------

### Replaceable Core ###

Eweda is designed in good part around manipulating lists of objects.  But the implementation of lists is meant to be
replaceable.  By default, eweda uses a simple implementation using arrays, but the exposed object is a function that
accepts a different implementation of lists and returns a new version of the API built around those lists.  In
`test/test.bootstrapping.js`, we explore a detailed example built around Scheme/LISP-style lists, as described in
[buzzdecafe's gist](https://gist.github.com/buzzdecafe/5272249).

We can construct a new implementation of the API like this:

    var cons = function(x, y) {return function(pick) {return pick(x, y);};};
    var car = function(fn) {return fn(function(x, y) { return x; });};
    var cdr = function(fn) {return fn(function(x, y) { return y; });};
    var atom = function(x) {return (x !== null) && (x !== undefined) && !x.pair;};
    var isEmpty = function(list) {return list == null;},

    // These core properties need to be supplied.  Others can also be supplied to override the defaults.
    var ramda = eweda({
        EMPTY: null,
        isEmpty: isEmpty,
        prepend: cons,
        head: car,
        tail: cdr,
        isAtom: atom
    });

We can make the functions here global by calling

    ramda.installTo(this)

in a global context, and then with these functions defined:

    var square = function(x) {return x * x;};
    var even = function(n) {return (n % 2) == 0;};

We can now call

    map(square, filter(even, range(0, 15)));

to get something equivalent to:

    (0 4 16 36 64 100 144 196)

which, under the hood, is the same as

    cons(0, cons(4, ... cons(144, cons(196, null)) ... ))



### Automatic Currying ###

The functions included should automatically allow for partial application without an explicit call to lPartial.  Many of
these operate on lists.  A single list parameter should probably come last, which might conflict with the design of
other libraries that have strong functional components (I'm looking at you Underscore!)

The idea is that, if foldl has this signature:

    var foldl = function(fn, accum, arr) { /* ... */}

and we have this simple function:

    var add = function(a, b) {return a + b;};

then, instead of having to manually call lPartial like this:

     var sum = lPartial(foldl, add, 0);
     var total = sum([1, 2, 3, 4]);

we could just do this:

     var sum = foldl(add, 0);
     var total = sum([1, 2, 3, 4]);



Functions included
-------------------

We want to include the basic functions that will help a Javscript programmer work with objects and arrays.  We will try
to use the most common names for these, possibly using multiple aliases for those that are most debated.

### Core ###

  * isEmpty
  * prepend
  * append
  * merge
  * head
  * tail
  * size

### Functions ###

  * compose (fog)
  * pipe (sequence) (i.e., like compose but in reverse order)
  * flip
  * partial (applyLeft)
  * rPartial (applyRight)
  * memoize
  * once
  * wrap

### Lists ###

  * map
  * foldl (reduce)
  * foldl1
  * foldr (reduceRight)
  * foldr1
  * filter
  * reject
  * take
  * skip (drop)
  * find
  * all (every)
  * any (some)
  * contains
  * uniq
  * pluck
  * flatten
  * zip
  * zipWith
  * xprod (i.e. cartesian product)
  * xprodWith (i.e. cartesian product with function)
  * reverse
  * range

### Objects ###

  * tap (K)
  * eq
  * prop
  * func
  * props
  * identity (I)
  * alwaysTrue
  * alwaysFalse
  * alwaysZero
  * maybe
  * keys
  * values

### Logic ###

  * and
  * or
  * not
  * andFn
  * orFn
  * notFn

### Arithmetic ###

  * add
  * multiply
  * subtract
  * divide
  * sum
  * product
