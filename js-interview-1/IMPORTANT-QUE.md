# JavaScript Execution Context, Hoisting, `this` & Prototypes – Interview-Ready Notes (Part 4)

Read this once and you should be able to **predict the output of any hoisting / scope / `this` question**, and explain *why* using execution contexts.

**How each question is structured**

- **Interview answer:** what to say in 20–30 seconds
- **Code:** corrected, runnable version
- **Execution context walkthrough:** step-by-step trace (creation phase → execution phase)
- **Analogy:** a real-life picture so it sticks
- **Corrections:** mistakes in the original notes

> **Important: run each question in its own file.** The original file cannot run as one script, because:
> - Q2 declares `var age` **and** `let age` in the same scope: `SyntaxError: Identifier 'age' has already been declared`
> - `const piyush` is declared twice (Q9 and Q10), and `const obj` twice (Q11), and `var obj` (Q8) also clashes with `const obj` (Q11)
> - Redeclaring with `let`/`const` is a **syntax error**, which is detected *before any code runs*, so nothing would print at all.
> - Q6 ends with an uncaught `ReferenceError`, which stops the script.

## Table of Contents

0. [Execution context primer (read this first)](#0-execution-context-primer-read-this-first)
1. [Q1: var hoisting](#q1-why-does-console-logage-print-undefined-instead-of-an-error)
2. [Q2: var vs let and the TDZ](#q2-assigning-before-declaration-var-vs-let)
3. [Q3: function vs var with the same name](#q3-function-declaration-vs-var-with-the-same-name)
4. [Q4: scope chain and the IIFE](#q4-iife-and-the-scope-chain)
5. [Q5: assignment before `var`](#q5-assignment-before-var)
6. [Q6: local vs global (full trace)](#q6-local-vs-global-variables-full-trace)
7. [Q7: var vs let in loops](#q7-var-vs-let-inside-a-loop-with-settimeout)
8. [Q8: `this` in objects and arrow functions](#q8-this-in-objects-arrow-functions-and-iifes)
9. [Q9: call, bind and `this`](#q9-this-with-call-and-bind)
10. [Q10: losing `this` in setTimeout](#q10-losing-this-in-settimeout)
11. [Q11: delete and the prototype chain](#q11-delete-and-the-prototype-chain)
12. [Quick revision cheat sheet](#quick-revision-cheat-sheet)

---

## 0. Execution context primer (read this first)

Every question in this file is solved with the same mental model. Learn it once.

### 0.1 What is an execution context?

An **execution context (EC)** is the environment in which JavaScript code is evaluated and run. It holds the variables, functions, the scope chain, and the value of `this`.

| Type | Created when | Notes |
| ---- | ------------ | ----- |
| **Global Execution Context (GEC)** | The script starts | Created **once**. `this` is `window` (browser script) or `module.exports` (Node CommonJS) |
| **Function Execution Context (FEC)** | A function is **called** | A new one is created for **every call** and removed when the function returns |

### 0.2 The two phases of every execution context

| Phase | Also called | What the engine does |
| ----- | ----------- | -------------------- |
| **1. Creation phase** | Memory phase | Scans the code *before running it*. Allocates memory for variables and functions, sets up the scope chain (link to the outer context), and decides what `this` is |
| **2. Execution phase** | Code phase | Runs the code **line by line**: assigns values, calls functions, prints output |

> **Hoisting is not code physically moving to the top.** It is just the result of the memory phase running *before* the execution phase.

### 0.3 What the creation phase does for each kind of declaration

| Declaration | Memory phase | Using it *before* its line |
| ----------- | ------------ | -------------------------- |
| `var x = 5` | `x` is created and set to **`undefined`** | gives `undefined` |
| `let x = 5` / `const x = 5` | `x` is created but **uninitialized** (Temporal Dead Zone) | **ReferenceError** |
| `function f() {}` (declaration) | `f` is created with the **complete function body** | works perfectly |
| `var f = function() {}` or `var f = () => {}` | only `var f` is hoisted → **`undefined`** | **TypeError: f is not a function** |
| `class A {}` | Temporal Dead Zone, like `let` | **ReferenceError** |

### 0.4 The call stack

The **call stack** holds the execution contexts. The GEC is always at the bottom. A new FEC is **pushed** on each call and **popped** when the function returns.

```js
function second() { console.log("in second"); }
function first()  { second(); }
first();
```

```
 Step 1        Step 2         Step 3          Step 4        Step 5
┌────────┐    ┌────────┐    ┌──────────┐    ┌────────┐    ┌────────┐
│        │    │        │    │ second() │    │        │    │        │
│        │    │ first()│    │ first()  │    │ first()│    │        │
│ Global │    │ Global │    │ Global   │    │ Global │    │ Global │
└────────┘    └────────┘    └──────────┘    └────────┘    └────────┘
 script       first()       first() calls   second()      first()
 starts       called       second()         returns       returns
```

### 0.5 Scope chain: how variables are looked up

When code uses a variable, the engine looks in this order and **stops at the first match**:

1. The current execution context (local scope)
2. The outer context (where the function was *written*, i.e. lexical scope)
3. ...and so on up to the global context
4. Not found anywhere: **`ReferenceError: x is not defined`**

> Exception: in non-strict mode, *assigning* to an undeclared variable (`x = 5`) silently creates a global.

### 0.6 How `this` is decided

`this` is set during the **creation phase of a function's execution context**, and for regular functions it depends on **how the function is called**, not where it was written.

| Priority | Rule | Example | `this` is |
| -------- | ---- | ------- | --------- |
| 1 | `new` binding | `new Person()` | The new object |
| 2 | **Explicit** binding | `fn.call(obj)`, `fn.apply(obj)`, `fn.bind(obj)` | `obj` |
| 3 | **Implicit** binding | `obj.method()` | The object **left of the dot** |
| 4 | **Default** binding | `fn()` | Global object (non-strict) or `undefined` (strict) |
| Special | **Arrow functions** | `() => {}` | **No own `this`**: uses the `this` of the surrounding code (lexical) |

### 0.7 Analogy: the kitchen

> Imagine a chef about to cook a meal (the execution phase). Before cooking starts, an **assistant sets up the kitchen** (the creation phase):
> - Each `var` ingredient gets a **labelled, empty box** (`undefined`).
> - Each **function declaration** is a box that already contains the **full recipe** ready to use.
> - Each `let`/`const` gets a **locked box** that cannot be opened until the chef reaches that line (Temporal Dead Zone).
>
> Then the chef cooks line by line. When the recipe calls another recipe (a function call), a **new mini-kitchen** (a function execution context) is set up on top of the pile (the call stack), and removed when it finishes.

### 0.8 A 4-step recipe for any output question

1. **Creation phase:** list every `var`, `let`/`const`, function and class in each scope, with its starting value.
2. **Execution phase:** go line by line, updating memory and calling functions (each call is a new FEC).
3. **Variable lookup:** for each variable, check local scope first, then follow the scope chain outward.
4. **For `this`:** look at the **call site** (how it was called), unless it is an arrow function.

---

## Q1. Why does `console.log(age)` print `undefined` instead of an error?

> **Interview answer:** Because of hoisting. In the creation phase the engine finds `var age` and allocates memory for it, initialized to `undefined`. When the first `console.log` runs, the variable already exists but has no value yet. The assignment (`= 20`) only happens later, in the execution phase.

```js
console.log("Value of Age is", age); // Value of Age is undefined
var age = 20;
console.log("Value of Age is", age); // Value of Age is 20
```

### Execution context walkthrough

**Global Execution Context**

| Step | Phase | What happens | `age` in memory | Output |
| ---- | ----- | ------------ | --------------- | ------ |
| 0 | Creation | `var age` found, memory allocated | `undefined` | |
| 1 | Execution | `console.log(age)` | `undefined` | `Value of Age is undefined` |
| 2 | Execution | `var age = 20` (only the assignment runs now) | `20` | |
| 3 | Execution | `console.log(age)` | `20` | `Value of Age is 20` |

> **Analogy:** The kitchen assistant puts a **labelled empty box** named "age" on the shelf *before* the chef starts. If the chef peeks in early, the box exists but is empty (`undefined`). It only gets filled when the chef reaches the line `age = 20`.

**Correction:** hoisting does not mean the code "moves to the top". The declaration is *registered in memory first*, but the **assignment stays where it is**.

---

## Q2. Assigning before declaration: `var` vs `let`

> **Interview answer:** With `var`, the variable already exists (as `undefined`), so assigning early works. With `let`/`const`, the variable exists but is **uninitialized** (Temporal Dead Zone). *Any* access before the declaration line, whether reading **or writing**, throws a `ReferenceError`.

### Part A: `var` (run in its own file)

```js
age = 100;
console.log("Value of Age is", age); // 100
var age = 30;
console.log("Value of Age is", age); // 30
```

| Step | Phase | What happens | `age` | Output |
| ---- | ----- | ------------ | ----- | ------ |
| 0 | Creation | `var age` allocated | `undefined` | |
| 1 | Execution | `age = 100` | `100` | |
| 2 | Execution | `console.log(age)` | `100` | `Value of Age is 100` |
| 3 | Execution | `var age = 30` (assignment only) | `30` | |
| 4 | Execution | `console.log(age)` | `30` | `Value of Age is 30` |

### Part B: `let` (run in a separate file)

```js
age = 100;                              // ReferenceError: Cannot access 'age' before initialization
console.log("Value of Age is", age);    // never runs
let age = 30;
```

| Step | Phase | What happens | `age` | Output |
| ---- | ----- | ------------ | ----- | ------ |
| 0 | Creation | `let age` registered but **not initialized** | `<TDZ>` (locked) | |
| 1 | Execution | `age = 100` tries to write to a locked variable | | **ReferenceError** and the script stops |

**Temporal Dead Zone (TDZ):** the time between entering the scope and executing the `let`/`const` line.

> **Analogy:** `var` is an **open empty box**: you can put things in early. `let` is a **locked box**: even *putting* something in before the chef reaches that line is not allowed.

> **Corrections:**
> 1. `var age` and `let age` **cannot exist in the same scope**. Together they cause a `SyntaxError` before anything runs, so split them into two files.
> 2. In Part B the error is thrown at the **assignment line** (`age = 100`), not at `console.log`. Your comment placed it on the wrong line, and `console.log` never executes.

---

## Q3. Function declaration vs `var` with the same name

> **Interview answer:** Function declarations are fully hoisted with their body, and they take priority over a `var` of the same name in the creation phase. The `var` does **not** reset the function to `undefined`. The function stays until the line `var myFun = function(){...}` is executed, which reassigns it.

```js
myFun();                       // Second
var myFun = function () {
  console.log("First");
};
myFun();                       // First
function myFun() {
  console.log("Second");
}
myFun();                       // First
```

### Execution context walkthrough

**Creation phase (Global EC)**

| Found | Action | `myFun` in memory |
| ----- | ------ | ----------------- |
| `function myFun() { "Second" }` | Stored with full body | `f(){ "Second" }` |
| `var myFun` | Name already exists, so **nothing changes** | `f(){ "Second" }` |

**Execution phase**

| Step | Line | `myFun` in memory | Output |
| ---- | ---- | ----------------- | ------ |
| 1 | `myFun()` | `f(){ "Second" }` | `Second` |
| 2 | `var myFun = function(){ "First" }` (assignment) | `f(){ "First" }` | |
| 3 | `myFun()` | `f(){ "First" }` | `First` |
| 4 | `function myFun() {...}` | already hoisted, **skipped** | |
| 5 | `myFun()` | `f(){ "First" }` | `First` |

**Final output:** `Second`, `First`, `First`

> **Analogy:** The kitchen already has a **box with the full recipe "Second"** on the shelf. A second box labelled `myFun` (the `var`) is not needed, since the label is already taken. When the chef reaches the `var myFun = ...` line, he **swaps the recipe card** for "First".

> **Follow-up:** what if both were `var`, as in `var f = function(){}`? Then `f()` *before* the line gives `TypeError: f is not a function`, because `f` is `undefined`.

---

## Q4. IIFE and the scope chain

> **Interview answer:** The arrow IIFE has no variable named `variable` of its own, so the engine follows the **scope chain** to the global one. Reading *and* assigning inside the IIFE therefore touch the **global** variable.

```js
var variable = 10;
(() => {
  console.log(variable); // 10
  variable = 20;
  console.log(variable); // 20
})();
console.log(variable);   // 20
var variable = 30;
console.log(variable);   // 30
```

### Execution context walkthrough

**Creation phase (GEC):** `variable: undefined`

| Step | Context | Line | Look-up | Global `variable` | Output |
| ---- | ------- | ---- | ------- | ----------------- | ------ |
| 1 | GEC | `var variable = 10` | | `10` | |
| 2 | **FEC (IIFE) pushed** | Creation phase: no declarations inside | | | |
| 3 | FEC | `console.log(variable)` | not local, so scope chain, so **global** | `10` | `10` |
| 4 | FEC | `variable = 20` | not local, so global | `20` | |
| 5 | FEC | `console.log(variable)` | global | `20` | `20` |
| 6 | **FEC popped** | | | | |
| 7 | GEC | `console.log(variable)` | | `20` | `20` |
| 8 | GEC | `var variable = 30` (assignment) | | `30` | |
| 9 | GEC | `console.log(variable)` | | `30` | `30` |

**Output:** `10`, `20`, `20`, `30`

### Classic twist (very popular in interviews)

```js
var variable = 10;
(() => {
  console.log(variable); // undefined (NOT 10!)
  var variable = 20;     // local var is hoisted and SHADOWS the global
})();
console.log(variable);   // 10
```

Because the IIFE now has its own `var variable`, the creation phase makes a **local** `variable: undefined`. The global one is untouched.

> **Analogy:** A worker in a mini-kitchen who needs "salt". If the mini-kitchen has **no salt**, he walks to the **main kitchen** and uses (and can even change) the main kitchen's salt. If the mini-kitchen has its **own empty salt jar** (a hoisted local `var`), he uses that and never looks at the main one.

---

## Q5. Assignment before `var`

```js
foo = 30;
console.log("FOO : ", foo); // 30
var foo = 100;
console.log("FOO : ", foo); // 100
```

| Step | Phase | What happens | `foo` | Output |
| ---- | ----- | ------------ | ----- | ------ |
| 0 | Creation | `var foo` allocated | `undefined` | |
| 1 | Execution | `foo = 30` updates the **declared** variable | `30` | |
| 2 | Execution | `console.log(foo)` | `30` | `FOO :  30` |
| 3 | Execution | `var foo = 100` (assignment) | `100` | |
| 4 | Execution | `console.log(foo)` | `100` | `FOO :  100` |

> Note: because `var foo` exists in the code, `foo = 30` updates that declared variable. If there were **no** declaration anywhere, non-strict mode would create an **implicit global** (and strict mode would throw a `ReferenceError`).

---

## Q6. Local vs global variables (full trace)

> **Interview answer:** `var foo` inside the IIFE is hoisted into the **function's** execution context, so `foo = 100` updates the *local* `foo`. `variable` is not declared in the IIFE, so it uses the global one. Outside the IIFE, `foo` does not exist in the global scope, so accessing it throws a `ReferenceError`, which stops the script.

```js
variable = 10;
(() => {
  foo = 100;                                // local foo (hoisted)
  console.log("Variable : ", variable);     // 10
  var foo = 100;
  variable = 20;                            // changes the GLOBAL variable
  console.log("Variable : ", variable);     // 20
})();
console.log("FOO : ", foo);                 // ReferenceError: foo is not defined
console.log("Variable : ", variable);       // never runs
var variable = 30;                          // never runs
```

### Execution context walkthrough

**Creation phase: Global EC**

| Memory | Value |
| ------ | ----- |
| `variable` | `undefined` |

(`foo` is **not** in global memory, because the only `var foo` is inside the function.)

**Execution phase**

| Step | Context | Line | What happens | Output |
| ---- | ------- | ---- | ------------ | ------ |
| 1 | GEC | `variable = 10` | global `variable = 10` | |
| 2 | GEC | `(() => {...})()` | **FEC created and pushed** on the stack | |
| 2a | FEC | *Creation phase* | local memory: `foo: undefined` | |
| 3 | FEC | `foo = 100` | updates the **local** `foo` to 100 | |
| 4 | FEC | `console.log(variable)` | not local, so scope chain, so global → 10 | `Variable :  10` |
| 5 | FEC | `var foo = 100` | local `foo` stays 100 | |
| 6 | FEC | `variable = 20` | not local, so global `variable = 20` | |
| 7 | FEC | `console.log(variable)` | global → 20 | `Variable :  20` |
| 8 | | **FEC popped**, local `foo` is destroyed | | |
| 9 | GEC | `console.log("FOO : ", foo)` | `foo` is not in the GEC and there is no outer scope → **ReferenceError** | **Uncaught ReferenceError: foo is not defined** |
| 10 | | Script **terminates** | the last `console.log` and `variable = 30` never run | |

**Call stack over time**

```
 Steps 3 - 7             Steps 8 - 9
┌─────────────────┐     ┌─────────────────┐
│ IIFE  (FEC)     │     │                 │
│  foo = 100      │     │                 │
├─────────────────┤     ├─────────────────┤
│ Global (GEC)    │     │ Global (GEC)    │
│  variable = 20  │     │  variable = 20  │
└─────────────────┘     └─────────────────┘
                         foo does not exist here → ReferenceError
```

**Final output:**
```
Variable :  10
Variable :  20
Uncaught ReferenceError: foo is not defined
```

> **Analogy:** Think of `foo` as a **tool kept only in the mini-kitchen** (the function). Once the mini-kitchen is closed and removed (popped off the stack), the main kitchen cannot see that tool. Asking for it gives "no such tool exists" (`ReferenceError`). The `variable` salt jar, however, is in the main kitchen, so the mini-kitchen changed the main kitchen's jar.

> **Correction on your diagram:** the GEC memory table lists `foo : not defined`. Strictly, `foo` is simply **not in the global memory at all**. Also, in the creation phase `variable` is `undefined`, and it becomes 10 only when line 1 executes (your rows show that correctly).

---

## Q7. `var` vs `let` inside a loop with `setTimeout`

> **Interview answer:** `setTimeout` callbacks run **after** the loop finishes (they go through the event loop). With `var` there is **one shared `i`** for the whole function/global scope, so every callback sees its final value, `10`. With `let`, each iteration gets its **own fresh copy** of `i`, so each callback remembers its own value.

```js
for (var i = 0; i < 10; i++) {
  setTimeout(() => console.log(i), 0);
}
// 10 10 10 10 10 10 10 10 10 10

for (let i = 0; i < 10; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0 1 2 3 4 5 6 7 8 9
```

### Execution context walkthrough: `var`

| Step | What happens |
| ---- | ------------ |
| Creation | `var i` → `i: undefined` in the global scope (**one** variable) |
| Loop | `i = 0, 1, 2 ... 9`: each iteration schedules a callback with `setTimeout` (the callbacks do **not** run yet) |
| Loop end | `i++` makes `i = 10`, the condition fails, the loop ends. **All 10 callbacks still point to the same `i`** |
| Event loop | Call stack is empty, so the callbacks run one by one. Each reads the shared `i`, which is `10` |

```
var:   all callbacks ──┐
                       ▼
                   ┌────────┐
                   │ i = 10 │   (one shared variable)
                   └────────┘
```

### Execution context walkthrough: `let`

Each iteration creates a **new block scope** with its own copy of `i`:

```
let:   iteration 1        iteration 2        ...   iteration 10
       ┌────────┐         ┌────────┐               ┌────────┐
       │ i = 0  │         │ i = 1  │               │ i = 9  │
       └────────┘         └────────┘               └────────┘
          ▲                  ▲                         ▲
       callback 1         callback 2               callback 10
```

Both loops are in one file, so the output order is: **ten `10`s** first (their timers were registered first), then `0` to `9`.

### Fixes for `var` (older code)

```js
// 1) IIFE creates a new scope per iteration
for (var i = 0; i < 10; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i);
}

// 2) Pass the value as an extra argument to setTimeout
for (var i = 0; i < 10; i++) {
  setTimeout((j) => console.log(j), 0, i);
}

// 3) Best: just use let
```

> **Analogy:** `var` is **one whiteboard** in the room. Ten people are told "come back later and read the number on the whiteboard". By the time they return, the number has been updated to 10, so everybody reads 10. `let` gives **each person their own sticky note** with their own number written on it.

---

## Q8. `this` in objects, arrow functions and IIFEs

> **Interview answer:** For a regular function, `this` is decided by **how it is called**: with `obj.method()`, `this` is `obj`. An **arrow function has no `this` of its own**. It uses the `this` of the code *around* where it was written, and an object literal `{ }` is **not** a scope, so that is the outer/global `this`. A function called plainly (like the IIFE) uses the default binding: the global object (or `undefined` in strict mode).

```js
var fullName = "Piyush Garg";

var obj = {
  fullName: "Hacked Full Name",

  prop: {
    fullName: "Inside Prop",
    getFullName: function () {
      return this.fullName;
    },
  },

  getFullName: function () {
    return this.fullName;
  },

  getFullNameV2: () => this.fullName,

  getFullNameV3: (function () {
    return this.fullName;
  })(),
};

console.log(obj.prop.getFullName()); // Inside Prop
console.log(obj.getFullName());      // Hacked Full Name
console.log(obj.getFullNameV2());    // depends on environment (see below)
console.log(obj.getFullNameV3);      // depends on environment (see below)
```

### Execution context walkthrough

| Call | Function type | How it is called | `this` | Result |
| ---- | ------------- | ---------------- | ------ | ------ |
| `obj.prop.getFullName()` | regular | method call, object left of the dot is `obj.prop` | `obj.prop` | **Inside Prop** |
| `obj.getFullName()` | regular | method call, object left of the dot is `obj` | `obj` | **Hacked Full Name** |
| `obj.getFullNameV2()` | **arrow** | `this` is lexical: whatever `this` was at the top level | top-level `this` | see table below |
| `obj.getFullNameV3` | IIFE | runs **immediately while the object is being created**, plain call | global object (non-strict) | see table below |

Note that `getFullNameV3` is not a function: the IIFE already ran, and the property stores its **returned value**. That is why it is logged without `()`.

### Environment-dependent results

| | V2 (arrow) | V3 (IIFE) |
| --- | ---------- | --------- |
| **Node.js (CommonJS file)** | `undefined` (top-level `this` is `module.exports`, an empty `{}`) | `undefined` (`this` is the global object, but `var` in a module is **not** a global property) |
| **Browser (classic `<script>`)** | **`"Piyush Garg"`** (top-level `this` is `window`, and top-level `var fullName` becomes `window.fullName`) | **`"Piyush Garg"`** (same reason) |
| **ES module / strict mode** | **TypeError** (top-level `this` is `undefined`) | **TypeError** (`this` is `undefined` inside a strict plain function) |

Your comments (`undefined`) match **Node.js**. In a browser, the output would be `"Piyush Garg"`. An interviewer may ask about this difference.

### Execution context view

```
GEC (this = window / module.exports)
 └─ obj created
     ├─ getFullNameV2 = arrow  → captures GEC's `this` (lexical)
     └─ getFullNameV3 → IIFE called right now:
           FEC (this = global object / undefined) → returns this.fullName
```

> **Analogy:** `this` works like the word **"I"**. For a normal function, "I" means *whoever is speaking right now* (the object that called it). An **arrow function is a pre-recorded message**: "I" always means the person who **recorded** it (the surrounding code), no matter who plays it later.

> **Corrections:** typos "Insode" (Inside) and "arraow" (arrow). Also, saying that an arrow function "points to global context" is only partly right. The precise statement is that it **has no `this` and uses the `this` of its enclosing scope**, and that is only global here because the object literal is at the top level. Finally, `var obj` here conflicts with `const obj` in Q11 if they are in the same file.

---

## Q9. `this` with `call` and `bind`

> **Interview answer:** `call` runs the function immediately with a chosen `this`. `bind` returns a **new function** with `this` permanently fixed. Explicit binding **overrides** implicit binding (`obj.method()`), and a bound function's `this` **cannot be changed again**.

```js
const piyush = {
  name: "Piyush Garg",
  sayName: function () {
    console.log(this.name);
  },
};

const john = {
  name: "John Doe",
  sayName: function () {
    console.log(this.name);
  },
};

function sayMyName() {
  console.log(this.name);
}

sayMyName();                        // undefined (Node)  /  "" empty line (browser)
sayMyName.call(john);               // John Doe
john.sayName.call(piyush);          // Piyush Garg
const newFn = john.sayName.bind(piyush);
newFn();                            // Piyush Garg
newFn.call(john);                   // Piyush Garg (a bound function ignores call)
```

### Execution context walkthrough

| Call | Rule used | `this` in the new FEC | Output |
| ---- | --------- | --------------------- | ------ |
| `sayMyName()` | **Default** binding (plain call) | global object (non-strict) | Node: `undefined`; browser: `""` (because `window.name` is an empty string by default) |
| `sayMyName.call(john)` | **Explicit** | `john` | `John Doe` |
| `john.sayName.call(piyush)` | **Explicit** (overrides the implicit `john`) | `piyush` | `Piyush Garg` |
| `newFn()` (from `bind`) | **Explicit, permanent** | `piyush` | `Piyush Garg` |
| `newFn.call(john)` | `bind` always wins | `piyush` | `Piyush Garg` |

In **strict mode**, `sayMyName()` would throw `TypeError: Cannot read properties of undefined (reading 'name')`.

> **Analogy:** `sayMyName` is a **script that says "my name is ___"**. `call(john)` says "John, read it now". `john.sayName.call(piyush)` says "this script belongs to John's cabinet, but **Piyush** reads it". `bind(piyush)` **glues Piyush's name onto the script** forever, so nobody else can read it as themselves.

> **Corrections:** the original used the spelling "Jhon Dow" (cleaned to "John Doe" here). Also `const piyush` is declared again in Q10, so keep these in separate files.

---

## Q10. Losing `this` in `setTimeout`

> **Interview answer:** When you pass `piyush.sayName` to `setTimeout`, you pass only the **function reference**. The link to `piyush` is lost. Later the timer calls it as a **plain function**, so the default binding applies and `this.name` is not `"Piyush Garg"`. Fix it with an **arrow wrapper** or **`bind`**.

```js
const piyush = {
  name: "Piyush Garg",
  sayName: function () {
    console.log(this.name);
  },
};

setTimeout(piyush.sayName, 3 * 1000);                // undefined (Node) / "" (browser)
setTimeout(() => piyush.sayName(), 3 * 1000);        // Piyush Garg
setTimeout(piyush.sayName.bind(piyush), 3 * 1000);   // Piyush Garg
```

### Execution context walkthrough

| Line | What is scheduled | After 3 s the callback is called as | `this` | Output |
| ---- | ----------------- | ----------------------------------- | ------ | ------ |
| 1 | the bare `sayName` function | a **plain function** (no object before the dot) | default binding (see note) | `undefined` in Node, empty string in browser |
| 2 | an **arrow function** | arrow runs `piyush.sayName()`: a **method call** with `piyush` left of the dot | `piyush` | `Piyush Garg` |
| 3 | a **bound** function | bound function | `piyush` (fixed by `bind`) | `Piyush Garg` |

> *Note on line 1:* in a **browser**, `this` is `window`, and `window.name` is `""`. In **Node.js**, `this` inside a `setTimeout` callback is the internal `Timeout` object, which has no `name`, giving `undefined`.

All three callbacks run after **3 seconds**, in the order they were scheduled. (They go through the **event loop**, as covered in Part 3.)

> **Analogy:** Handing a friend a **recipe card torn out of the chef's book** (`piyush.sayName`). When your friend reads "my name is...", the "my" now means **the friend**, not the chef. The arrow-function wrapper is like **calling the chef himself** to cook it. `bind` is like **writing the chef's name on the card in permanent marker**.

> **Correction:** `const piyush` is declared twice (Q9 and Q10), so these cannot share a file.

---

## Q11. `delete` and the prototype chain

> **Interview answer:** `delete` removes only an object's **own** properties. If a property is inherited from the prototype, `obj.height` is found by walking up the **prototype chain**, and `delete obj.height` does nothing, because `obj` does not own it.

```js
// Part A: own property
const obj1 = { height: 30 };
console.log(obj1.height); // 30
delete obj1.height;
console.log(obj1.height); // undefined

// Part B: inherited property
const obj2 = Object.create({ height: 30 });
console.log(obj2.height); // 30  (found on the prototype)
delete obj2.height;       // returns true, but there is no OWN property to delete
console.log(obj2.height); // 30  (still inherited)
```

*(The original used `const obj` twice. Here the names are `obj1` and `obj2` so both parts can run.)*

### Prototype chain view

```
obj1                       obj2                    prototype object
┌──────────────┐          ┌──────────────┐        ┌──────────────┐
│ height: 30   │          │ (no own      │  ───►  │ height: 30   │ ───►  Object.prototype ───► null
└──────────────┘          │  properties) │        └──────────────┘
 own property             └──────────────┘         inherited property
```

**Property lookup:** check own properties first, then move up the chain until `null`.

### More details interviewers ask

```js
console.log(Object.hasOwn(obj2, "height")); // false: it is not an own property

// Shadowing: an own property hides the inherited one
obj2.height = 10;
console.log(obj2.height);  // 10 (own)
delete obj2.height;
console.log(obj2.height);  // 30 (own removed, inherited visible again)

// To really remove it, delete it from the prototype itself
delete Object.getPrototypeOf(obj2).height;
console.log(obj2.height);  // undefined
```

- `delete` returns `true` even when nothing was deleted.
- In strict mode, deleting a **non-configurable** property (for example on a frozen object) throws a `TypeError`.

> **Analogy:** You drive **your dad's car** (inherited). If you throw away your own driving licence (an own property), his car is still in the garage. To make the car disappear, **dad** has to sell it (delete it from the prototype). If you buy your own car (shadowing) and later sell it, you go back to using dad's car.

---

## Quick revision cheat sheet

| # | Topic | One-line answer |
| - | ----- | --------------- |
| 0 | Execution context | Creation phase (allocate memory, set scope chain and `this`), then execution phase (run line by line) |
| 1 | `var` hoisting | `var` is allocated in the creation phase as `undefined`; only the assignment happens later |
| 2 | `let` / TDZ | `let`/`const` are hoisted but locked until their line; reading **or writing** early throws `ReferenceError` |
| 3 | Function vs `var` | Function declarations are hoisted with their body and win over a same-name `var`; later assignment overwrites them |
| 4 | Scope chain | Look local first, then outward to global; a hoisted local `var` **shadows** the outer variable |
| 5 | Early assignment | Assigning before a `var` line works because the variable already exists |
| 6 | Local vs global | `var` inside a function is local, so it is not visible outside; a missing variable is a `ReferenceError` that halts the script |
| 7 | `var` vs `let` loops | `var` has one shared `i` (prints 10 ten times); `let` has a new `i` per iteration (0 to 9) |
| 8 | `this` / arrow | Regular function: `this` = caller (left of the dot). Arrow: no own `this`, uses the surrounding `this` |
| 9 | call / bind | Explicit binding beats implicit; a `bind`-ed function's `this` is permanent |
| 10 | Lost `this` | Passing `obj.method` detaches it. Fix with an arrow wrapper or `bind` |
| 11 | `delete` | Removes only own properties; inherited ones stay and are found through the prototype chain |

### `this` at a glance

`new` > `call`/`apply`/`bind` > `obj.method()` > plain call (global / `undefined` in strict mode). **Arrow functions ignore all of these** and use the surrounding `this`.

### Common traps interviewers love

1. `var` before its line is `undefined`. `let`/`const` before their line is a `ReferenceError`. Function declarations work fully.
2. A function declaration beats a `var` of the same name in the creation phase, until the `var` line runs and reassigns it.
3. `var` inside a function is **local**. Without any declaration, non-strict mode creates an accidental **global**.
4. `var` in a loop with `setTimeout` prints the final value. `let` prints each value.
5. An object literal `{ }` does **not** create a scope or a `this`. An arrow function inside it gets the **outer** `this`.
6. `obj.method` passed as a callback **loses** `this`.
7. `delete` cannot remove inherited properties.
8. The same code can behave differently in **Node vs browser vs strict mode** (`this`, global variables). State your environment when you answer.
