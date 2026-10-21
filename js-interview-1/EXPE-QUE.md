# JavaScript Advanced – Interview-Ready Notes (Part 3)

Read this once and you should be able to answer each question confidently in an interview.

**How each question is structured**

- **Interview answer:** what to say out loud in 20–30 seconds
- **Analogy:** a real-life picture so you remember it
- **Code:** corrected, runnable examples with expected output
- **Follow-ups:** what interviewers usually ask next

## Table of Contents

1. [Event loop](#q1-explain-the-event-loop)
2. [Promise vs async/await](#q2-difference-between-a-promise-and-asyncawait)
3. [reduce()](#q3-purpose-of-the-reduce-method)
4. [Currying](#q4-explain-currying)
5. [Generator functions](#q5-what-is-a-generator-function-and-its-usage)
6. [WeakMap & WeakSet](#q6-what-are-weakmap-and-weakset)
7. [Memory management](#q7-how-does-javascript-handle-memory-management)
8. [Shallow vs deep copy](#q8-difference-between-shallow-and-deep-copying)
9. [Strict mode](#q9-what-is-strict-mode-and-how-is-it-enabled)
10. [Observer pattern](#q10-observer-pattern-and-its-relation-to-javascript)
11. [Quick revision cheat sheet](#quick-revision-cheat-sheet)

---

## Q1. Explain the event loop

> **Interview answer:** JavaScript is single-threaded: it has one call stack and can run one thing at a time. The event loop is the mechanism that lets it stay non-blocking. Async work (timers, network, DOM events) is handed to the environment (Web APIs or Node.js). When it finishes, its callback goes into a queue. The event loop continuously checks: *if the call stack is empty, move the next queued callback onto the stack.* **Microtasks (promises) always run before macrotasks (timers, events).**

### The pieces

| Part | What it does |
| ---- | ------------ |
| **Call stack** | Where your code runs, one function at a time |
| **Web APIs / Node APIs** | Handle waiting work (`setTimeout`, `fetch`, DOM events) outside the stack |
| **Macrotask queue (callback queue)** | Callbacks from `setTimeout`, `setInterval`, DOM events, I/O |
| **Microtask queue** | Callbacks from `.then/.catch/.finally`, code after `await`, `queueMicrotask` |
| **Event loop** | When the stack is empty: run **all** microtasks, then take **one** macrotask, repeat |

### Example: predict the output

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

(async () => {
  console.log("D");
  await null;
  console.log("E");
})();

console.log("F");

// Output: A D F C E B
```

**Why?**
1. Synchronous code runs first: `A`, `D` (the async function runs synchronously until its first `await`), `F`.
2. The stack is now empty, so all **microtasks** run: `C`, then `E`.
3. Finally the **macrotask** runs: `B` (even with a 0 ms delay).

> **Analogy:** A restaurant with **one chef** (the single thread). The chef cooks one dish at a time (call stack). Timers and deliveries are handled by **helpers outside the kitchen** (Web APIs). When a helper finishes, the order is placed on the **pickup counter** (queue). The chef only picks up the next order when his hands are free (stack empty). There is also a **VIP line** (microtasks): the chef always clears the whole VIP line before touching the regular line.

**Follow-ups**
- Why is `setTimeout(fn, 0)` not instant? It still goes through the queue and waits for the stack to empty.
- What happens if you run a huge `while` loop? It blocks the stack, so the UI freezes and no callbacks run.
- Microtask vs macrotask? Microtasks (promises) have higher priority than macrotasks (timers).

> **Correction to your notes:** your Q1 answer was copied from the *Event Delegation* definition. It does not describe the event loop.

---

## Q2. Difference between a Promise and async/await

> **Interview answer:** A Promise is an object representing the eventual result of an async operation. `async/await` is **syntactic sugar built on top of promises**: it does not replace them. An `async` function always returns a promise, and `await` pauses that function until the promise settles, which makes async code read like normal sequential code.

| | Promise (`.then`) | async/await |
| --- | --- | --- |
| What is it? | The underlying object/mechanism | Syntax built on promises |
| Readability | Chains can get long | Looks synchronous, easier to read |
| Error handling | `.catch()` | `try/catch` |
| Returns | A promise | Always a promise |

```js
// Helper functions that return promises (so the example is runnable)
const fetchData1 = () => new Promise((resolve) => setTimeout(() => resolve("one"), 500));
const fetchData2 = (prev) => new Promise((resolve) => setTimeout(() => resolve(prev + " -> two"), 500));

// 1) Promise chain
fetchData1()
  .then((result1) => fetchData2(result1))
  .then((result2) => console.log("Result:", result2))
  .catch((error) => console.log("Error:", error));

// 2) async/await (same thing, cleaner)
async function fetchData() {
  try {
    const result1 = await fetchData1();
    const result2 = await fetchData2(result1);
    console.log("Result:", result2); // Result: one -> two
  } catch (error) {
    console.log("Error:", error);
  }
}
fetchData();
```

### Bonus: running tasks in parallel

Two `await`s in a row run **one after another**. If the tasks are independent, run them together:

```js
const [a, b] = await Promise.all([fetchData1(), fetchData1()]); // ~500 ms instead of ~1000 ms
```

> **Analogy:** A Promise is a **restaurant buzzer**: it is the actual device that tells you when your food is ready. `async/await` is like **standing in line and just saying "I'll wait here until my order is ready"**. It is the same buzzer underneath, only more comfortable to use.

**Follow-ups**
- Does `await` block the whole program? No, only the async function it is in. The rest of the program keeps running.
- Can you use `await` without `async`? Not in normal functions (only at the top level of ES modules).
- `Promise.all` vs `Promise.allSettled` vs `Promise.race`? `all` fails fast if any rejects; `allSettled` waits for all results; `race` returns the first one to settle.

> **Corrections to your code:** `result1 = await ...` and `result2 = await ...` have no `const`, so they become accidental global variables. `fetchDate2` is a typo for `fetchData2`. `fetchData1` and `fetchData2` were never defined.

---

## Q3. Purpose of the `reduce()` method

> **Interview answer:** `reduce()` runs a function on every element of an array and **accumulates the results into a single value** (a number, string, object, array, anything). The callback receives `(accumulator, currentValue, index, array)`, and you can pass an **initial value** as the second argument of `reduce`.

```js
const numbers = [1, 2, 3, 4, 5];

// Sum
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// Max value
const max = numbers.reduce((acc, curr) => (curr > acc ? curr : acc), numbers[0]);
console.log(max); // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "mango", "banana", "apple"];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, mango: 1 }
```

> **Analogy:** A **cashier's running total**. Each item is scanned (current value) and added to the bill so far (accumulator). At the end there is one number, the final bill. The initial value is the starting amount on the machine (usually 0).

**Follow-ups**
- What if the array is empty and there is no initial value? `TypeError: Reduce of empty array with no initial value`. Always pass an initial value.
- Can you build `map` or `filter` with `reduce`? Yes, since reduce can return an array.

> **Corrections to your code:**
> 1. The callback parameters are in the wrong order: `(num, acc) => ...`. The correct order is **`(acc, curr)`**. Your sum still works because addition is commutative, but it breaks for anything else (like subtraction or building objects).
> 2. `number = [1,2,3,4,5]` has no `const`, so it becomes a global variable.
> 3. Add an initial value (`0`) as a good habit.

---

## Q4. Explain currying

> **Interview answer:** Currying transforms a function that takes multiple arguments, `f(a, b, c)`, into a chain of functions that each take **one** argument, `f(a)(b)(c)`. It relies on **closures**, since each inner function remembers the earlier arguments. It makes functions reusable by letting you "preset" some arguments.

```js
// Normal function
function multiply(a, b) {
  return a * b;
}

// Curried version
function multi(a) {
  return function (b) {
    return a * b;
  };
}

const double = multi(2);   // 'a' is remembered via closure
console.log(double(3));    // 6
console.log(double(4));    // 8
console.log(multi(5)(6));  // 30

// Arrow function version (short and common in interviews)
const multiArrow = (a) => (b) => a * b;
```

### A generic `curry` helper (a classic interview question)

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

const add3 = (a, b, c) => a + b + c;
const curriedAdd = curry(add3);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

### Practical use

```js
const log = (level) => (message) => console.log(`[${level}] ${message}`);

const info = log("INFO");
const error = log("ERROR");

info("Server started");   // [INFO] Server started
error("Database failed"); // [ERROR] Database failed
```

> **Analogy:** **Ordering a pizza in steps.** First you choose the size (the waiter remembers "large"), then the crust, then the toppings. Each answer is stored, and the pizza is only made once all the choices are in. Currying is the same: each call remembers the earlier arguments.

**Follow-ups**
- Currying vs **partial application**? Currying always produces unary (one-argument) functions step by step. Partial application fixes *some* arguments at once, like `fn.bind(null, a)`.
- Why is it useful? Reusable specialized functions, cleaner function composition, and delayed execution.

---

## Q5. What is a generator function and its usage?

> **Interview answer:** A generator function (`function*`) can **pause and resume** its execution. Calling it does not run the body. It returns a **generator object** (an iterator). Each `.next()` runs the code until the next `yield`, which returns `{ value, done }`, and the function remembers its state between calls.

```js
function* genFunction() {
  let num = 0;
  while (true) {
    yield num; // pause here and hand back 'num'
    num++;
  }
}

const seq = genFunction();
console.log(seq.next().value); // 0
console.log(seq.next().value); // 1
console.log(seq.next());       // { value: 2, done: false }
```

### A finite generator with `for...of`

```js
function* countTo(n) {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}

for (const num of countTo(3)) {
  console.log(num); // 1, 2, 3
}

console.log([...countTo(3)]); // [1, 2, 3]
```

### Passing values *into* a generator

```js
function* chat() {
  const name = yield "What's your name?";
  yield `Hello, ${name}!`;
}

const g = chat();
console.log(g.next().value);      // "What's your name?"
console.log(g.next("Adam").value); // "Hello, Adam!"
```

**Use cases:** lazy/infinite sequences, custom iterators, ID generators, paginating data, and managing async flows (the idea behind early `async/await` and libraries like redux-saga).

> **Analogy:** A **bookmark in a book**, or the **token machine at a bank**. Each time you press the button (`next()`), you get the next token. The machine remembers where it stopped, and does not start from scratch.

> **Correction to your code:** you wrote a bare `yield;`, so it yields `undefined`. Both `console.log` calls printed `undefined`. It should be `yield num;`.

---

## Q6. What are WeakMap and WeakSet?

> **Interview answer:** `WeakMap` and `WeakSet` hold their entries **weakly**. If the only reference to an object is the WeakMap/WeakSet itself, the garbage collector is free to remove it. Keys/values must be **objects** (not primitives), and they are **not iterable**, have **no `size`**, and no `clear()`, because their contents can disappear at any time. They are used to attach extra data to objects without causing memory leaks.

| | Map / Set | WeakMap / WeakSet |
| --- | --- | --- |
| Keys / values | Anything | Objects only |
| References | **Strong**: keeps objects alive | **Weak**: does not prevent garbage collection |
| Iterable / `size` | Yes | No |
| Methods | `set/get/has/delete`, `add/has/delete` | WeakMap: `set/get/has/delete`; WeakSet: `add/has/delete` |

```js
let obj = { name: "Adam" };

const weakMap = new WeakMap();
weakMap.set(obj, "Emp");
console.log(weakMap.get(obj)); // "Emp"
console.log(weakMap.has(obj)); // true

const weakSet = new WeakSet();
weakSet.add(obj);              // WeakSet uses add(), not set()
console.log(weakSet.has(obj)); // true

obj = null;
// The object now has no other references, so the engine can garbage-collect it
// and the WeakMap/WeakSet entries disappear automatically.
// (When this happens is up to the engine, and you cannot observe it directly.)

weakMap.set("text", 1); // TypeError: Invalid value used as weak map key
```

### Real use case: private data / metadata

```js
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    privateData.set(this, { password }); // hidden from outside
  }
  checkPassword(input) {
    return privateData.get(this).password === input;
  }
}
// When a User object is deleted, its private data is cleaned up automatically
```

Other uses: caching results per object, tracking DOM nodes, marking "visited" objects.

> **Analogy:** A **sticky note stuck on a person**. While the person is around, the note stays. The moment they leave, the note is automatically thrown away. A normal `Map` is like a **filing cabinet** that keeps the file forever, even after the person has gone, which wastes space (a memory leak).

**Follow-ups**
- Why can't you iterate a WeakMap? Garbage collection is non-deterministic, so entries could vanish mid-loop.
- When would you use WeakMap over Map? When the data should live only as long as the key object lives.

> **Corrections to your code:**
> 1. `new weakMap()` and `new weakSet()` should be **`new WeakMap()`** and **`new WeakSet()`** (capital W).
> 2. `weakSet.set(obj, "Emp")` is wrong: WeakSet has **`add()`**, not `set()`.
> 3. You set `obj = null` and *then* called `weakSet.add(obj)`, which throws a `TypeError`, because `null` is not an object.
> 4. `weakMap.get(null)` just returns `undefined` because `null` is a different key. It does not demonstrate garbage collection.

---

## Q7. How does JavaScript handle memory management?

> **Interview answer:** JavaScript manages memory **automatically**. It allocates memory when you create values, and a **garbage collector** frees memory that is no longer reachable. Conceptually, primitives (numbers, booleans, etc.) and references live on the **stack**, while objects, arrays and functions live on the **heap**. The main algorithm is **mark-and-sweep**: starting from "roots" (global variables and the current stack), it marks everything reachable, then sweeps (deletes) everything unmarked.

### Stack vs heap (conceptual model)

| | Stack | Heap |
| --- | --- | --- |
| Stores | Primitives, function calls, references | Objects, arrays, functions |
| Speed | Very fast, fixed size | Slower, dynamic size |
| Cleanup | Automatic when function returns | By the garbage collector |

```js
// Primitives: copied by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (unchanged)

// Objects: copied by reference
const o1 = { x: 1 };
const o2 = o1;      // both point to the same object in the heap
o2.x = 99;
console.log(o1.x);  // 99
```

> *Note:* this stack/heap split is a simplified mental model. Real engines like V8 are more nuanced (for example, strings are stored in the heap), but this is the expected interview answer.

### Garbage collection: mark-and-sweep

1. **Mark:** start from the roots and mark every object that can be reached.
2. **Sweep:** free the memory of everything that was not marked.

An object with **no reachable references** is garbage. Old engines used *reference counting*, which failed on **circular references**. Mark-and-sweep handles them correctly.

### Common memory leaks and fixes

```js
// 1. Accidental globals
function leak() {
  leaked = "oops"; // no let/const → global variable that never gets freed
}

// 2. Forgotten timers
const bigData = new Array(1_000_000).fill("x");
const id = setInterval(() => console.log(bigData.length), 1000);
// Fix: clearInterval(id) when you no longer need it

// 3. Event listeners never removed
//    Fix: element.removeEventListener(...)

// 4. Detached DOM nodes still referenced by variables
// 5. Closures holding references to large objects they no longer need
```

> **Analogy:** A **hotel**. The stack is the **front desk** (small, fast, organized). The heap is the **huge storage warehouse** where the bulky luggage goes. The front desk keeps a small ticket (reference) pointing to the luggage. The **cleaning staff** (garbage collector) starts at the entrance, follows every ticket, and marks every piece of luggage that someone still holds a ticket for. Anything left unmarked is thrown away.

**Follow-ups**
- Can you manually free memory in JS? No, but you can drop references (`obj = null`) so the garbage collector can clean up.
- How do you find leaks? Chrome DevTools: Memory tab (heap snapshots) and Performance tab.

> **Correction to your notes:** "Garbase Collection (swpper function())" should be **Garbage Collection (mark-and-sweep algorithm)**. There is no "swapper function" in JS.

---

## Q8. Difference between shallow and deep copying

> **Interview answer:** A **shallow copy** copies only the top-level properties. Nested objects/arrays are still **shared by reference** with the original. A **deep copy** recursively copies everything, so the copy is completely independent.

```js
const original = {
  name: "john",
  address: { city: "delhi" },
};

// Shallow copies
const shallowCopy1 = Object.assign({}, original);
const shallowCopy2 = { ...original };

shallowCopy2.name = "sam";             // top-level: only the copy changes
shallowCopy2.address.city = "New City"; // nested: shared with the original!

console.log(shallowCopy1); // { name: 'john', address: { city: 'New City' } }
console.log(shallowCopy2); // { name: 'sam',  address: { city: 'New City' } }
console.log(original);     // { name: 'john', address: { city: 'New City' } }  ← changed too!

// Deep copy
const deepCopy = structuredClone(original);
deepCopy.address.city = "Mumbai";

console.log(deepCopy);  // { name: 'john', address: { city: 'Mumbai' } }
console.log(original);  // { name: 'john', address: { city: 'New City' } }  ← unaffected
```

### Ways to deep copy

| Method | Notes |
| --- | --- |
| `structuredClone(obj)` | **Best modern choice.** Handles Date, Map, Set, nested objects, circular references. Cannot clone functions. |
| `JSON.parse(JSON.stringify(obj))` | Quick but lossy (see below) |
| `_.cloneDeep(obj)` (Lodash) | Handles most cases, needs a library |

**Limitations of the JSON trick:** it drops `undefined` values and functions, turns `Date` objects into strings, converts `NaN`/`Infinity` to `null`, loses `Map`/`Set`, and **throws on circular references**.

> **Analogy:** **Photocopying a folder** where one page just says "see the shared Google Doc".
> - A **shallow copy** photocopies the folder, but the "shared Google Doc" link still points to the *same* document. If someone edits it, both folders show the change.
> - A **deep copy** also creates a brand-new copy of that Google Doc, so edits are fully separate.

**Follow-ups**
- Are the spread operator and `Object.assign` deep? No, both are shallow. Same for `Array.slice()` and `Array.from()`.
- Is `const copy = original` a copy? No, it just copies the reference. Both variables point to the same object.

> **Tip on your code:** by the time you ran `JSON.parse(JSON.stringify(original))`, `original.address.city` was already changed to `"New City"` by the shallow-copy test. That makes the output confusing. Use a fresh object for each demo.

---

## Q9. What is strict mode and how is it enabled?

> **Interview answer:** Strict mode (ES5) is an opt-in restricted variant of JavaScript. It turns **silent mistakes into real errors**, disallows unsafe features, and can help engines optimize. You enable it by writing the directive **`"use strict";`** as the **first statement** of a script or of a function. ES modules and class bodies are strict automatically.

```js
"use strict"; // whole file

function myFunc() {
  "use strict"; // or only inside one function
}
```

### What strict mode changes

Each snippet below assumes `"use strict";` is at the top. Test them in **separate files**, because some of these are *syntax errors* that stop the whole file from running.

**1. No undeclared variables**

```js
"use strict";
x = 10; // ReferenceError: x is not defined
```

**2. Writing to read-only properties throws**

```js
"use strict";
const obj1 = {};
Object.defineProperty(obj1, "prop", { value: 40, writable: false });
obj1.prop = 100; // TypeError: Cannot assign to read only property 'prop' of object
// (without strict mode it fails silently and prop stays 40)
```

**3. `this` inside a plain function is `undefined`**

```js
"use strict";
function show() {
  console.log(this); // undefined  (non-strict: window / globalThis)
}
show();
```

**4. `with` statement is forbidden**

```js
"use strict";
with (Math) { } // SyntaxError: Strict mode code may not include a with statement
```

**5. `eval` gets its own scope**

```js
"use strict";
eval("var y = 10");
console.log(y); // ReferenceError: y is not defined (in non-strict, y would leak out)
```

**6. Duplicate parameter names are forbidden**

```js
"use strict";
function sum(a, a, b) { } // SyntaxError: Duplicate parameter name not allowed in this context
```

Other changes: octal literals like `010` are disallowed, `delete` on a plain variable is an error, reserved words (`let`, `static`, `implements`, etc.) can't be used as identifiers, and `arguments.callee` is removed.

> **Analogy:** **Driving with traffic police present.** Without them (sloppy mode), small violations like jumping a signal go unnoticed. With strict mode on, every violation gets an immediate ticket (an error), so you fix bad habits early.

**Follow-ups**
- Is strict mode global? Only where you declare it: per file or per function.
- Do classes and modules need `"use strict"`? No, they are always strict.

> **Corrections to your code:**
> 1. `"use strict"` was commented out, so none of the "errors" in your comments would actually have happened.
> 2. `Object.defineProperties(obj1, "prop", {...})` is wrong. For one property use **`Object.defineProperty(obj, "prop", {...})`**. (`defineProperties` takes only two arguments: the object and a map of properties.)
> 3. `sum(a + a + b)` calls the function with an expression using undeclared variables, which is itself a ReferenceError. Call it like `sum(1, 2, 3)`.
> 4. If `"use strict"` were enabled at the top, the whole file would fail to run, because `with` and duplicate parameters are syntax errors caught before any code executes. Test them one at a time.
> 5. `x = 10` earlier in the file also made `x` a global, so the `eval` example was misleading. Use a different variable name.

---

## Q10. Observer pattern and its relation to JavaScript

> **Interview answer:** The Observer pattern is a design pattern where one object, the **subject**, keeps a list of dependents, the **observers**, and automatically **notifies them whenever its state changes**. It creates a one-to-many relationship with loose coupling. JavaScript uses it everywhere: DOM events (`addEventListener`), Node.js `EventEmitter`, Redux `store.subscribe`, RxJS, `MutationObserver` and `IntersectionObserver`.

### Building it yourself

```js
class Subject {
  constructor() {
    this.observers = [];
  }
  subscribe(fn) {
    this.observers.push(fn);
  }
  unsubscribe(fn) {
    this.observers = this.observers.filter((observer) => observer !== fn);
  }
  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

const newsChannel = new Subject();

const observer1 = (news) => console.log("Observer 1 notified:", news);
const observer2 = (news) => console.log("Observer 2 notified:", news);

newsChannel.subscribe(observer1);
newsChannel.subscribe(observer2);

newsChannel.notify("Breaking news!");
// Observer 1 notified: Breaking news!
// Observer 2 notified: Breaking news!

newsChannel.unsubscribe(observer2);
newsChannel.notify("Second update");
// Observer 1 notified: Second update
```

### The built-in version: DOM events

```js
const button = document.querySelector("button"); // the subject

function observer1() {
  console.log("Observer 1 Notified");
}
function observer2() {
  console.log("Observer 2 Notified");
}

button.addEventListener("click", observer1); // subscribe
button.addEventListener("click", observer2);

button.removeEventListener("click", observer2); // unsubscribe
```

### Node.js example

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("order", (item) => console.log("Kitchen got:", item));
emitter.emit("order", "pizza"); // Kitchen got: pizza
```

> **Analogy:** **Subscribing to a YouTube channel and clicking the bell icon.** The channel (subject) doesn't know or care who you are individually. It just keeps a list of subscribers (observers). When a new video is uploaded (state change), everyone on the list gets a notification. You can unsubscribe at any time.

**Follow-ups**
- Observer vs **Pub/Sub**? In Observer, observers subscribe **directly** to the subject. In Pub/Sub, a **message broker/event bus** sits in between, so publishers and subscribers don't know each other at all.
- Why use it? Loose coupling, easy to add/remove listeners, and one-to-many updates.
- Downside? Forgotten subscriptions cause memory leaks, so always unsubscribe.

> **Typos fixed:** "broadcasr mechanisml" (broadcast mechanism), "Obserber" (Observer).

---

## Quick revision cheat sheet

| # | Topic | One-line answer |
| - | ----- | --------------- |
| 1 | Event loop | When the stack is empty, run all microtasks (promises), then one macrotask (timers/events) |
| 2 | Promise vs async/await | async/await is syntactic sugar over promises; `async` always returns a promise |
| 3 | `reduce` | Folds an array into one value; callback is `(acc, curr)`; always give an initial value |
| 4 | Currying | `f(a, b, c)` becomes `f(a)(b)(c)`, powered by closures |
| 5 | Generators | `function*` + `yield` pauses and resumes; returns `{ value, done }` |
| 6 | WeakMap/WeakSet | Weakly-held, object-only, non-iterable; no memory leaks |
| 7 | Memory | Automatic: stack (primitives, calls), heap (objects), mark-and-sweep garbage collection |
| 8 | Shallow vs deep | Shallow shares nested objects; deep clones everything (`structuredClone`) |
| 9 | Strict mode | `"use strict";` turns silent mistakes into errors |
| 10 | Observer | Subject notifies a list of subscribed observers (`addEventListener`, `EventEmitter`) |

### Common traps interviewers love

1. `setTimeout(fn, 0)` runs **after** all promise callbacks.
2. Spread/`Object.assign` are **shallow** copies.
3. `reduce` on an empty array with no initial value **throws**.
4. `WeakSet` uses `add()`, not `set()`, and `WeakMap` keys must be objects.
5. `typeof null === "object"` and `this` in a strict-mode function is `undefined`.
6. A bare `yield;` produces `undefined`. You must write `yield value;`.
7. `await` pauses only its own async function, not the whole program.