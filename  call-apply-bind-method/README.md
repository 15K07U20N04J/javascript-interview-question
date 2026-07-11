# 🚀 JavaScript `call`, `apply`, and `bind` — Complete Guide

A complete guide to understanding **`call`**, **`apply`**, and **`bind`** in JavaScript — what they are, how they differ, and real production use cases.

---

## 📚 Table of Contents

1. [What is `this` in JavaScript?](#-what-is-this-in-javascript)
2. [What are `call`, `apply`, and `bind`?](#-what-are-call-apply-and-bind)
3. [`call()` Method](#-call-method)
4. [`apply()` Method](#-apply-method)
5. [`bind()` Method](#-bind-method)
6. [Key Differences (Comparison Table)](#-key-differences-comparison-table)
7. [Production Use Cases](#-production-use-cases)
8. [Polyfills (How They Work Internally)](#-polyfills-how-they-work-internally)
9. [Best Practices](#-best-practices)
10. [Common Mistakes](#-common-mistakes-to-avoid)
11. [Interview Questions](#-interview-questions)
12. [Cheat Sheet](#-cheat-sheet)
13. [Official Documentation](#-official-documentation)

---

## 🔹 What is `this` in JavaScript?

Before understanding `call`, `apply`, and `bind`, you need to understand `this`.

In JavaScript, `this` refers to the object that is currently **executing** the function — but its value depends on **how a function is called**, not where it's defined.

```js
const person = {
  name: 'Alice',
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  },
};

person.greet(); // "Hi, I'm Alice" — `this` is `person`

const greetFn = person.greet;
greetFn(); // "Hi, I'm undefined" — `this` is lost!
```

This is exactly the problem `call`, `apply`, and `bind` solve — they let you **explicitly control what `this` refers to** inside a function.

---

## 🔹 What are `call`, `apply`, and `bind`?

All three are built-in methods available on **every JavaScript function** (inherited from `Function.prototype`). They let you:

- Explicitly set the value of `this` inside a function
- Borrow methods from one object and use them on another
- Pass arguments in different ways

| Method | Invokes function immediately? | How arguments are passed |
|---|---|---|
| `call()` | ✅ Yes | Comma-separated list |
| `apply()` | ✅ Yes | Array (or array-like) |
| `bind()` | ❌ No (returns a new function) | Comma-separated list |

---

## 🔹 `call()` Method

`call()` invokes a function immediately, letting you set `this` and pass arguments **one by one**.

**Syntax:**
```js
functionName.call(thisArg, arg1, arg2, ...);
```

**Example:**
```js
const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

greet.call(person1, 'Hello', '!'); // "Hello, I'm Alice!"
greet.call(person2, 'Hey', '.');   // "Hey, I'm Bob."
```

### Real Example: Borrowing a Method

```js
const car = {
  brand: 'Toyota',
  getBrand() {
    return this.brand;
  },
};

const bike = { brand: 'Yamaha' };

console.log(car.getBrand.call(bike)); // "Yamaha"
```

---

## 🔹 `apply()` Method

`apply()` works exactly like `call()`, except arguments are passed as an **array** (or array-like object) instead of individually.

**Syntax:**
```js
functionName.apply(thisArg, [arg1, arg2, ...]);
```

**Example:**
```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: 'Alice' };

greet.apply(person1, ['Hello', '!']); // "Hello, I'm Alice!"
```

### Real Example: Finding Max/Min in an Array

```js
const numbers = [5, 6, 2, 3, 7];

// Math.max doesn't accept an array directly, apply() spreads it
const max = Math.max.apply(null, numbers);
console.log(max); // 7

// Modern alternative (spread operator does the same thing today)
const maxModern = Math.max(...numbers);
```

> 💡 `apply()` is most useful when you already have arguments as an **array** — e.g., merging arrays, or forwarding `arguments`.

---

## 🔹 `bind()` Method

`bind()` does **not** call the function immediately. Instead, it returns a **new function** with `this` permanently bound to the given value. You can call that new function anytime later.

**Syntax:**
```js
const boundFn = functionName.bind(thisArg, arg1, arg2, ...);
```

**Example:**
```js
const person = { name: 'Alice' };

function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}

const greetAlice = greet.bind(person);
greetAlice('Hello'); // "Hello, I'm Alice" — runs later, `this` is locked
```

### Real Example: Fixing `this` in Event Handlers / Callbacks

```js
class Button {
  constructor(label) {
    this.label = label;
    // Without bind, `this` inside handleClick would be lost
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(`${this.label} was clicked`);
  }
}

const btn = new Button('Submit');
document.querySelector('#submitBtn').addEventListener('click', btn.handleClick);
// Correctly logs "Submit was clicked" because `this` is bound
```

### Partial Application with `bind()`

`bind()` also lets you **pre-fill arguments** (this is called "partial application").

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2); // pre-fills `a` as 2
console.log(double(5)); // 10
console.log(double(10)); // 20
```

---

## 🔹 Key Differences (Comparison Table)

| Feature | `call()` | `apply()` | `bind()` |
|---|---|---|---|
| Executes immediately | ✅ Yes | ✅ Yes | ❌ No — returns a new function |
| Argument format | Individual args | Array of args | Individual args |
| Return value | Function's result | Function's result | A new bound function |
| Common use | Borrowing methods, calling with specific `this` | Passing array of args, spreading | Event handlers, callbacks, partial application |
| Re-usable | ❌ Runs once | ❌ Runs once | ✅ Can be called many times later |

**Memory trick:**
- **C**all → **C**omma-separated arguments
- **A**pply → **A**rray of arguments
- **B**ind → returns function to call later (doesn't run immediately)

---

## 🔹 Production Use Cases

### 1. Method Borrowing (Reusing Array Methods on Array-like Objects)

`arguments` object and NodeList aren't real arrays, but you can borrow array methods using `call`/`apply`.

```js
function sumAll() {
  // `arguments` is array-like, not a real array
  const argsArray = Array.prototype.slice.call(arguments);
  return argsArray.reduce((sum, num) => sum + num, 0);
}

console.log(sumAll(1, 2, 3, 4)); // 10

// Modern alternative: Array.from(arguments) or rest params (...args)
```

### 2. Fixing `this` in React Class Components

```jsx
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todos: [] };
    // Without this, `this` inside handleDelete would be undefined
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(id) {
    this.setState({
      todos: this.state.todos.filter((todo) => todo.id !== id),
    });
  }

  render() {
    return this.state.todos.map((todo) => (
      <button key={todo.id} onClick={() => this.handleDelete(todo.id)}>
        Delete
      </button>
    ));
  }
}
```

### 3. Function Borrowing Across Constructors (Inheritance-like Pattern)

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Employee(name, age, salary) {
  // Borrow the Person constructor logic
  Person.call(this, name, age);
  this.salary = salary;
}

const emp = new Employee('John', 30, 50000);
console.log(emp); // { name: 'John', age: 30, salary: 50000 }
```

### 4. Throttling / Debouncing Utility Functions

Production-grade utility functions (like in Lodash) commonly use `apply()` to forward arguments while preserving `this`.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

const handleSearch = debounce(function (query) {
  console.log('Searching for:', query);
}, 300);

// input.addEventListener('input', (e) => handleSearch(e.target.value));
```

### 5. Currying / Pre-configuring API Functions

```js
function apiRequest(baseURL, endpoint, method) {
  return fetch(`${baseURL}${endpoint}`, { method });
}

// Pre-configure a function for your specific API base URL
const myApiRequest = apiRequest.bind(null, 'https://api.myapp.com');

myApiRequest('/users', 'GET');
myApiRequest('/orders', 'POST');
```

### 6. Logging/Analytics Wrappers That Preserve Context

```js
const analytics = {
  userId: 'user_123',
  track(event) {
    console.log(`[${this.userId}] Event tracked: ${event}`);
  },
};

// A generic logging utility that calls any tracker function with correct `this`
function logAndTrack(trackerFn, context, event) {
  console.log('Logging before tracking...');
  trackerFn.call(context, event);
}

logAndTrack(analytics.track, analytics, 'button_click');
```

### 7. Using `apply()` to Merge/Push Arrays (Legacy Pattern)

```js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Push all items of arr2 into arr1 without a loop
Array.prototype.push.apply(arr1, arr2);
console.log(arr1); // [1, 2, 3, 4, 5, 6]

// Modern alternative: arr1.push(...arr2);
```

---

## 🔹 Polyfills (How They Work Internally)

Understanding polyfills helps you truly understand how `call`, `apply`, and `bind` work — a very common interview topic.

### Polyfill for `call()`

```js
Function.prototype.myCall = function (context = {}, ...args) {
  context.fn = this; // `this` refers to the function myCall was called on
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

// Usage
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}
greet.myCall({ name: 'Alice' }, 'Hi'); // "Hi, Alice"
```

### Polyfill for `apply()`

```js
Function.prototype.myApply = function (context = {}, args = []) {
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

// Usage
greet.myApply({ name: 'Bob' }, ['Hello']); // "Hello, Bob"
```

### Polyfill for `bind()`

```js
Function.prototype.myBind = function (context = {}, ...args) {
  context.fn = this;
  return function (...newArgs) {
    return context.fn(...args, ...newArgs);
  };
};

// Usage
const boundGreet = greet.myBind({ name: 'Charlie' }, 'Hey');
boundGreet(); // "Hey, Charlie"
```

---

## 🔹 Best Practices

- ✅ Prefer **arrow functions** for lexical `this` binding when possible (avoids needing `bind()` at all)
- ✅ Use `bind()` in constructors for class methods that will be passed as callbacks (e.g., React class components, event listeners)
- ✅ Use the **spread operator** (`...args`) instead of `apply()` for modern code — it's more readable
- ✅ Use `call()`/`apply()` for **one-off** invocations where you need a different `this`
- ✅ Use `bind()` when you need a **reusable** function with fixed `this` and/or pre-filled arguments
- ✅ Avoid overusing `bind()` inside `render()` methods in React — it creates a new function every render, hurting performance; bind once in the constructor instead
- ✅ Use method borrowing sparingly — prefer proper inheritance/composition when designing new code

---

## 🔹 Common Mistakes to Avoid

| ❌ Mistake | ✅ Correct Approach |
|---|---|
| Passing an array to `call()` | Use `apply()` instead, or spread the array: `fn.call(obj, ...argsArray)` |
| Calling `bind()` inside JSX/render on every render | Bind once in the constructor, or use class field arrow functions |
| Forgetting that `bind()` doesn't invoke the function | Remember `bind()` **returns** a new function — you must call it separately |
| Using `call`/`apply`/`bind` with arrow functions | Arrow functions ignore `this` binding entirely — these methods have no effect on them |
| Losing `this` when passing a method as a callback | Use `bind()`, an arrow function wrapper, or class field syntax |
| Assuming `apply()` requires a real array | Array-like objects (e.g., `arguments`) also work fine with `apply()` |

**Example of the arrow function mistake:**
```js
const obj = { name: 'Alice' };
const arrowGreet = () => console.log(this.name);

arrowGreet.call(obj); // undefined — call() has NO effect on arrow functions!
```

---

## 🔹 Interview Questions

**1. What is the difference between `call`, `apply`, and `bind`?**
> `call` and `apply` invoke the function immediately with a specified `this` — `call` takes arguments individually, `apply` takes them as an array. `bind` does not invoke the function immediately; it returns a new function with `this` permanently bound, to be called later.

**2. Why would you use `bind()` instead of `call()`?**
> When you need to preserve `this` for a function that will be executed **later** — such as an event handler, a callback passed to `setTimeout`, or a method passed as a prop — since `call()` executes immediately and doesn't help there.

**3. Do `call`, `apply`, and `bind` work on arrow functions?**
> No. Arrow functions don't have their own `this` — they inherit it lexically from their surrounding scope. So these methods have no effect on `this` when used with arrow functions.

**4. How would you implement your own version of `bind()`?**
> By returning a new function that, when called, invokes the original function with the saved `context` and any combined arguments (see the [Polyfills](#-polyfills-how-they-work-internally) section above).

**5. What's a real-world use case for `apply()`?**
> Passing an array of numbers to `Math.max()`/`Math.min()` (before the spread operator existed), or forwarding an `arguments` object to another function while preserving `this`.

**6. Why do we bind methods in a React class component's constructor?**
> Because when a method is passed as a callback (e.g., to `onClick`), it's called without a receiving object, so `this` inside the method becomes `undefined`. Binding in the constructor ensures `this` always refers to the component instance.

**7. Can you use `bind()` for partial application (currying)?**
> Yes — passing extra arguments to `bind()` beyond `thisArg` pre-fills those parameters permanently in the returned function, which is a common way to create pre-configured/curried functions.

**8. What does `Function.prototype` have to do with `call`, `apply`, and `bind`?**
> All three methods are defined on `Function.prototype`, which means every function in JavaScript inherits them automatically — that's why you can call `.call()`/`.apply()`/`.bind()` on any function.

---

## 🔹 Cheat Sheet

```js
// call: invoke immediately, args listed individually
fn.call(thisArg, arg1, arg2);

// apply: invoke immediately, args as an array
fn.apply(thisArg, [arg1, arg2]);

// bind: returns a new function, does NOT invoke immediately
const boundFn = fn.bind(thisArg, arg1, arg2);
boundFn(); // call it whenever you want

// Method borrowing
otherObject.someMethod.call(myObject);

// Max/min of array (legacy pattern)
Math.max.apply(null, numbersArray);
// Modern equivalent:
Math.max(...numbersArray);

// Partial application
const add = (a, b) => a + b;
const addFive = add.bind(null, 5);
addFive(10); // 15

// React class component pattern
this.handleClick = this.handleClick.bind(this);

// Arrow functions ignore call/apply/bind entirely
const arrowFn = () => this;
arrowFn.call(otherObj); // has no effect
```

---

## 🔹 Official Documentation

- 📘 MDN — `Function.prototype.call()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
- 📘 MDN — `Function.prototype.apply()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
- 📘 MDN — `Function.prototype.bind()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
- 📘 MDN — `this` keyword: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

---

### ⭐ Final Note

`call`, `apply`, and `bind` all exist to solve the same core problem — **controlling what `this` refers to**. In modern codebases, `bind()` is still very common (especially for callbacks and event handlers), while `call()`/`apply()` are used less often now that the spread operator (`...`) covers most of `apply()`'s use cases. Still, understanding all three deeply is essential — they show up constantly in interviews and in real production code (React, utility libraries, polyfills, and framework internals).

Happy coding! 🎉