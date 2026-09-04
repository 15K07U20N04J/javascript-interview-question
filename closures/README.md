# JavaScript Closures — Complete Interview Guide

A complete, example-driven reference on **Closures in JavaScript** — covering `var`, `let`, `const`, `setTimeout`, scope chain, data hiding, garbage collection, and common interview questions.

---

## Table of Contents

1. [What is a Closure in JS?](#1-what-is-a-closure-in-js)
2. [Example of a Closure](#2-example-of-a-closure)
3. [Use of Double Parenthesis `()()` (IIFE)](#3-use-of-double-parenthesis--iife)
4. [Closures with `setTimeout` — var vs let vs const](#4-closures-with-settimeout--var-vs-let-vs-const)
5. [Are `let` Declarations Closed Over?](#5-are-let-declarations-closed-over)
6. [Are Function Parameters Closed Over?](#6-are-function-parameters-closed-over)
7. [Relation Between Scope Chain and Closures](#7-relation-between-scope-chain-and-closures)
8. [Conflicting Name — Global Variables in JS](#8-conflicting-name--global-variables-in-js)
9. [Advantages of Closures](#9-advantages-of-closures)
10. [Data Hiding & Encapsulation using Closures](#10-data-hiding--encapsulation-using-closures)
11. [Example of Data Privacy using Closures](#11-example-of-data-privacy-using-closures)
12. [Function Constructor in JavaScript](#12-function-constructor-in-javascript)
13. [Disadvantages of Closures](#13-disadvantages-of-closures)
14. [What is a Garbage Collector in JS?](#14-what-is-a-garbage-collector-in-js)
15. [Garbage Collection, Memory Leaks & Closures](#15-garbage-collection-memory-leaks--closures)
16. [Smart Garbage Collection by V8 (Chrome)](#16-smart-garbage-collection-by-v8-chrome)
17. [Quick Interview Cheat Sheet](#17-quick-interview-cheat-sheet)

---

## 1. What is a Closure in JS?

> **A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).** In other words, a closure gives an inner function access to the scope of an outer function, **even after the outer function has finished executing.**

Every time a function is created in JavaScript, a closure is created for that function — it "remembers" the variables from the place where it was defined, not from where it is called.

```js
function outer() {
  let name = "Closure"; // outer variable
  function inner() {
    console.log("Hello " + name); // inner function accesses outer's variable
  }
  return inner;
}

const myFn = outer(); // outer() runs and returns inner, but 'name' is NOT destroyed
myFn(); // "Hello Closure"
```

Even though `outer()` has already returned, `inner()` still remembers `name`. That "memory" is the closure.

---

## 2. Example of a Closure

### Basic Counter Example

```js
function createCounter() {
  let count = 0; // private variable

  return function () {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3

const counter2 = createCounter(); // fresh closure, own 'count'
console.log(counter2()); // 1
```

**Key point:** `counter1` and `counter2` each have their own independent closure over `count` — they don't share state.

---

## 3. Use of Double Parenthesis `()()` (IIFE)

The double parenthesis pattern is called an **IIFE — Immediately Invoked Function Expression**. The first `()` wraps the function to turn it into an expression; the second `()` immediately invokes it.

```js
(function () {
  console.log("I run immediately!");
})(); // <-- first () wraps function, second () calls it
```

### Why use it? — To create closures without polluting the global scope

```js
const module = (function () {
  let privateVar = 0;

  return {
    increment: function () {
      privateVar++;
      return privateVar;
    },
  };
})(); // IIFE runs immediately and returns an object

console.log(module.increment()); // 1
console.log(module.increment()); // 2
console.log(module.privateVar); // undefined (hidden!)
```

This is the classic **Module Pattern**, built entirely on closures + IIFE.

---

## 4. Closures with `setTimeout` — var vs let vs const

This is the **#1 most-asked closure interview question**.

### ❌ Problem with `var`

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Output: 4, 4, 4  ❌
```

**Why?** `var` is **function-scoped**, not block-scoped. There is only **ONE `i`** shared across all loop iterations. By the time `setTimeout` callbacks run (after the loop finishes), `i` has already become `4`. All three closures point to the *same* `i` in memory.

### ✅ Fix using `let`

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Output: 1, 2, 3  ✅
```

**Why?** `let` is **block-scoped**. On every iteration, JS creates a **new binding of `i`** for that specific block/iteration. Each `setTimeout` callback closes over its *own separate copy* of `i`.

### ✅ Fix using `var` + IIFE (old-school way before `let` existed)

```js
for (var i = 1; i <= 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, j * 1000);
  })(i); // pass current i as j, creating a new scope each time
}
// Output: 1, 2, 3  ✅
```

### What about `const`?

```js
for (const i = 1; i <= 3; i++) {
  // ❌ TypeError: Assignment to constant variable.
}
```
`const` **cannot** be used in a traditional `for(;;)` loop because `i++` reassigns it. But it works fine in `for...of`:

```js
for (const num of [1, 2, 3]) {
  setTimeout(() => console.log(num), num * 1000);
}
// Output: 1, 2, 3  ✅ (new 'const num' binding created each iteration)
```

### Summary Table

| Keyword | Scope | Loop Binding | `setTimeout` Result |
|---|---|---|---|
| `var` | Function-scoped | Single shared variable | `4, 4, 4` ❌ |
| `let` | Block-scoped | New variable per iteration | `1, 2, 3` ✅ |
| `const` | Block-scoped | New variable per iteration (only in `for...of`) | `1, 2, 3` ✅ |

---

## 5. Are `let` Declarations Closed Over?

**Yes.** Each iteration of a loop using `let` creates a **new lexical binding**. Closures formed inside that iteration capture *that iteration's* binding, not a shared one.

```js
function test() {
  let arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push(() => i);
  }
  return arr;
}

const fns = test();
console.log(fns[0]()); // 0
console.log(fns[1]()); // 1
console.log(fns[2]()); // 2
```

Compare this to `var`, where all three functions would return `3`.

---

## 6. Are Function Parameters Closed Over?

**Yes.** Function parameters behave like local `let`/`var` variables of that function and are fully captured by closures created inside.

```js
function greet(name) {
  return function () {
    console.log("Hello, " + name);
  };
}

const greetJohn = greet("John");
const greetJane = greet("Jane");

greetJohn(); // "Hello, John"
greetJane(); // "Hello, Jane"
```

Each call to `greet()` creates a new execution context, so each returned function closes over its **own copy** of the `name` parameter.

---

## 7. Relation of Scope Chain and Closures

The **scope chain** is how JS resolves variable names — it looks in the current scope, then the outer scope, then the outer of that, all the way to the global scope.

A **closure is formed because of the scope chain**: when an inner function is created, it keeps a **reference** to its outer lexical environment (not a copy). This reference is what the scope chain is built from.

```js
function grandParent() {
  let a = "grandparent";
  function parent() {
    let b = "parent";
    function child() {
      let c = "child";
      console.log(a, b, c); // accesses all 3 levels via scope chain
    }
    return child;
  }
  return parent();
}

grandParent()(); // "grandparent parent child"
```

`child()` closes over `parent`'s scope AND `grandParent`'s scope — this chain of nested lexical environments **is** the scope chain, and closures are what let functions retain access to it after the outer functions return.

---

## 8. Conflicting Name — Global Variables in JS

When a local variable (inside a function or closure) has the **same name** as a global variable, the local one **shadows** the global one within that scope — JS resolves names using the **nearest scope first** (scope chain lookup).

```js
let value = "global";

function outer() {
  let value = "outer"; // shadows global 'value'

  function inner() {
    let value = "inner"; // shadows outer's 'value'
    console.log(value); // "inner"
  }

  inner();
  console.log(value); // "outer"
}

outer();
console.log(value); // "global"
```

⚠️ **Interview tip:** This is why relying on globals is risky — accidental name collisions cause bugs. Closures help avoid this by keeping variables private (see Data Hiding below).

---

## 9. Advantages of Closures

1. **Data privacy / encapsulation** — create private variables inaccessible from outside.
2. **State persistence** — functions can "remember" values between calls (e.g., counters).
3. **Function factories** — generate customized functions dynamically (e.g., `multiplyBy(2)`, `multiplyBy(5)`).
4. **Module pattern** — organize code into self-contained units with public/private members.
5. **Callback and async handling** — closures let callbacks (in `setTimeout`, event listeners, promises) remember the context they were created in.
6. **Memoization / caching** — store computed results inside a closure for reuse.

```js
// Function factory example
function multiplyBy(x) {
  return function (y) {
    return x * y;
  };
}
const double = multiplyBy(2);
const triple = multiplyBy(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

## 10. Data Hiding & Encapsulation in JavaScript?

JavaScript (pre-ES2022 private class fields) has **no built-in `private` keyword** for object properties. **Closures are the primary way to achieve true data privacy** — variables inside a closure cannot be accessed directly from outside; they can only be touched through functions you explicitly expose.

This mimics **encapsulation** from OOP: internal state is hidden, and only a controlled public interface is exposed.

---

## 11. Example of Data Privacy using Closures

```js
function BankAccount(initialBalance) {
  let balance = initialBalance; // private — no direct outside access

  return {
    deposit: function (amount) {
      balance += amount;
      return balance;
    },
    withdraw: function (amount) {
      if (amount > balance) {
        console.log("Insufficient funds");
        return balance;
      }
      balance -= amount;
      return balance;
    },
    getBalance: function () {
      return balance;
    },
  };
}

const account = BankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500);
console.log(account.getBalance()); // 1500
account.withdraw(2000);            // "Insufficient funds"

console.log(account.balance);      // undefined — cannot access directly!
```

`balance` can **only** be modified through `deposit`, `withdraw`, and read through `getBalance` — it is fully protected, exactly like a `private` field in other languages.

---

## 12. Function Constructor in JavaScript

The **Function constructor** creates a new function object dynamically from a string at runtime, using the `Function` global object.

```js
const sum = new Function("a", "b", "return a + b");
console.log(sum(3, 4)); // 7
```

### Key characteristics:
- It's the **least commonly used** way to create functions.
- Functions created this way **do NOT form closures over their surrounding lexical scope** — they only have access to the **global scope**, no matter where they are defined.

```js
function outer() {
  let x = 10;
  const inner = new Function("return typeof x !== 'undefined' ? x : 'x is not accessible'");
  console.log(inner()); // "x is not accessible" — no closure over outer()!
}
outer();
```

- Slower performance and considered a **bad practice** (similar risks to `eval()` — potential security issues, no closures, harder to debug/minify).

---

## 13. Disadvantages of Closures?

1. **Memory consumption** — variables captured by a closure are **not garbage collected** as long as the closure exists, even if they're no longer needed elsewhere. This can lead to higher memory usage.
2. **Memory leaks** — if closures are created carelessly (e.g., in loops, event listeners not cleaned up), they can keep large objects alive unintentionally.
3. **Performance overhead** — excessive/deeply nested closures can slightly slow down scope lookups and increase memory footprint.
4. **Debugging complexity** — closures can make it harder to track variable state, especially in deeply nested or asynchronous code.
5. **Overuse** — using closures where simple variables/functions would do can make code harder to read and reason about.

---

## 14. What is a Garbage Collector in JavaScript?

A **Garbage Collector (GC)** is an automatic memory management process built into the JS engine. It periodically scans memory and **frees up memory occupied by objects/variables that are no longer reachable** (i.e., no more references point to them) from the root (global object / call stack).

JavaScript primarily uses the **Mark-and-Sweep algorithm**:
1. **Mark phase** — starting from "roots" (global object, currently executing functions), the GC marks every object it can reach.
2. **Sweep phase** — any object **not marked** (i.e., unreachable) is considered garbage and its memory is freed.

```js
let obj = { data: "large data" };
obj = null; // no references left → eligible for garbage collection
```

---

## 15. Relation between Garbage Collection, Memory Leaks, and Closures?

- A closure keeps a **reference** to its outer variables **as long as the closure itself is reachable** (e.g., stored in a variable, passed as a callback, attached to an event listener).
- Because the GC uses **reachability** (not scope-based cleanup), **any variable referenced inside an active closure will NOT be garbage collected**, even if it's not directly used.
- This is normal and useful — but it becomes a **memory leak** when closures are kept alive **unintentionally** (forgotten event listeners, uncanceled `setInterval`, large data retained inside closures never released).

```js
function setup() {
  let hugeArray = new Array(1000000).fill("data"); // large memory
  let unused = "small";

  return function () {
    console.log(unused); // closure only "needs" unused
    // but hugeArray is in the SAME closure scope!
  };
}

const leak = setup();
// In older engines, hugeArray might be kept in memory
// even though the returned function never uses it.
```

✅ **Best practice:** Set closures/references to `null` when no longer needed, remove event listeners, clear intervals/timeouts (`clearInterval`, `clearTimeout`) to allow garbage collection.

---

## 16. Example of Smart Garbage Collection by V8 JS Engine in Chrome

Modern engines like **V8** (used in Chrome & Node.js) are smarter than "keep the whole closure scope alive." V8 performs **closure optimization**: it analyzes which variables from the outer scope are **actually referenced** inside the inner function, and **only keeps those specific variables alive** — unused variables in the same scope can be garbage collected even though a closure exists over that scope.

```js
function setup() {
  let hugeArray = new Array(1000000).fill("data"); // large, UNUSED by inner fn
  let usedVar = "I am needed";

  return function () {
    console.log(usedVar); // only 'usedVar' is referenced
  };
}

const fn = setup();
fn(); // "I am needed"
// V8 can garbage collect 'hugeArray' because it detects
// the returned closure never actually references it —
// even though both variables technically live in the same outer scope.
```

**Why this matters in interviews:** It shows you understand that closures in *theory* capture the whole lexical environment, but *in practice*, modern engines like V8 use **static analysis** to only retain variables that are truly referenced — making closures more memory-efficient than commonly assumed.

---

## 17. Quick Interview Cheat Sheet

| Concept | One-Line Answer |
|---|---|
| Closure | A function + its remembered lexical scope, even after the outer function returns |
| IIFE `()()` | Function defined and invoked immediately, often used to create closures/private scope |
| `var` in loop + `setTimeout` | Prints `n+1` repeated — single shared binding |
| `let` in loop + `setTimeout` | Prints `1,2,3...` — new binding per iteration |
| Scope Chain | Chain of nested lexical scopes JS searches to resolve variables; closures rely on it |
| Data Privacy | Achieved via closures — variables hidden, accessed only through returned functions |
| Function Constructor | Creates functions from strings; does NOT form closures over local scope |
| Disadvantage of Closures | Can cause memory leaks by keeping variables alive longer than needed |
| Garbage Collector | Frees memory of unreachable objects (Mark-and-Sweep algorithm) |
| V8 Smart GC | Only keeps closure variables alive that are actually referenced by the inner function |

---

### 📌 Golden Rule for Interviews
> "A closure is created **every time** a function is created, at function creation time — not just when you explicitly return an inner function. Understanding `var` vs `let` scoping is the key to nailing 90% of closure-based interview questions."