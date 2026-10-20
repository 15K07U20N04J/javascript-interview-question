# JavaScript Intermediate – Q&A Notes (Part 2)

Common JavaScript interview questions with simple explanations, corrected code examples, and a real-life analogy for each concept.

## Table of Contents

1. [map() method](#q1-what-is-the-purpose-of-the-map-method)
2. [Event bubbling & capturing](#q2-what-is-event-bubbling--capturing)
3. [Higher-order functions](#q3-what-are-higher-order-functions)
4. [IIFE](#q4-what-is-an-iife-immediately-invoked-function-expression)
5. [Closures](#q5-what-do-you-understand-by-closures)
6. [setTimeout & setInterval](#q6-how-do-settimeout-and-setinterval-work)
7. [Promises](#q7-explain-the-concept-of-promises)
8. [async & await](#q8-what-is-the-use-of-async-and-await)
9. [call, apply & bind](#q9-difference-between-call-apply-and-bind)
10. [Event delegation](#q10-what-is-event-delegation)

---

## Q1. What is the purpose of the `map()` method?

`map()` creates a **new array** by applying a function to every element of an existing array. The original array is **not changed**.

```js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2);

console.log(numbers); // [1, 2, 3, 4, 5]  (unchanged)
console.log(doubled); // [2, 4, 6, 8, 10]
```

> **Analogy:** Think of an assembly line in a factory. Every item on the belt goes through the same machine (for example, a painter), and a new painted item comes out. The original items stay in the warehouse untouched.

---

## Q2. What is Event Bubbling & Capturing?

When you click an element, the event travels through the DOM in three phases:

1. **Capturing phase** – from the outermost element (`document`) **down** to the target
2. **Target phase** – the element that was actually clicked
3. **Bubbling phase** – from the target **back up** to the outermost element

- **Event Bubbling:** events are handled from the **innermost** element to the **outermost** (this is the default).
- **Event Capturing:** events are handled from the **outermost** element to the **innermost**.

The third argument of `addEventListener` decides the phase: `false` (default) = bubbling, `true` = capturing.

```html
<div id="grandparent">
  <div id="parent">
    <div id="child">Click me</div>
  </div>
</div>
```

### Bubbling (`false`)

```js
document.querySelector('#grandparent').addEventListener('click', () => {
  console.log('Grandparent Clicked');
}, false);

document.querySelector('#parent').addEventListener('click', (e) => {
  console.log('Parent Clicked');
  e.stopPropagation(); // stops the event from going further up
}, false);

document.querySelector('#child').addEventListener('click', () => {
  console.log('Child Clicked');
}, false);

// Click on child:
// Child Clicked
// Parent Clicked
// (Grandparent never runs because of stopPropagation)
```

### Capturing (`true`)

```js
document.querySelector('#grandparent').addEventListener('click', () => {
  console.log('Grandparent Clicked');
}, true);

document.querySelector('#parent').addEventListener('click', (e) => {
  console.log('Parent Clicked');
  e.stopPropagation(); // stops the event from going further down
}, true);

document.querySelector('#child').addEventListener('click', () => {
  console.log('Child Clicked');
}, true);

// Click on child:
// Grandparent Clicked
// Parent Clicked
// (Child never runs because of stopPropagation)
```

> **Analogy:** Imagine a company hierarchy: Employee → Manager → Director.
> - **Bubbling** is an employee reporting a problem: it goes to the manager, then the director (bottom to top).
> - **Capturing** is the director sending an order: it goes to the manager, then the employee (top to bottom).
> - **`stopPropagation()`** is a manager who decides not to pass the message on.

---

## Q3. What are Higher-Order Functions?

A higher-order function is a function that **takes another function as an argument**, **returns a function**, or both. Examples: `map`, `filter`, `reduce`, `forEach`, `setTimeout`.

```js
const numbers = [1, 2, 3, 4, 5];

// Takes a function as an argument
const doubled = numbers.map(function (num) {
  return num * 2;
});

// Returns a function
function multiplier(factor) {
  return (num) => num * factor;
}
const triple = multiplier(3);
console.log(triple(5)); // 15
```

> **Analogy:** A coffee machine that accepts different "recipe cards". You hand it the recipe (a function) and it does the work. A higher-order function is the machine; the recipe is the function you pass in. A function that returns a function is like a factory that builds custom tools on demand.

---

## Q4. What is an IIFE (Immediately Invoked Function Expression)?

An IIFE is a function that is **defined and executed immediately**. It is mainly used to create a private scope and avoid polluting the global scope.

```js
// Regular function: define first, call later
function greet() {
  return "Hello";
}
greet();      // <-- semicolon is important!

// IIFE: defined and executed at once
(function () {
  console.log("Hello from IIFE");
})();

// Arrow function version
(() => {
  console.log("Hello from arrow IIFE");
})();
```

> **Analogy:** A self-destructing message or a pop-up tent. You set it up, use it right away, and everything inside stays inside. Nothing is left behind in the global scope.

---

## Q5. What do you understand by closures?

A closure is a function that **remembers the variables from the scope where it was created**, even after the outer function has finished running.

```js
function outerFunction() {
  let outerVar = "This is from outside!";

  function innerFunction() {
    console.log(outerVar);
  }
  return innerFunction;
}

const closureFunction = outerFunction();
closureFunction(); // "This is from outside!"
```

### Practical example: private counter

```js
function counter() {
  let count = 0; // private, cannot be accessed directly from outside

  return {
    increment() { count += 1; },
    decrement() { count -= 1; },
    displayCount() { console.log(`Current Count is ${count}`); },
  };
}

const closureCounter = counter();
closureCounter.increment();
closureCounter.increment();
closureCounter.decrement();
closureCounter.displayCount(); // Current Count is 1
```

> **Analogy:** A backpack. When a function is created, it packs a backpack with every variable it can see around it. Even when it travels far away from where it was born, it still carries that backpack. The counter example is like a piggy bank: you can only use the "deposit" and "withdraw" buttons, and nobody can reach in and touch the money directly.

---

## Q6. How do `setTimeout` and `setInterval` work?

Both schedule tasks to run later. They are provided by the environment (browser Web APIs, and also Node.js) and work together with the event loop.

- **`setTimeout(fn, delay)`** runs a function **once** after the delay.
- **`setInterval(fn, delay)`** runs a function **repeatedly** every `delay` milliseconds.
- **`clearTimeout` / `clearInterval`** cancel them.

The delay is a **minimum** time, not a guarantee. If the call stack is busy, the function runs later.

```js
setTimeout(() => {
  console.log("Runs once after 2 seconds");
}, 2000);

const timerId = setInterval(() => {
  console.log("Runs every 2 seconds");
}, 2000);

setTimeout(() => {
  clearInterval(timerId); // stop the interval after 5 seconds
}, 5000);

// Output: "Runs every 2 seconds" at 2s and 4s, then stopped at 5s
```

> **Analogy:** `setTimeout` is a one-time alarm: "wake me up in 2 hours". `setInterval` is a repeating alarm that rings every day until you press stop (`clearInterval`).

---

## Q7. Explain the concept of Promises

A Promise represents the **eventual result of an asynchronous task**. It is more readable than nested callbacks ("callback hell"). A promise has three states:

| State       | Meaning                              |
| ----------- | ------------------------------------ |
| `pending`   | Still working, no result yet         |
| `fulfilled` | Completed successfully (`resolve`)   |
| `rejected`  | Failed (`reject`)                    |

```js
const data = { name: "john", age: 30 };

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data); // or reject(new Error("Something went wrong"))
    }, 2000);
  });
}

fetchData()
  .then((res) => {
    console.log(res); // { name: 'john', age: 30 }
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("Done");
  });
```

> **Analogy:** Ordering food at a restaurant and getting a **token/buzzer**. While the kitchen cooks, the promise is *pending*. If the food is ready, the buzzer rings: *fulfilled* (`.then`). If the kitchen runs out of ingredients, you are told: *rejected* (`.catch`). Meanwhile you are free to sit and chat instead of standing at the counter.

---

## Q8. What is the use of `async` and `await`?

- **`async`**: marks a function so that it **always returns a Promise**.
- **`await`**: pauses the execution **inside the async function** until the promise settles, then returns the resolved value. It only works inside `async` functions (or at the top level of modules).

They let you write asynchronous code that looks like normal, step-by-step code.

```js
async function fetchUser() {
  try {
    const response = await fetch("https://api.github.com/users/octocat");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`); // fetch does not reject on 404/500
    }

    const data = await response.json(); // json() also returns a Promise!
    console.log("Data:", data);
  } catch (error) {
    console.log("Error:", error);
  }
}

fetchUser();
```

> **Analogy:** Standing at a cafe counter waiting for your coffee. `await` means "I will wait here until my coffee is ready", but the cafe does not stop. Other customers are still being served (the rest of the program keeps running). `async` is the label on the counter that says "this order will give you a coffee later".

---

## Q9. Difference between `call`, `apply` and `bind`

All three let you **set the value of `this`** for a function.

| Method    | Runs immediately? | Arguments                  |
| --------- | ----------------- | -------------------------- |
| `call`    | Yes               | One by one (comma-separated) |
| `apply`   | Yes               | As an **array**            |
| `bind`    | **No**: returns a new function | One by one (preset)  |

```js
function cook(ing1, ing2) {
  console.log(`${this.name} is having a meal with ${ing1} and ${ing2}`);
}

const adam = { name: "Adam" };

cook.call(adam, "Rice", "Beans");      // Adam is having a meal with Rice and Beans
cook.apply(adam, ["Rice", "Beans"]);   // Adam is having a meal with Rice and Beans

const cookForAdam = cook.bind(adam, "Rice", "Beans");
cookForAdam();                          // Adam is having a meal with Rice and Beans
```

> **Memory trick:** **C**all = **C**omma, **A**pply = **A**rray.
>
> **Analogy:** A chef's recipe (the function) can be used by any person.
> - `call` hands the recipe to Adam and says "cook now, here are the ingredients one by one".
> - `apply` says "cook now, here is a bag (array) of ingredients".
> - `bind` programs a robot: "when I press the button later, cook for Adam with rice and beans".

---

## Q10. What is Event Delegation?

Event delegation is a technique where you attach **one event listener to a common parent** instead of one on every child. It works because of **event bubbling**: a click on a child bubbles up to the parent, where `e.target` tells you which child was clicked.

**Benefits:** better performance, works with dynamically added elements, cleaner code.

```html
<ul id="itemList">
  <li>Apple</li>
  <li>Banana</li>
  <li>Mango</li>
</ul>
```

```js
const items = document.getElementById("itemList");

items.addEventListener("click", function (e) {
  const li = e.target.closest("li"); // also works if <li> contains inner tags like <span>
  if (li && items.contains(li)) {
    console.log(`Clicked: ${li.textContent}`);
  }
});

// New items added later also work automatically
const newItem = document.createElement("li");
newItem.textContent = "Orange";
items.appendChild(newItem);
```

> **Analogy:** A building with one **receptionist at the main entrance** instead of a guard at every single room. Everyone who comes in passes the receptionist, who checks where they are going. If a new room is built tomorrow, no new guard is needed.
