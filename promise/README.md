# JavaScript Promises — Complete Guide

A one-read reference for callbacks, promises, promise chaining, and the Promise combinator APIs (`all`, `allSettled`, `race`, `any`).

---

## 1. Problems with Callbacks

### 1.1 Callback Hell (Pyramid of Doom)

Callbacks are great for extending a function's behavior — e.g. passing an error-handling function into code you've already written. The problem starts when callbacks themselves start accepting callbacks, which accept more callbacks... The result is deeply nested, unreadable, unmaintainable code shaped like a pyramid.

```javascript
getUser(userId, function (user) {
  getOrders(user.id, function (orders) {
    getOrderDetails(orders[0].id, function (details) {
      getPaymentStatus(details.id, function (status) {
        // 4 levels deep already — and growing
        console.log(status);
      });
    });
  });
});
```

Each new async step adds another level of nesting. Debugging, reading, and modifying this quickly becomes painful.

### 1.2 Inversion of Control

When you pass a callback function to another function, you hand over control of **when**, **how**, and **whether** your function gets called. The function you called might:

- Never call your callback
- Call it multiple times
- Call it in the wrong context (e.g. call your `success` callback even though an error occurred)

```javascript
function thirdPartyLibraryFunction(callback) {
  // What if this library has a bug and calls
  // the success callback even on failure?
  callback(null, "success"); // you have no control over this
}

thirdPartyLibraryFunction(function (err, result) {
  if (err) {
    console.log("Error occurred");
  } else {
    console.log("Success:", result); // could run even if something went wrong internally
  }
});
```

You've given up control of your own function's execution to someone else's code — this is **Inversion of Control**.

**Promises solve both problems**: they fix Inversion of Control by design, and enable **Promise Chaining**, which fixes Callback Hell.

---

## 2. What is a Promise?

> A **Promise** is an object representing the eventual **completion** or **failure** of an asynchronous operation.

Think of it as a placeholder/receipt for a value that isn't available yet, but will be at some point in the future.

### 2.1 The 3 States of a Promise

| State | Meaning |
|---|---|
| **Pending** | Initial state — neither fulfilled nor rejected. The value is `undefined`. |
| **Fulfilled** | Operation completed successfully. The internal value is updated with the result. |
| **Rejected** | Operation failed. The internal value is updated with the error/reason. |

```javascript
const promise = new Promise((resolve, reject) => {
  // pending state here
});
console.log(promise); // Promise { <pending> }
```

### 2.2 Key Rules

- A promise **resolves (settles) only once** — once fulfilled or rejected, it is **immutable**. Calling `resolve()`/`reject()` again has no effect.
- `.then()` lets you control **when** your callback runs — after the promise settles, not immediately, and not at the discretion of someone else's code. This is how promises fix **Inversion of Control**.

---

## 3. Creating a Promise

A promise is created using the `new Promise()` constructor, which takes a single "executor" callback function with two arguments: `resolve` and `reject` (keywords provided by JS).

```javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation successful!");
  } else {
    reject(new Error("Something went wrong"));
  }
});
```

- You can only **resolve** or **reject** — nothing else.
- Errors are typically created with `new Error('error message')`.

---

## 4. Promise Chaining (fixes Callback Hell)

Instead of nesting callbacks horizontally, `.then()` lets your code expand **vertically**, one step after another.

```javascript
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => getPaymentStatus(details.id))
  .then((status) => console.log(status))
  .catch((err) => console.error("Something failed:", err));
```

Clean, readable, and each step's failure is caught in one place.

### ⚠️ Most Common Mistake: Forgetting to `return`

Always `return` a value from inside `.then()` — the **next** `.then()` receives it.

```javascript
// ❌ WRONG — nothing is returned, next `.then` gets `undefined`
fetchUser(id)
  .then((user) => {
    fetchOrders(user.id); // missing return!
  })
  .then((orders) => {
    console.log(orders); // undefined ❌
  });

// ✅ CORRECT
fetchUser(id)
  .then((user) => {
    return fetchOrders(user.id); // returned!
  })
  .then((orders) => {
    console.log(orders); // actual orders ✅
  });
```

