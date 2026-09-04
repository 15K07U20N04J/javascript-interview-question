# JavaScript Interview Notes 🚀
### Functions, Callbacks, Event Loop & Array Methods — Read once before your interview!

---

## Table of Contents

1. [Function Statement / Declaration](#1-function-statement--declaration)
2. [Function Expression](#2-function-expression)
3. [Function Statement vs Function Expression](#3-function-statement-vs-function-expression)
4. [Anonymous Function](#4-anonymous-function)
5. [Named Function Expression](#5-named-function-expression)
6. [Parameters vs Arguments](#6-parameters-vs-arguments)
7. [First Class Functions](#7-first-class-functions--first-class-citizens)
8. [Callback Functions](#8-callback-functions)
9. [JS is Synchronous & Single Threaded](#9-js-is-synchronous--single-threaded-language)
10. [Blocking the Main Thread](#10-blocking-the-main-thread)
11. [Power of Callbacks](#11-power-of-callbacks)
12. [Event Listeners — Deep Dive](#12-event-listeners--deep-dive)
13. [Closures with Event Listeners](#13-closures-with-event-listeners)
14. [Garbage Collection & Removing Event Listeners](#14-garbage-collection--removing-event-listeners)
15. [Event Loop Explained with Examples](#15-event-loop-explained-with-examples)
16. [JS Runtime Environment](#16-js-runtime-environment)
17. [Trust Issues with setTimeout](#17-trust-issues-with-settimeout)
18. [Higher Order Functions](#18-higher-order-functions)
19. [map, filter, reduce](#19-map-filter-reduce)

---

## 1. Function Statement / Declaration

A **Function Statement** (also called **Function Declaration**) is the normal way of creating a function using the `function` keyword followed by a name.

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // Hello, Alice!
```

**Key characteristic: Hoisting**
Function declarations are **hoisted** completely — meaning both the function name *and* its body are moved to the top of the scope during the memory creation phase. This means you can call the function *before* it's defined in the code.

```javascript
sayHi(); // ✅ Works fine! "Hi there"

function sayHi() {
  console.log("Hi there");
}
```

**Why?** During the JS execution's memory creation phase, the entire function (not just the reference) is stored in memory, so it's available even before the line of code executes.

---

## 2. Function Expression

A **Function Expression** is when a function is assigned to a variable. The function itself can be anonymous or named.

```javascript
const greet = function (name) {
  return `Hello, ${name}!`;
};

console.log(greet("Bob")); // Hello, Bob!
```

**Key characteristic: NOT fully hoisted**
Here, only the variable `greet` is hoisted (as `undefined`, because of `var`) or kept in the **Temporal Dead Zone** (if `let`/`const`) — the function assignment happens only when that line executes.

```javascript
console.log(greet2); // ❌ undefined (var is hoisted, but not the function)
var greet2 = function () {
  console.log("Hey");
};

console.log(greet3); // ❌ ReferenceError (TDZ, because of let/const)
let greet3 = function () {
  console.log("Hey");
};
```

---

## 3. Function Statement vs Function Expression

| Feature | Function Statement | Function Expression |
|---|---|---|
| Syntax | `function foo() {}` | `const foo = function() {}` |
| Hoisting | Fully hoisted (usable before defined) | Not hoisted the same way — only variable is hoisted |
| Naming | Must have a name | Can be anonymous or named |
| Calling before definition | ✅ Works | ❌ Throws error / undefined |
| Use case | General reusable functions | When function needs to be passed around, conditionally created, or assigned dynamically |

```javascript
// Function Statement — hoisted, works
console.log(add(2, 3)); // 5
function add(a, b) {
  return a + b;
}

// Function Expression — NOT hoisted, throws error
console.log(subtract(5, 2)); // ❌ Cannot access 'subtract' before initialization
const subtract = function (a, b) {
  return a - b;
};
```

> 💡 **Interview Tip:** The core difference boils down to **hoisting behavior** — this is the #1 answer interviewers look for.

---

## 4. Anonymous Function

A function **without a name** is called an Anonymous Function. It cannot be used as a Function Statement (that would throw a `SyntaxError` since a name is required), but it's commonly used as a value — assigned to variables, or passed as arguments/callbacks.

```javascript
// ❌ Syntax Error if used as a statement
// function() { console.log("hi") }

// ✅ Valid - assigned to a variable
const sum = function (a, b) {
  return a + b;
};

// ✅ Valid - passed as a callback
setTimeout(function () {
  console.log("Executed after 2 seconds");
}, 2000);
```

**Why use them?** When a function is only needed once, in one place (like a callback), giving it a name is unnecessary boilerplate.

---

## 5. What is Named Function Expression?

A **Named Function Expression (NFE)** is just a Function Expression that has a name, instead of being anonymous.

```javascript
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // 👈 can call itself using its own internal name
};

console.log(factorial(5)); // 120
console.log(typeof fact); // ❌ ReferenceError: fact is not defined
```

**Key Points:**
- The name (`fact`) is **only accessible inside the function itself** (useful for recursion).
- It is **not accessible in the outer scope** — you must still call it using the variable name (`factorial`), not the internal name.
- Great for **recursion** and for **debugging** (the name shows up in stack traces instead of "anonymous").

---

## 6. Difference between Parameters and Arguments

```javascript
function multiply(a, b) {   // 👈 a and b are PARAMETERS
  return a * b;
}

multiply(4, 5);              // 👈 4 and 5 are ARGUMENTS
```

| Parameters | Arguments |
|---|---|
| Variables listed in the function **definition** | Actual values passed during the function **call** |
| Act as placeholders | Real data supplied |
| `function multiply(a, b)` → `a`, `b` are parameters | `multiply(4, 5)` → `4`, `5` are arguments |

> 💡 Simple way to remember: **Parameters = Placeholders (in definition)**, **Arguments = Actual values (in the call)**.

---

## 7. First Class Functions / First Class Citizens

> Functions are the **heart of JavaScript**. They are called **first class citizens** or **first class functions** because they have the ability to:
> - be **stored in variables**
> - be **passed as arguments**
> - be **returned from other functions**

```javascript
// 1. Stored in a variable
const greet = function () {
  console.log("Hello!");
};

// 2. Passed as an argument
function callFunction(fn) {
  fn();
}
callFunction(greet); // Hello!

// 3. Returned from another function
function outer() {
  return function inner() {
    console.log("I am returned!");
  };
}
const newFn = outer();
newFn(); // I am returned!
```

This capability is what allows **callbacks**, **higher order functions**, **closures**, and functional programming patterns (`map`, `filter`, `reduce`) to exist in JS.

---

## 8. What is a Callback Function in JS?

A **callback function** is a function passed as an argument to another function, to be **"called back"** (executed) later — either synchronously or asynchronously.

```javascript
// Synchronous callback
function processUserInput(callback) {
  const name = "Alice";
  callback(name);
}

processUserInput(function (name) {
  console.log(`Welcome, ${name}`);
});

// Asynchronous callback
console.log("Start");
setTimeout(function () {
  console.log("This runs later");
}, 2000);
console.log("End");

// Output:
// Start
// End
// This runs later (after 2 sec)
```

**Why callbacks matter:** Since JS is single-threaded, callbacks let us handle things like timers, network requests, and events *without* blocking the rest of the code.

---

## 9. JS is Synchronous & Single Threaded Language

- **Single Threaded** → JS has only **one Call Stack**, meaning it can execute **only one command at a time**.
- **Synchronous** → JS executes code **line by line**, in order. It won't move to the next line until the current one finishes.

```javascript
console.log("1");
console.log("2");
console.log("3");
// Always prints 1, 2, 3 — in order, one at a time
```

But then... how does JS handle timers, API calls, etc., without freezing? 👉 That's where **Web APIs**, the **Callback Queue**, and the **Event Loop** come in (explained below) — they let JS *appear* asynchronous even though the core engine is single-threaded.

---

## 10. Blocking the Main Thread

Since JS has only **one thread** (the Main Thread) to run everything — UI rendering, user clicks, animations, and code execution — if you run a **long, synchronous task**, everything else freezes.

```javascript
function blockThread() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Do nothing, just waste 5 seconds — BLOCKS everything
  }
  console.log("Done blocking");
}

console.log("Before");
blockThread(); // 🔴 UI freezes, clicks don't register, nothing works for 5 sec
console.log("After");
```

**Real-world impact:** Buttons won't respond, animations stutter, page appears "frozen".

**Solution:** Use asynchronous patterns (`setTimeout`, Promises, `async/await`, Web Workers) to avoid heavy synchronous work on the main thread.

---

## 11. Power of Callback

Callbacks are what make **asynchronous, non-blocking behavior** possible in a single-threaded language.

```javascript
console.log("Ordering food 🍕");

function orderFood(callback) {
  setTimeout(function () {
    console.log("Food is ready! 🍕");
    callback();
  }, 3000);
}

orderFood(function () {
  console.log("Let's eat! 😋");
});

console.log("Doing other work while waiting...");

// Output:
// Ordering food 🍕
// Doing other work while waiting...
// Food is ready! 🍕   (after 3 sec)
// Let's eat! 😋
```

Instead of *waiting* (blocking) for the food to be ready, JS moves on and executes other code — the callback runs **later** when the async task completes. This is the foundation of async JS.

⚠️ **Downside:** Too many nested callbacks lead to **"Callback Hell"** (Pyramid of Doom), which is why Promises and `async/await` were introduced.

```javascript
// Callback Hell example
loginUser("user1", function (user) {
  getUserData(user, function (data) {
    getOrders(data, function (orders) {
      getOrderDetails(orders, function (details) {
        console.log(details); // 😵 Deeply nested, hard to read/maintain
      });
    });
  });
});
```

---

## 12. Event Listeners — Deep Dive

An **Event Listener** "listens" for a specific event (click, hover, keypress, etc.) on a DOM element and executes a callback function when that event fires.

```javascript
const button = document.querySelector("#myButton");

function handleClick() {
  console.log("Button clicked!");
}

button.addEventListener("click", handleClick);
```

**How it works internally:**
1. `addEventListener` registers the callback (`handleClick`) with the **Web API environment**.
2. When the event (click) actually happens, the callback is pushed to the **Callback Queue**.
3. The **Event Loop** checks if the **Call Stack** is empty, and if so, pushes the callback onto it to execute.

**Common event listener patterns:**

```javascript
// Passing arguments using an anonymous wrapper function
button.addEventListener("click", function () {
  handleClick("extra data");
});

// Removing an event listener (must use the SAME function reference)
button.removeEventListener("click", handleClick);

// Event object
button.addEventListener("click", function (event) {
  console.log(event.target); // the actual DOM element clicked
});
```

> ⚠️ You **cannot remove** an anonymous function listener because you don't have a reference to it. Always store it in a named variable if you plan to remove it later.

---

## 13. Closures with Event Listeners

A **closure** is when an inner function "remembers" variables from its outer (enclosing) scope, even after the outer function has finished executing. Event listeners are a classic real-world use case of closures.

```javascript
function attachCounter() {
  let count = 0; // 👈 this variable is "closed over"

  document.querySelector("#countBtn").addEventListener("click", function () {
    count++; // remembers and updates 'count' every time it's clicked
    console.log(`Button clicked ${count} times`);
  });
}

attachCounter();
```

**What's happening:**
- Even though `attachCounter()` has already finished executing, the click handler still has access to `count` via **closure**.
- Each click updates the *same* `count` variable — it doesn't reset, because the closure keeps it alive in memory.

**Practical example — attaching listeners in a loop:**

```javascript
const buttons = document.querySelectorAll(".item-btn");

buttons.forEach(function (btn, index) {
  btn.addEventListener("click", function () {
    console.log(`You clicked button number ${index}`); // closure captures 'index'
  });
});
```

---

## 14. Garbage Collection & Removing Event Listeners

**Garbage Collection (GC)** in JS automatically frees up memory occupied by objects/variables that are no longer **reachable** (no references pointing to them).

**The Problem — Memory Leaks with Event Listeners:**
When you attach a closure-based event listener to a DOM element, that element (and everything the closure references) stays in memory **as long as the listener is attached** — even if the element is later removed from the DOM, if a reference still exists somewhere.

```javascript
function setupHeavyListener() {
  const largeData = new Array(1000000).fill("some data"); // heavy memory

  document.querySelector("#btn").addEventListener("click", function () {
    console.log(largeData.length); // closure keeps 'largeData' alive forever
  });
}

setupHeavyListener();
// 'largeData' can NEVER be garbage collected as long as this listener exists!
```

**The Fix — Always clean up listeners you no longer need:**

```javascript
function setupListener() {
  const btn = document.querySelector("#btn");

  function handleClick() {
    console.log("Clicked");
  }

  btn.addEventListener("click", handleClick);

  // When done (e.g., component unmount, page navigation):
  btn.removeEventListener("click", handleClick); // 👈 allows GC to reclaim memory
}
```

**Key takeaways:**
- Unreferenced/removed DOM nodes with **no attached listeners** are automatically garbage collected.
- Listeners create **strong references**, which can prevent GC — always remove listeners you no longer need (especially in Single Page Applications, on component unmount).
- This is a very common **memory leak** interview question, especially for React/Vue/Angular roles.

---

## 15. Event Loop Explained with Examples

### The Core Concept

> 1. The **Browser** has superpowers that are "lent" to the JS engine to execute certain tasks. These superpowers are the **Web APIs** — `console`, `location`, DOM APIs, `setTimeout`, `fetch`, `localStorage`, etc. (JS engine itself doesn't know about these — the browser provides them.)
> 2. **Callback functions and event handlers** are first stored in the **Web API environment**, and once ready, transferred to the **Callback Queue (Macrotask Queue)**.
> 3. **Promises and Mutation Observer callbacks** are stored in the Web API environment, then transferred to the **Microtask Queue**.
> 4. The **Event Loop** continuously watches the **Call Stack**. When the Call Stack is empty, it picks tasks from the queues and pushes them onto the Call Stack for execution.
> 5. **Microtasks are given priority over Macrotasks (Callback Queue tasks)** — the entire microtask queue is emptied before even ONE macrotask runs.
> 6. Too many microtasks (e.g., recursively-added promises) can cause **Starvation** — Callback Queue (macro)tasks never get a chance to execute because the microtask queue keeps refilling.

### Diagram (Conceptual)

```
   ┌─────────────────┐
   │   Call Stack     │ ◄──── Event Loop pushes tasks here when empty
   └─────────────────┘
          ▲
          │  (checks if empty)
          │
   ┌──────┴───────┐
   │  Event Loop   │
   └──────┬───────┘
          │
   ┌──────┴─────────────────────┐
   │                             │
┌──▼─────────────┐      ┌────────▼─────────┐
│ Microtask Queue │      │  Callback Queue   │
│ (Promises, etc) │      │ (setTimeout, DOM  │
│  HIGH PRIORITY  │      │   events, etc.)   │
└─────────────────┘      └───────────────────┘
          ▲                        ▲
          └────────┬───────────────┘
                    │
           ┌────────┴─────────┐
           │   Web API's       │
           │ (setTimeout,      │
           │  fetch, DOM etc.) │
           └───────────────────┘
```

### Example 1 — Basic Order of Execution

```javascript
console.log("Start"); // 1️⃣ synchronous, runs immediately

setTimeout(() => {
  console.log("Timeout callback"); // 3️⃣ goes to callback queue
}, 0);

Promise.resolve().then(() => {
  console.log("Promise callback"); // 2️⃣ goes to microtask queue (priority!)
});

console.log("End"); // 1️⃣ synchronous, runs immediately

// OUTPUT:
// Start
// End
// Promise callback   👈 microtask runs BEFORE callback queue, even with 0ms delay!
// Timeout callback
```

**Explanation:**
1. `console.log("Start")` and `console.log("End")` run immediately — synchronous code always runs first, directly on the Call Stack.
2. `setTimeout`'s callback goes to the Web API, waits 0ms, then moves to the **Callback Queue**.
3. `Promise.resolve().then()`'s callback goes to the **Microtask Queue**.
4. Once the Call Stack is empty, the Event Loop first drains the **Microtask Queue completely** ("Promise callback" prints), and only THEN does it pick from the Callback Queue ("Timeout callback" prints).

### Example 2 — Microtask Starvation

```javascript
function recursiveMicrotask() {
  Promise.resolve().then(() => {
    console.log("Microtask running...");
    recursiveMicrotask(); // keeps adding new microtasks forever!
  });
}

setTimeout(() => {
  console.log("This will NEVER run!"); // starved 😢
}, 0);

recursiveMicrotask();

// The microtask queue keeps refilling itself before the event loop
// ever gets a chance to process the setTimeout callback -> STARVATION
```

### Example 3 — Mixing Multiple Async Sources

```javascript
console.log("1: Script start");

setTimeout(() => console.log("2: setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("3: Promise 1"))
  .then(() => console.log("4: Promise 2"));

console.log("5: Script end");

// OUTPUT ORDER:
// 1: Script start
// 5: Script end
// 3: Promise 1
// 4: Promise 2
// 2: setTimeout
```
**Why?** All synchronous code (1, 5) runs first. Then ALL chained microtasks (3, 4) drain fully before the event loop even looks at the callback queue (2).

---

## 16. JS Runtime Environment

> 1. **JS Runtime Environment (JRE)** is the container that has all the elements required to run JavaScript code.
> 2. It contains: the **JS Engine**, a set of **Web APIs**, the **Callback Queue**, the **Microtask Queue**, and the **Event Loop**.
> 3. The **JS Engine** is a piece of software/program that executes JS code (e.g., V8 for Chrome/Node.js, SpiderMonkey for Firefox).
> 4. The Engine's process: **Parsing → Compilation → Execution**.
> 5. **Parsing** breaks the code into tokens and converts it into an **AST (Abstract Syntax Tree)**.
> 6. Modern JS Engines use **JIT (Just-In-Time) Compilation** — they interpret code while simultaneously optimizing/compiling it as they go, for the best of both speed (interpretation) and performance (compilation).
> 7. **Compilation and Execution happen together** in modern engines (not two fully separate phases like older interpreted languages).
> 8. **Execution** involves the **Garbage Collector** plus various optimizations such as:
>    - **Inlining** — replacing a function call with its actual body to save call overhead
>    - **Copy Elision** — avoiding unnecessary copying of objects/values
>    - **Inline Caching** — caching the result of property/method lookups to speed up repeated access

```
JS Runtime Environment (JRE)
│
├── JS Engine (e.g. V8)
│   ├── Parser → generates AST
│   ├── Interpreter (Ignition) → quick bytecode execution
│   ├── Compiler (TurboFan - JIT) → optimizes hot code paths
│   └── Garbage Collector
│
├── Web APIs (setTimeout, fetch, DOM, console, localStorage...)
├── Callback Queue (Macrotasks)
├── Microtask Queue (Promises, MutationObserver)
└── Event Loop
```

**Simple Analogy:** Think of the JS Engine as the "chef" who cooks (executes code), while the Runtime Environment is the entire "kitchen" — including tools (Web APIs), order queue (Callback/Microtask Queue), and a manager (Event Loop) who decides what the chef does next.

---

## 17. Trust Issues with setTimeout

`setTimeout(callback, delay)` does **NOT guarantee** the callback runs exactly after `delay` milliseconds. It only guarantees a **minimum** delay — the actual execution could be much later, depending on the Call Stack.

```javascript
console.log("Start");

setTimeout(() => {
  console.log("I promised to run after 5000ms... but did I? 🤔");
}, 5000);

// Blocking the main thread for 10 seconds
function blockFor10Seconds() {
  const start = Date.now();
  while (Date.now() - start < 10000) {}
}
blockFor10Seconds();

console.log("End");

// OUTPUT:
// Start
// (10 second delay due to blocking)
// End
// I promised to run after 5000ms... but did I? 🤔  
// 👆 This actually runs AFTER ~10 seconds, NOT 5 seconds!
```

**Why?** `setTimeout` only pushes the callback into the **Callback Queue** after the timer expires. But the Event Loop can only push it to the **Call Stack** once the stack is **completely empty**. If the main thread is busy (blocked) for 10 seconds, the callback has to *wait* even though its 5000ms timer already finished at the 5-second mark.

> 💡 **Golden Rule:** `setTimeout(fn, delay)` guarantees "wait *at least* `delay` ms before running `fn`" — **NOT** "run `fn` at *exactly* `delay` ms." This is the "trust issue" — never rely on `setTimeout` for precise timing.

---

## 18. Higher Order Functions

> 1. Follow the **DRY (Don't Repeat Yourself)** principle while coding.
> 2. Use functions to stop writing repetitive lines of code.
> 3. A function that **takes another function as an argument** (a callback), and/or **returns a function**, is known as a **Higher Order Function (HOF)**.
> 4. It is the ability of functions to be stored, passed, and returned that makes them **first class citizens** — and this is exactly what enables HOFs to exist.
> 5. If you use `Array.prototype.functionName` (like `map`, `filter`, `reduce`) — that function becomes accessible on **any array** in your code, because it lives on the `Array` prototype.

```javascript
// Example 1: Function that takes another function as argument
function calculate(a, b, operation) {
  return operation(a, b);
}

function add(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}

console.log(calculate(4, 5, add));       // 9  👈 HOF in action
console.log(calculate(4, 5, multiply));  // 20 👈 HOF in action

// Example 2: Function that RETURNS another function
function multiplyBy(factor) {
  return function (num) {
    return num * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Example 3: Built-in HOFs on Array.prototype
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map((n) => n * n); // map is a HOF
console.log(squared); // [1, 4, 9, 16, 25]
```

**Why HOFs matter:** They enable powerful, reusable, declarative patterns — instead of writing manual `for` loops everywhere, you describe *what* you want done (the logic passed in), and the HOF handles *how* to iterate/apply it.

---

## 19. map, filter, reduce

These are the **most commonly asked** array HOFs in interviews. All three are **non-mutating** — they return a **new** array/value and don't modify the original array (except `forEach`, which we're not covering here since it doesn't return anything).

### 🔹 `map()` — Transform each element

Takes an array, applies a function to **each element**, and returns a **new array of the same length** with transformed values.

```javascript
// Simple example
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function (num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]

// Arrow function version (cleaner)
const tripled = numbers.map((num) => num * 3);
console.log(tripled); // [3, 6, 9, 12, 15]

// Complicated example: transforming an array of objects
const users = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "Jane", lastName: "Smith" },
];

const fullNames = users.map((user) => `${user.firstName} ${user.lastName}`);
console.log(fullNames); // ["John Doe", "Jane Smith"]
```
**How it works:** `map` internally loops through each element, calls your callback with `(element, index, array)`, collects the return value of each call into a new array, and returns that new array.

---

### 🔹 `filter()` — Select elements based on a condition

Takes an array, tests **each element** against a condition (callback returns `true`/`false`), and returns a **new array** containing only elements that passed (`true`).

```javascript
// Simple example
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const evenNumbers = numbers.filter(function (num) {
  return num % 2 === 0;
});
console.log(evenNumbers); // [2, 4, 6, 8]

// Arrow function version
const oddNumbers = numbers.filter((num) => num % 2 !== 0);
console.log(oddNumbers); // [1, 3, 5, 7]

// Complicated example: filtering objects with multiple conditions
const products = [
  { name: "Laptop", price: 800, inStock: true },
  { name: "Phone", price: 500, inStock: false },
  { name: "Tablet", price: 300, inStock: true },
];

const availableExpensiveProducts = products.filter(
  (product) => product.inStock && product.price > 400
);
console.log(availableExpensiveProducts);
// [{ name: "Laptop", price: 800, inStock: true }]
```
**How it works:** `filter` loops through the array, calls your callback for each item, and **keeps only the items** where the callback returned a truthy value.

---

### 🔹 `reduce()` — Reduce array to a single value

Takes an array and "reduces" it down to a **single accumulated value** (a number, object, string, array — anything), by running a reducer function on each element.

```javascript
// Syntax: array.reduce((accumulator, currentValue) => {...}, initialValue)

// Simple example: sum of all numbers
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce(function (acc, curr) {
  return acc + curr;
}, 0); // 0 is the initial value of 'acc'
console.log(sum); // 15

// Step-by-step trace:
// acc=0, curr=1 -> return 1
// acc=1, curr=2 -> return 3
// acc=3, curr=3 -> return 6
// acc=6, curr=4 -> return 10
// acc=10, curr=5 -> return 15  ✅ final result

// Finding the maximum value
const max = numbers.reduce((acc, curr) => (curr > acc ? curr : acc), numbers[0]);
console.log(max); // 5

// Complicated example: counting occurrences (array -> object)
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const fruitCount = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

console.log(fruitCount);
// { apple: 3, banana: 2, orange: 1 }

// Very complicated example: grouping objects by a property
const people = [
  { name: "Alice", age: 25, city: "NY" },
  { name: "Bob", age: 30, city: "LA" },
  { name: "Charlie", age: 28, city: "NY" },
];

const groupedByCity = people.reduce((acc, person) => {
  if (!acc[person.city]) acc[person.city] = [];
  acc[person.city].push(person.name);
  return acc;
}, {});

console.log(groupedByCity);
// { NY: ["Alice", "Charlie"], LA: ["Bob"] }
```
**How it works:** `reduce` maintains an `accumulator` that carries over between each iteration. On each call, your callback receives the current accumulator and the current element, and whatever you `return` becomes the new accumulator for the next iteration. After the last element, the final accumulator value is returned.

---

### 🔹 Chaining map, filter, and reduce together

A very common **real interview question**: combine all three in a single pipeline.

```javascript
const orders = [
  { item: "Shoes", price: 100, quantity: 2 },
  { item: "Shirt", price: 40, quantity: 5 },
  { item: "Cap", price: 15, quantity: 1 },
  { item: "Watch", price: 250, quantity: 1 },
];

// Goal: Find total cost of orders where total order value > 100

const totalCostOfExpensiveOrders = orders
  .map((order) => order.price * order.quantity) // [200, 200, 15, 250]
  .filter((total) => total > 100)                // [200, 200, 250]
  .reduce((acc, curr) => acc + curr, 0);         // 650

console.log(totalCostOfExpensiveOrders); // 650
```

**Breaking it down:**
1. `map` → converts each order into its total cost (`price * quantity`).
2. `filter` → keeps only totals greater than 100.
3. `reduce` → sums up all the remaining totals into one final number.

> 💡 **Interview Tip:** Being able to explain and write this exact `map → filter → reduce` chaining pattern confidently is one of the most impressive things you can show in a JS interview.

---

## Quick Summary Cheat Sheet 📝

| Concept | One-liner |
|---|---|
| Function Statement | `function foo(){}` — fully hoisted |
| Function Expression | `const foo = function(){}` — not hoisted the same way |
| Anonymous Function | Function with no name, used as a value |
| Named Function Expression | Function Expression with an internal name (useful for recursion) |
| First Class Functions | Functions can be stored, passed, returned |
| Callback | Function passed to run later |
| Single Threaded | One call stack, one task at a time |
| Blocking | Long sync task freezes everything |
| Event Loop | Manages Call Stack vs Microtask/Callback Queue |
| Microtask > Macrotask | Promises always run before setTimeout |
| Starvation | Too many microtasks block macrotasks forever |
| setTimeout trust issue | Minimum delay guarantee, not exact |
| Higher Order Function | Takes/returns a function |
| map | Transform → same length new array |
| filter | Select → shorter/equal length new array |
| reduce | Accumulate → single value |

---

**Good luck with your interview! 💪**
