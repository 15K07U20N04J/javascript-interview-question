# JavaScript Async/Await — Interview Preparation

A complete guide to `async`/`await`, how it works under the hood, and how it compares to Promises. Includes annotated explanations of the code samples you provided.

---

## Table of Contents

1. [What is `async`?](#1-what-is-async)
2. [What is `await`?](#2-what-is-await)
3. [How async/await work behind the scenes](#3-how-asyncawait-work-behind-the-scenes)
4. [Example of async/await](#4-example-of-asyncawait)
5. [Error Handling](#5-error-handling)
6. [Async/Await vs Promise.then().catch()](#6-asyncawait-vs-promisethencatch)
7. [How the Call Stack works with async/await](#7-how-the-call-stack-works-with-asyncawait)
8. [Working of the `fetch` function](#8-working-of-the-fetch-function)
9. [Common Interview Questions](#9-common-interview-questions)

---

## 1. What is `async`?

`async` is a keyword placed before a function declaration that does two things:

- It makes the function **always return a Promise**, even if you return a plain value. JS automatically wraps the returned value in `Promise.resolve(...)`.
- It **enables the use of `await`** inside that function's body.

```js
// always returns a promise
async function getData() {
    return "Hello, World!";
}

getData().then(res => console.log(res)); // "Hello, World!"
```

Even though `getData()` returns a plain string `"Hello, World!"`, because the function is `async`, JavaScript wraps it as `Promise.resolve("Hello, World!")`. That's why you can call `.then()` on the result.

**Key point:** `async function foo() {}` is roughly equivalent to a function that returns `new Promise((resolve) => { ...body...; resolve(returnValue); })`, with `await` support added on top.

---

## 2. What is `await`?

`await` is an operator that can **only be used inside an `async` function** (or at the top level of ES modules). It:

- Pauses execution of the `async` function at that line.
- Waits for the Promise on its right-hand side to **settle** (resolve or reject).
- If resolved → returns the resolved value.
- If rejected → throws the rejected value as an exception (catchable with `try/catch`).

Importantly, `await` **does not block the main thread**. It only pauses the async function itself — the rest of the JS engine (call stack, other code) keeps running.

```js
async function handlePromise() {
    const val1 = await p; // pauses HERE until p settles, but JS engine is free to do other work
    console.log(val1);
}
```

---

## 3. How async/await work behind the scenes

`async/await` is **syntactic sugar over Promises + Generators**. Under the hood:

1. When an `async` function is called, it starts executing **synchronously**, just like a normal function — until it hits the first `await`.
2. At `await somePromise`, the function's execution is **suspended** and control is handed back to the caller. The `async` function itself returns a pending Promise immediately.
3. The engine registers a callback (conceptually similar to `.then()`) to resume the function once `somePromise` settles.
4. Once the awaited Promise settles, the paused function is placed back for execution — but **not immediately**. It goes into the **microtask queue**.
5. The **Event Loop** only picks up that continuation once the current call stack is empty (i.e., after all synchronous code and any pending microtasks finish).
6. This repeats for every subsequent `await` — each one suspends, waits, and resumes via the microtask queue.

**Mental model:**
```
async function = generator function + Promise + automatic microtask scheduling
```

Conceptually, this:
```js
async function handlePromise() {
    const val1 = await p;
    console.log(val1);
}
```
behaves like this (simplified, using generators + Promises):
```js
function handlePromiseGen() {
    return step(genFn());
}
function step(gen, arg) {
    const result = gen.next(arg);
    if (result.done) return Promise.resolve(result.value);
    return Promise.resolve(result.value).then(val => step(gen, val));
}
function* genFn() {
    const val1 = yield p;
    console.log(val1);
}
```

This is why `async/await` doesn't introduce a new concurrency model — it's built entirely on the existing **Promise + microtask queue** machinery.

---

## 4. Example of async/await

Your code:

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello, World!");
    }, 10000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello, World!");
    }, 3000);
});

// await can be used only inside async functions
async function handlePromise() {
    const val1 = await p;
    console.log("Hello World1");
    console.log(val1);

    const val3 = await p1;
    console.log("Hello World3");
    console.log(val3);

    const val4 = await p2;
    console.log("Hello World4");
    console.log(val4);
}

handlePromise();
```

**Walkthrough:**

- `p` resolves after 5s, `p1` after 10s, `p2` after 3s. All three timers **start counting the moment the Promises are created**, not when `await` runs.
- `handlePromise()` is called. Execution pauses at `await p` (~5s wait).
- After `p` resolves at 5s → logs `"Hello World1"` then `"Hello, World!"`.
- Then it awaits `p1`. But `p1`'s timer *started at t=0*, and it resolves at t=10s — so from this point, the function waits **another 5 seconds** (10s - 5s already elapsed), not a fresh 10s.
- At t=10s → logs `"Hello World3"` then `"Hello, World!"`.
- Then it awaits `p2`, which already resolved back at t=3s (it settled long ago while we were waiting on `p` and `p1`). Since it's already settled, `await p2` resolves **immediately**.
- Immediately after → logs `"Hello World4"` then `"Hello, World!"`.

**Important takeaway:** `await` doesn't restart a Promise's timer — it just waits for a Promise to *settle*. If the Promise already settled before you `await` it, you get the value on the very next microtask tick with no extra delay. This is a classic interview trap: sequential `await`s on promises created up-front don't "add up" their delays the way people expect.

**Total time for this script to finish:** ~10 seconds (bounded by `p1`, the longest timer), not 5 + 10 + 3 = 18 seconds.

---

## 5. Error Handling

Errors in `async/await` are handled with plain `try/catch`, which mirrors synchronous error handling — this is one of `async/await`'s biggest ergonomic wins over `.then()/.catch()` chains.

From your code:

```js
async function fetchDataGithub() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
```

**How it works:**
- If `fetch(API_URL)` rejects (e.g., network failure, DNS error, CORS issue) — the rejection is thrown as an exception at the `await` line, and control jumps directly to `catch`.
- If `response.json()` fails (e.g., malformed JSON) — same thing, it throws and is caught.
- **Note:** `fetch` does **not** reject on HTTP error status codes (404, 500, etc.) — it only rejects on network-level failures. To handle HTTP errors you must check `response.ok` or `response.status` manually:

```js
async function fetchDataGithub() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
```

**Other error-handling patterns:**

- Catching errors outside the function (since `async` functions return rejected Promises on uncaught throws):
```js
async function fetchDataGithub() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

fetchDataGithub().catch(err => console.error("Caught outside:", err));
```

- `finally` block runs regardless of success/failure — useful for cleanup (e.g., hiding a loading spinner):
```js
async function fetchDataGithub() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error(error);
    } finally {
        console.log("Request finished (success or fail)");
    }
}
```

---

## 6. Async/Await vs Promise.then().catch()

Both are ways to work with Promises — `async/await` doesn't replace Promises, it's built on top of them.

| Aspect | `.then().catch()` | `async/await` |
|---|---|---|
| Syntax style | Chained callbacks | Looks synchronous |
| Readability | Gets messy with nested/dependent async calls ("callback-chain pyramid") | Reads top-to-bottom like normal code |
| Error handling | `.catch()` at the end of chain | Standard `try/catch` |
| Debugging | Stack traces less intuitive across `.then()` chains | Easier to step through and debug |
| Parallel execution | Natural with `Promise.all([...])` inside a `.then()` | Still needs `Promise.all()`, just awaited |
| Return type | Returns a Promise | `async` function always returns a Promise |
| Underlying mechanism | Native Promise API | Sugar over Promises + generators |

**Example comparison:**

```js
// Promise chaining
function getData() {
    p.then((res) => console.log(res));
    console.log("Hello World");
}

// vs async/await
async function getDataAsync() {
    const res = await p;
    console.log(res);
}
```

In your commented-out example:
```js
function getData() {
    p.then((res) => console.log(res));
    console.log("Hello World");
}

const dataPromise = getData();
```
- `p.then(...)` is **non-blocking** — it registers a callback and moves on immediately.
- `console.log("Hello World")` runs *before* the promise resolves (since `p` takes 5s).
- Output order: `"Hello World"` first, then `"Hello, World!"` after 5s.
- This demonstrates that `.then()` doesn't pause the enclosing function — unlike `await`, which does pause the enclosing `async` function.

**When to prefer which:**
- Use `async/await` for most business logic — it's more readable, especially with multiple dependent async steps.
- `.then()/.catch()` is still fine for short, simple one-off chains, or in older codebases/libraries that don't use `async/await` conventions.
- For **parallel** independent operations, combine both: `await Promise.all([p1, p2, p3])`.

---

## 7. How the Call Stack works with async/await

The JS engine has three key pieces relevant here: the **Call Stack**, the **Microtask Queue** (Promises live here), and the **Macrotask/Callback Queue** (setTimeout, fetch callbacks live here), all coordinated by the **Event Loop**.

**Step-by-step with `handlePromise()`:**

1. `handlePromise()` is called → a new frame is pushed onto the **call stack**.
2. Code runs synchronously until the first `await p`.
3. At `await`, the async function is **suspended and popped off the call stack** — it does NOT block the stack while waiting. Control returns to whoever called `handlePromise()`.
4. The call stack is now free to run other synchronous code (e.g., `fetchDataGithub()` if called right after, or any other statements).
5. Meanwhile, `p`'s `setTimeout` callback is handled by the **Web API** (browser) / **libuv** (Node) environment — it's timed outside the call stack entirely.
6. When the timer fires, the resolve callback is placed in the **task queue**, and once `p` resolves, the continuation of `handlePromise()` (everything after `await p`) is queued as a **microtask**.
7. The **Event Loop** checks: "Is the call stack empty?" If yes, it drains the **microtask queue completely** before touching the macrotask (callback) queue.
8. The continuation of `handlePromise()` gets pushed back onto the call stack, runs `console.log("Hello World1")`, `console.log(val1)`, then hits `await p1` — and the cycle repeats: suspend, pop off stack, wait, resume via microtask queue.

**Why this matters (interview angle):** This is precisely why `async/await`/Promises are called "non-blocking" — the call stack is never occupied while waiting. It's also why **microtasks (Promises) always run before macrotasks (setTimeout)** even if a setTimeout has `0ms` delay — the event loop prioritizes fully draining the microtask queue first.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

// Output: 1, 4, 3, 2
// Sync code first (1, 4) → microtask queue (3) → macrotask queue (2)
```

---

## 8. Working of the `fetch` function

```js
const API_URL = "https://api.github.com/users/15K07U20N04J";

async function fetchDataGithub() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchDataGithub();
```

**How `fetch` works, step by step:**

1. `fetch(API_URL)` immediately returns a **Promise** and kicks off an HTTP request in the background (handled by the browser's networking layer, outside the JS call stack).
2. The first `await` pauses `fetchDataGithub()` until that Promise settles.
3. The Promise **resolves** as soon as the **response headers** arrive — not when the full body is downloaded. This is a key gotcha: `fetch` resolving does **not** mean you have the data yet, just that the server responded with headers/status.
4. `response` is a `Response` object containing metadata: `status`, `ok`, `headers`, and body-reading methods like `.json()`, `.text()`, `.blob()`.
5. `response.json()` is *also* asynchronous — it returns another Promise that resolves once the response body stream is fully read and parsed as JSON. That's why it needs its own `await`.
6. So the full chain is:
   ```
   fetch() → Promise<Response>  (resolves when headers arrive)
        → response.json() → Promise<parsed JSON>  (resolves when body is read + parsed)
   ```
7. `data` now holds the actual parsed JavaScript object, ready to use.

**Gotchas worth mentioning in an interview:**
- `fetch` only rejects on network failures (DNS issues, no connectivity, CORS blocks) — **not** on HTTP error codes like 404/500. You must manually check `response.ok`.
- Both `fetch()` and `.json()` are asynchronous and need to be awaited (or chained) separately.
- `fetch` has no built-in timeout — use `AbortController` for that:
```js
async function fetchWithTimeout(url, ms = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ms);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        console.error("Fetch failed or timed out:", error);
    }
}
```

---

## 9. Common Interview Questions

1. **Does `await` block the main thread?**
   No. It suspends only the `async` function it's in. The JS engine's call stack and event loop keep processing other work.

2. **What does an `async` function return if you don't explicitly return a Promise?**
   It's automatically wrapped: `return "hi"` becomes `return Promise.resolve("hi")`.

3. **What happens if you `await` a non-Promise value (e.g., `await 5`)?**
   JS wraps it as `Promise.resolve(5)` and resolves immediately on the next microtask tick — no error.

4. **Can you use `await` at the top level (outside an async function)?**
   Only inside ES modules (top-level `await`), not in regular scripts or non-async functions.

5. **How do you run multiple awaits in parallel instead of sequentially?**
   Use `Promise.all([p1, p2])` and await that, instead of awaiting each one in sequence — this avoids unnecessarily adding up wait times.
   ```js
   const [val1, val2] = await Promise.all([p1, p2]);
   ```

6. **What's the difference between `Promise.all`, `Promise.race`, `Promise.allSettled`, and `Promise.any`?**
   - `all`: waits for all to resolve, rejects fast if any one rejects.
   - `race`: settles as soon as the first Promise settles (resolve or reject).
   - `allSettled`: waits for all, never short-circuits, gives status of each.
   - `any`: resolves as soon as any one resolves; rejects only if all reject.

7. **Why does `console.log` after a `setTimeout(fn, 0)` still run before the timeout callback?**
   Because `setTimeout` callbacks go to the macrotask queue, and synchronous code + microtasks (Promises) always run first.

8. **Is `async/await` slower than `.then()` chains?**
   No meaningful performance difference — same underlying Promise + microtask mechanism. The difference is purely syntactic/readability.

9. **What happens if an error is thrown inside an `async` function and not caught?**
   The function's returned Promise becomes rejected with that error — it doesn't throw synchronously to the caller, so an uncaught rejection can result if nothing handles it (`.catch()` or `try/catch` around the call).
   