- If you `return` a plain value → it becomes the argument of the next `.then()`.
- If you `return` a promise → the next `.then()` automatically waits for that promise and attaches to **its** result.

---

## 5. `.catch()` — Error Handling

`.catch()` attaches a failure callback for any error thrown anywhere **above** it in the chain.

```javascript
doStep1()
  .then(doStep2)
  .then(doStep3)
  .catch((err) => console.error("Caught:", err)); // catches errors from step1, step2, step3
```

### Important rules about `.catch()`

1. `.catch()` only handles errors from `.then()` calls **above** it in the chain.
2. Any `.then()` written **below/after** a `.catch()` is **not protected** by that `.catch()` — and it **will still run**, regardless of what happened above.
3. This is useful when you want to scope error-handling to just **part** of a chain.
4. You can have **multiple `.catch()`** blocks for different segments, plus one general `.catch()` at the end for anything unhandled.

```javascript
step1()
  .then(step2)
  .catch((err) => console.log("Handled step1/step2 error:", err))
  .then(step3) // runs regardless of whether the catch above fired
  .then(step4)
  .catch((err) => console.log("General catch for step3/step4:", err));
```

---

## 6. Promise Combinator APIs — `all`, `allSettled`, `race`, `any`

### Setup: Three Example Promises

```javascript
const p1 = new Promise((resolve) =>
  setTimeout(() => resolve("P1 done"), 1000) // resolves at 1s
);

const p2 = new Promise((resolve, reject) =>
  setTimeout(() => reject("P2 failed"), 2000) // rejects at 2s
);

const p3 = new Promise((resolve) =>
  setTimeout(() => resolve("P3 done"), 3000) // resolves at 3s
);
```

| Promise | Result | Settles at |
|---|---|---|
| `p1` | resolves → `"P1 done"` | 1s |
| `p2` | **rejects** → `"P2 failed"` | 2s |
| `p3` | resolves → `"P3 done"` | 3s |

---

### 6.1 `Promise.all([p1, p2, p3])`

> Waits for **all** promises to resolve. **Fails fast** — rejects immediately as soon as **any one** promise rejects, without waiting for the rest.

```javascript
Promise.all([p1, p2, p3])
  .then((results) => console.log(results))
  .catch((err) => console.log("all() rejected:", err));
```

**With our example:** `p2` rejects at 2s → `Promise.all` **rejects at 2s** with `"P2 failed"`. It does **not** wait for `p3` (3s). `p1`'s result is discarded even though it succeeded.

```
Output at t=2s → all() rejected: P2 failed
```

**If all 3 had resolved:** it would resolve at `3s` (the slowest one) with an array of all results in order: `["P1 done", "P2 done", "P3 done"]`.

---

### 6.2 `Promise.allSettled([p1, p2, p3])`

> Waits for **all** promises to settle (either fulfilled or rejected) — **never rejects itself**. Always tells you the outcome of every promise.

```javascript
Promise.allSettled([p1, p2, p3]).then((results) => console.log(results));
```

**With our example:** waits until the **slowest** promise settles → **3s** (waits for `p3`, even though `p2` failed).

```javascript
// Output at t=3s
[
  { status: "fulfilled", value: "P1 done" },
  { status: "rejected",  reason: "P2 failed" },
  { status: "fulfilled", value: "P3 done" }
]
```

`allSettled` **never** goes to `.catch()` — it always resolves, giving you a full report.

---

### 6.3 `Promise.race([p1, p2, p3])`

> Settles as soon as **any one** promise settles — resolved or rejected, whichever happens **first** (fastest wins, good or bad).

```javascript
Promise.race([p1, p2, p3])
  .then((result) => console.log("race() resolved:", result))
  .catch((err) => console.log("race() rejected:", err));
```

