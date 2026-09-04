# JavaScript Core Concepts — Interview Prep Guide

A complete, example-driven guide to how JavaScript actually works under the hood.
Read top to bottom — each topic builds on the previous one.

> 💡 **Tip:** Open Chrome DevTools (`F12` or `Ctrl+Shift+I`) → **Sources** tab while reading this.
> You can paste any code snippet in the **Console**, set breakpoints, and watch the
> **Call Stack** panel (top-right) update live. This is the single best way to *see*
> everything explained below instead of just reading about it.

---

## Table of Contents
1. [How JavaScript Works](#1-how-javascript-works)
2. [Execution Context](#2-execution-context)
3. [How JS Code is Executed (Phases)](#3-how-js-code-is-executed-phases)
4. [Call Stack](#4-call-stack)
5. [Hoisting](#5-hoisting)
6. [The `window` Object and `this` in Global Execution Context](#6-the-window-object-and-this-in-global-execution-context)
7. [Scope, Scope Chain & Lexical Environment](#7-scope-scope-chain--lexical-environment)
8. [Defined vs Not Defined vs Undeclared](#8-defined-vs-not-defined-vs-undeclared)
9. [`let` and `const` in JS](#9-let-and-const-in-js)
10. [Temporal Dead Zone (TDZ)](#10-temporal-dead-zone-tdz)
11. [`let`/`const` Hoisting & Block Scope](#11-letconst-hoisting--block-scope)
12. [Shadowing in JS](#12-shadowing-in-js)
13. [Illegal Shadowing](#13-illegal-shadowing)
14. [Quick Revision Cheat Sheet](#14-quick-revision-cheat-sheet)

---

## 1. How JavaScript Works

JavaScript is a **synchronous, single-threaded** language. This means:
- It has **one call stack** → it can do only **one thing at a time**.
- Everything in JS happens inside an **Execution Context**.

> **Everything in JavaScript happens inside an Execution Context.**

Think of the Execution Context as a big sealed box/container in which the whole
JS program runs.

---

## 2. Execution Context

An **Execution Context (EC)** is created whenever JavaScript code runs.
It has two components:

```
Execution Context
├── Memory Component  (Variable Environment)
│     → stores variables & functions as key-value pairs
└── Code Component     (Thread of Execution)
      → executes code line by line
```

- **Memory Component (Variable Environment):** Stores all variables and
  functions in key–value pairs (this is where hoisting happens).
- **Code Component (Thread of Execution):** Executes the code one line at a
  time — JS is **synchronous** and **single-threaded**, so it only ever does
  one line at a time, in order.

### Example
```js
var x = 1;
function greet() {
  return "hi";
}
```
Memory component after this runs:
```
x       -> 1
greet   -> function greet(){...}
```

---

## 3. How JS Code is Executed (Phases)

Every Execution Context is created in **two phases**:

### Phase 1: Memory Creation Phase (a.k.a. Creation Phase)
- JS scans the whole code first (without executing it).
- Allocates memory to all variables and functions.
- Variables → set to `undefined`.
- Functions → the **entire function** is stored in memory (this is why you can
  call a function before its definition).

### Phase 2: Code Execution Phase
- JS runs the code line by line.
- Actual values get assigned to variables.
- Function calls create a **new Execution Context** of their own.

### Full Example
```js
var n = 2;

function square(num) {
  var ans = num * num;
  return ans;
}

var square2 = square(n);
var square4 = square(4);
```

**Phase 1 (Memory):**
```
n        -> undefined
square   -> function square(num){...}
square2  -> undefined
square4  -> undefined
```

**Phase 2 (Execution):** line by line, values get filled in, and every
function call spins up its **own new Execution Context** (with its own
memory + code phases) which gets destroyed once the function returns.

---

## 4. Call Stack

Since JS is single-threaded, it needs a mechanism to keep track of *where*
it is in the program → this is the **Call Stack**.

- Also called: **Program Stack, Control Stack, Execution Context Stack**.
- Works on **LIFO** (Last In, First Out).
- The bottom-most entry is always the **Global Execution Context (GEC)**.
- Every function call **pushes** a new Execution Context onto the stack.
- When a function finishes/returns, its Execution Context is **popped off**.

### Example
```js
function a() {
  b();
  console.log("a done");
}
function b() {
  console.log("inside b");
}
a();
console.log("script done");
```

**Call Stack visualization:**
```
Step 1: [ GEC ]
Step 2: [ GEC, a() ]
Step 3: [ GEC, a(), b() ]
Step 4: [ GEC, a() ]        // b() popped after execution
Step 5: [ GEC ]              // a() popped after execution
```

**Output:**
```
inside b
a done
script done
```

> 🔍 **See it in Chrome:** DevTools → Sources → add a `debugger;` line in your
> code → reload the page → the **Call Stack** panel on the right shows this
> exact push/pop behavior live, frame by frame.

---

## 5. Hoisting

**Hoisting** is JS's default behavior of moving declarations to the top of
their scope **during the Memory Creation Phase**, before any code executes.

- `var` variables → hoisted and initialized with `undefined`.
- Function declarations → hoisted **completely** (with their full body).
- `let`/`const` → hoisted too, but NOT initialized (see [TDZ](#10-temporal-dead-zone-tdz)).

### Example
```js
console.log(x);   // undefined (not an error!)
console.log(getName()); // "Namaste JS"

var x = 7;
function getName() {
  console.log("Namaste JS");
}
```
**Output:**
```
undefined
Namaste JS
```

Why? Because in the Memory Creation Phase:
```
x        -> undefined
getName  -> function getName(){...}
```
So `x` exists (as `undefined`) and `getName` exists in full — that's why
calling it *before* its written position still works.

### Function Expressions are NOT hoisted like declarations
```js
console.log(add);  // undefined
add(2,3);           // ❌ TypeError: add is not a function

var add = function (a, b) {
  return a + b;
};
```
Here `add` is just a `var` (hoisted as `undefined`), not a full function —
so calling it too early throws a `TypeError`.

---

## 6. The `window` Object and `this` in Global Execution Context

When the JS engine creates the **Global Execution Context (GEC)**, along with
memory & code components, it also creates two special things:

1. A **global object** — called `window` in browsers (`global` in Node.js).
2. A `this` variable — pointing to that global object.

```js
console.log(window);   // huge browser global object
console.log(this);     // window (in browsers, non-strict mode, global scope)
console.log(this === window); // true
```

- Any `var` declared globally also becomes a property of `window`:
```js
var a = 10;
console.log(window.a); // 10
```
- `let`/`const` declared globally do **not** attach to `window`
  (they live in a separate "Script" scope):
```js
let b = 20;
console.log(window.b); // undefined
```

> 🔍 **In Chrome DevTools Console**, just type `window` and expand it — you'll
> see hundreds of built-in properties/methods (`alert`, `document`,
> `localStorage`, `console`, etc.) that exist even before your code runs.

---

## 7. Scope, Scope Chain & Lexical Environment

### Scope
Scope determines **where** in your code a variable is accessible.

### Lexical Environment
Whenever an Execution Context is created, a **Lexical Environment** is
created along with it.

> **Lexical Environment = Local Memory (variables in the current scope) + Reference to the Lexical Environment of its parent.**

"Lexical" = in order/hierarchy. A function's lexical environment is decided
by *where it is physically written* in the code.

### Scope Chain
When a variable isn't found in the current scope, JS looks up into the
**parent's** lexical environment, then the parent's parent, and so on, until
it reaches the **Global Lexical Environment**. This chain of lookups is the
**Scope Chain**.

### Example
```js
function a() {
  function c() {
    var b = 10;
    console.log(x); // accessible via scope chain
  }
  c();
  var x = 1;
}
a();
```
**Output:** `1`

Scope Chain here: `c() -> a() -> Global`
- `c` doesn't have `x` → looks into `a` → finds `x = 1` → uses it.

### Nested Example
```js
function outer() {
  var outerVar = "I am outer";
  function inner() {
    var innerVar = "I am inner";
    console.log(outerVar); // found via scope chain
    console.log(innerVar);
  }
  inner();
}
outer();
```
**Output:**
```
I am outer
I am inner
```

> ⚠️ Scope chain works **only outward/upward**, never inward. `outer()`
> **cannot** access `innerVar`.

> 🔍 **In Chrome DevTools:** put a `debugger;` inside `inner()`, reload, and
> check the **Scope** panel on the right — it literally shows `Local`,
> `Closure (outer)`, and `Global` sections, exactly matching the scope chain.

---

## 8. Defined vs Not Defined vs Undeclared

These three are **not the same** — a very common interview trap.

| Term | Meaning | Example |
|---|---|---|
| **Undefined** | Variable is declared, memory is allocated, but no value assigned yet | `var a; console.log(a); // undefined` |
| **Not Defined** | Variable was never declared anywhere | `console.log(z); // ❌ ReferenceError: z is not defined` |
| **Undeclared (informal term)** | Often used loosely to mean "not defined" — technically JS doesn't have a separate "undeclared" type, it throws `ReferenceError` | same as above |

```js
console.log(a);  // undefined  (declared, not assigned)
console.log(z);  // ReferenceError: z is not defined (never declared)
var a = 10;
```

> **`undefined` is a value in JS** — it means "declared but not assigned."
> **"Not defined" is an error state** — the variable doesn't exist in memory
> at all.

---

## 9. `let` and `const` in JS

- `let` and `const` were introduced in **ES6 (2015)** to fix problems with `var`.
- Both are **block-scoped** (unlike `var`, which is function-scoped).
- `const` **must** be initialized at declaration and **cannot be reassigned**.
- `let` can be reassigned but not redeclared in the same scope.

```js
let x = 10;
x = 20;        // ✅ fine

const y = 5;
y = 10;        // ❌ TypeError: Assignment to constant variable.

const z;       // ❌ SyntaxError: Missing initializer in const declaration
```

```js
var a = 1;
var a = 2;     // ✅ redeclaration allowed with var

let b = 1;
let b = 2;     // ❌ SyntaxError: Identifier 'b' has already been declared
```

> `const` doesn't make objects immutable — it just prevents **reassigning the
> variable itself**:
```js
const obj = { name: "JS" };
obj.name = "JavaScript"; // ✅ allowed — object contents can change
obj = {};                 // ❌ not allowed — can't reassign the variable
```

---

## 10. Temporal Dead Zone (TDZ)

The **TDZ** is the time between when a `let`/`const` variable is **hoisted**
(enters scope) and when it is **actually initialized** with a value in the
code. Accessing it during this window throws a `ReferenceError`.

```js
console.log(a); // ReferenceError: Cannot access 'a' before initialization
let a = 10;
console.log(a); // 10
```

```js
console.log(x); // undefined  <-- var: no TDZ
var x = 5;
```

### Why does TDZ exist?
`let`/`const` **are hoisted**, just like `var` — but they are placed in a
separate memory space (not the global `window`/execution-context memory
object) and are kept **uninitialized** until the line where they're actually
declared executes. Trying to touch them before that = TDZ error.

```js
let a = 10;
{
  console.log(a); // ReferenceError (TDZ) - even though outer 'a' exists!
  let a = 20;
}
```
This throws because the *inner* `a` shadows the outer one, and the inner `a`
is in its own TDZ until its declaration line runs.

---

## 11. `let`/`const` Hoisting & Block Scope

### They ARE hoisted (contrary to popular belief)
```js
{
  console.log(typeof x); // 'undefined' -- x exists in TDZ, but typeof on TDZ var is special
}
```
Actually, `typeof` on a TDZ variable throws too if accessed directly:
```js
console.log(typeof x); // ReferenceError (if x is later declared with let/const in same scope)
let x = 5;
```
> Compare: `console.log(typeof neverDeclared); // 'undefined'` — no error,
> because `neverDeclared` doesn't exist anywhere. TDZ only applies to
> variables that **do** get declared later in that scope.

### Block Scope
A **block** = anything inside `{ }` (if, for, while, or a standalone block).

```js
{
  var a = 10;
  let b = 20;
  const c = 30;
}
console.log(a); // 10   -> var is function/global scoped, escapes the block
console.log(b); // ReferenceError -> let is block scoped
console.log(c); // ReferenceError -> const is block scoped
```

| Keyword | Scope | Hoisted | Reassignable | Redeclarable |
|---|---|---|---|---|
| `var` | function/global | ✅ (as `undefined`) | ✅ | ✅ |
| `let` | block | ✅ (in TDZ) | ✅ | ❌ |
| `const` | block | ✅ (in TDZ) | ❌ | ❌ |

---

## 12. Shadowing in JS

**Shadowing** happens when a variable declared in an inner (nested) scope has
the **same name** as a variable in an outer scope. The inner variable
"shadows" (hides) the outer one **within that inner scope only**.

### With `var`
```js
var a = 100;
function x() {
  var a = 10; // shadows outer 'a'
  console.log(a); // 10
}
x();
console.log(a); // 100 -- outer 'a' is untouched
```

### With `let`/`const` (block scoping makes this cleaner)
```js
let b = 10;
{
  let b = 100; // shadows outer 'b' inside this block only
  console.log(b); // 100
}
console.log(b); // 10 -- back to outer value
```

### Tricky case — `var` inside a block does NOT create a new scope
```js
let c = 5;
{
  var c = 10; // ❌ SyntaxError in this exact mix -> see "Illegal Shadowing" below
}
```

---

## 13. Illegal Shadowing

You **can** shadow `let` with `let`, or `var` with `var`, inside a nested
block. But you **cannot** shadow a `let`/`const` variable using `var` in an
inner block — because `var` is function-scoped and would try to leak out
into/modify the outer `let`'s territory, which JS disallows.

```js
let a = 20;
{
  var a = 20; // ❌ SyntaxError: Identifier 'a' has already been declared
}
```

However, the reverse is perfectly legal:
```js
var b = 20;
{
  let b = 30; // ✅ totally fine -- let can shadow var
  console.log(b); // 30
}
console.log(b); // 20
```

### Function scope exception
```js
let c = 10;
function demo() {
  var c = 20; // ✅ fine! function creates a whole new scope, not just a block
  console.log(c); // 20
}
demo();
console.log(c); // 10
```
This works because `var` is scoped to the **function**, and the function
body is a completely separate scope from the block `{ }` — the illegal
shadowing rule only bites when `var` and `let` are fighting over the **same
block scope**.

### Summary Table

| Shadowing `let`/`const` (outer) with... | Inside a `{ }` block | Inside a function |
|---|---|---|
| `let`/`const` (inner) | ✅ Legal | ✅ Legal |
| `var` (inner) | ❌ Illegal (SyntaxError) | ✅ Legal |

---

## 14. Quick Revision Cheat Sheet

- JS is **synchronous, single-threaded** → one Call Stack, one thing at a time.
- Everything runs inside an **Execution Context** = Memory Component + Code Component.
- Every EC is built in **2 phases**: Memory Creation → Code Execution.
- **Call Stack** = LIFO stack that tracks which EC is currently running; GEC is always at the bottom.
- **Hoisting**: `var` & functions get memory upfront; `var` → `undefined`, functions → full body; `let`/`const` → hoisted but in TDZ.
- **`window`** = global object in browsers; global `this` === `window`; global `var` attaches to `window`, `let`/`const` don't.
- **Lexical Environment** = local memory + reference to parent's lexical environment → chain of these = **Scope Chain**.
- **`undefined`** (declared, no value) ≠ **not defined** (never declared → `ReferenceError`).
- **`let`/`const`**: block-scoped, TDZ applies, `const` can't be reassigned.
- **TDZ**: time between hoisting and actual initialization — accessing throws `ReferenceError`.
- **Block scope**: `{ }` creates scope for `let`/`const`, not for `var`.
- **Shadowing**: inner variable of same name hides outer one, only within inner scope.
- **Illegal shadowing**: can't shadow `let`/`const` with `var` in the same block (but fine inside a nested function).

---

## Recommended Way to Practice

1. Copy any snippet above into Chrome DevTools **Console** or **Sources → Snippets**.
2. Add `debugger;` right before the tricky line.
3. Reload/run and watch the **Call Stack** and **Scope** panels on the right side of DevTools update in real time.
4. Try predicting the output *before* running it — that's exactly how interviewers test you.

**Useful references:**
- Chrome DevTools docs: https://developer.chrome.com/docs/devtools/
- MDN — Execution context & Hoisting: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
- MDN — `let`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
- MDN — `const`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
- ECMAScript Specification: https://tc39.es/ecma262/