**With our example:** `p1` is the fastest, settling at **1s** with a resolve.

```
Output at t=1s → race() resolved: P1 done
```

**If `p2` (the rejecting one) had been fastest** (e.g. settled at 0.5s instead of 2s), `race()` would **reject** at 0.5s with `"P2 failed"` — `race` doesn't care if the fastest outcome is success or failure, it just returns whichever happens first.

---

### 6.4 `Promise.any([p1, p2, p3])`

> Resolves as soon as **any one** promise **fulfills** (ignores rejections along the way). Only rejects if **all** promises reject — with an `AggregateError`.

```javascript
Promise.any([p1, p2, p3])
  .then((result) => console.log("any() resolved:", result))
  .catch((err) => console.log("any() rejected:", err));
```

**With our example:** `p2`'s rejection at 2s is **ignored**. The first successful (fulfilled) promise is `p1` at **1s**.

```
Output at t=1s → any() resolved: P1 done
```

**If all three had rejected** (say at 1s, 2s, 3s), `any()` would wait for the **last** one to reject (3s) and then reject with an `AggregateError` containing all 3 reasons.

---

### 6.5 Side-by-Side Summary (using p1 ✅1s, p2 ❌2s, p3 ✅3s)

| API | Settles At | Result |
|---|---|---|
| `Promise.all` | **2s** | ❌ Rejects with `"P2 failed"` (fails fast on first rejection) |
| `Promise.allSettled` | **3s** | ✅ Resolves with status/value or status/reason for all 3 |
| `Promise.race` | **1s** | ✅ Resolves with `"P1 done"` (first to settle, good or bad) |
| `Promise.any` | **1s** | ✅ Resolves with `"P1 done"` (first to *fulfill*, ignores rejections) |

### 6.6 Quick Decision Guide

| I want... | Use |
|---|---|
| All results, and to fail immediately if even one fails | `Promise.all` |
| All results no matter what — success or failure of each | `Promise.allSettled` |
| Just whichever finishes first (success or failure) | `Promise.race` |
| The first **successful** one, ignoring failures | `Promise.any` |

---

## 7. FAQ

### ❓ What is a Promise?
An object representing the eventual completion (fulfilled) or failure (rejected) of an asynchronous operation, and its resulting value.

### ❓ Why do we use Promises?
- To avoid **Callback Hell** via clean, flat chaining (`.then().then().then()`).
- To avoid **Inversion of Control** — we decide when our code runs via `.then()`, instead of handing that decision to another function.
- To handle async errors in a centralized, predictable way via `.catch()`.

### ❓ What is the need for Promises?
JavaScript is single-threaded and async operations (API calls, timers, file I/O) can't block execution. Before Promises, callbacks were the only way to handle "do this later" logic — but they didn't scale well for complex async flows, leading to unreadable, hard-to-trust code. Promises give async code structure, predictability, and composability.

### ❓ What is `AggregateError`?
`AggregateError` is a special error type thrown by `Promise.any()` when **all** the given promises reject. It bundles all individual rejection reasons into a single error object, accessible via its `.errors` property (an array).

```javascript
Promise.any([
  Promise.reject("Error A"),
  Promise.reject("Error B"),
]).catch((err) => {
  console.log(err instanceof AggregateError); // true
  console.log(err.errors); // ["Error A", "Error B"]
});
```

### ❓ Advantages of Promises
- **Readable, flat code** via chaining — no pyramid of doom.
- **Restores control** to the caller (fixes inversion of control) — execution order is determined by `.then()`, not by the called function.
- **Centralized error handling** with `.catch()`.
- **Composable** — combinator APIs (`all`, `allSettled`, `race`, `any`) let you orchestrate multiple async operations easily.
- **Guaranteed single settlement** — a promise resolves/rejects exactly once and is immutable after that, making behavior predictable.
- Forms the foundation for `async`/`await`, which makes async code look synchronous and even more readable.
