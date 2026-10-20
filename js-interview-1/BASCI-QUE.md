# JavaScript Fundamentals – Q&A Notes

A short collection of common JavaScript interview questions with simple explanations and code examples.

## Table of Contents

1. [What is JS and where is it used?](#q1-what-is-js-and-where-is-it-commonly-used)
2. [Template literals](#q2-what-are-template-literals-in-js)
3. [Hoisting](#q3-what-is-hoisting-give-an-example)
4. [let vs var vs const](#q4-difference-between-let-var-and-const)
5. [Data types](#q5-what-data-types-are-available-in-js)
6. [Arrays](#q6-what-is-an-array-in-js-and-how-do-you-access-its-elements)
7. [`==` vs `===`](#q7-difference-between--and-)
8. [isNaN()](#q8-what-is-the-purpose-of-the-isnan-function)
9. [null vs undefined](#q9-what-are-null-and-undefined)
10. [typeof operator](#q10-explain-the-use-of-the-typeof-operator)

---

## Q1. What is JS and where is it commonly used?

JavaScript is a high-level programming language used to create interactive effects in web browsers. "High-level" means it is closer to human-readable language than to machine code.

It is commonly used for:

- **Web front-end** – making pages interactive (React, Vue, Angular)
- **Back-end** – servers and APIs using Node.js
- **Mobile and desktop apps** – React Native, Electron

---

## Q2. What are template literals in JS?

Template literals are strings written with backticks (`` ` ``). Introduced in ES6, they allow variables and expressions to be embedded using `${}`, and they support multi-line strings without concatenation.

```js
const a = 10;
const b = 20;

// Old way
console.log("The sum of ", a, " and ", b, " is ", a + b);

// Template literal
console.log(`The sum of ${a} and ${b} is ${a + b}`);

// Multi-line
const text = `Line 1
Line 2`;
```

---

## Q3. What is hoisting? Give an example.

Hoisting is JavaScript's behavior of processing declarations before code runs, so variables and functions can appear to be "moved to the top" of their scope.

### Variable hoisting

```js
console.log(a); // undefined  (var is hoisted and initialized with undefined)
var a = 20;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
console.log(c); // ReferenceError: Cannot access 'c' before initialization
const b = 20;
let c = 30;
```

`let` and `const` are also hoisted, but they stay in the **Temporal Dead Zone (TDZ)** until the line where they are declared.

### Function hoisting

```js
greet();  // "Hello" – function declarations are fully hoisted

function greet() {
  return "Hello";
}

greet2(); // ReferenceError (const is in the TDZ)
const greet2 = () => {
  return "world";
};
```

> Note: if `greet2` were declared with `var`, the error would be `TypeError: greet2 is not a function`, because `var` is hoisted as `undefined`.

---

## Q4. Difference between `let`, `var` and `const`

| Feature          | `var`                | `let`        | `const`      |
| ---------------- | -------------------- | ------------ | ------------ |
| Scope            | Function             | Block        | Block        |
| Re-declare       | Yes                  | No           | No           |
| Re-assign        | Yes                  | Yes          | No           |
| Hoisting         | Yes (as `undefined`) | Yes (TDZ)    | Yes (TDZ)    |

```js
if (true) {
  let a = 10;
  var b = 20;
  const c = 30;
  console.log(a, b, c); // 10 20 30
}

console.log(b); // 20  -> var ignores block scope
console.log(a); // ReferenceError -> let is block scoped
console.log(c); // ReferenceError -> const is block scoped
```

`var` is **function-scoped**: it is visible throughout the function where it is declared (or globally if declared outside any function).

```js
function scope() {
  var a = 10;
  console.log(a); // 10
}
console.log(a); // ReferenceError (a only exists inside scope())
```

---

## Q5. What data types are available in JS?

JavaScript has **8** built-in data types: 7 primitives and Objects.

### 1. Primitive types

Primitives are immutable and compared by value.

- **Number** – integers and decimals (`42`, `3.14`), plus `Infinity`, `-Infinity` and `NaN`
- **String** – text in single quotes, double quotes or backticks
- **Boolean** – `true` or `false`
- **Undefined** – a declared variable that has not been assigned a value
- **Null** – intentional absence of a value (`typeof null` returns `"object"` because of a historical bug)
- **BigInt** – integers larger than `2^53 - 1`, written with an `n` suffix (`9007199254740991n`)
- **Symbol** – a unique, immutable value, often used as an object property key

### 2. Structural type

- **Object** – collections and complex entities: plain objects, arrays, functions, dates, maps, etc. Objects are mutable and compared by reference.

---

## Q6. What is an array in JS, and how do you access its elements?

An array is an ordered collection of values. Elements can be of **any data type, and different types can be mixed** in the same array. Elements are accessed by their index, which starts at `0`.

```js
const arr = [10, "hello", true, null];

console.log(arr[0]);          // 10
console.log(arr[1]);          // "hello"
console.log(arr[arr.length - 1]); // null (last element)
```

---

## Q7. Difference between `==` and `===`

### `==` (loose equality)

Converts the operands to the same type before comparing.

```js
console.log(5 == "5");     // true
console.log(10 == "10");   // true  ("10" -> 10)
console.log(true == 1);    // true  (true -> 1)
console.log(0 == false);   // true  (false -> 0)
```

### `===` (strict equality)

Checks both value **and** type. No conversion is done.

```js
console.log(5 === "5");    // false
console.log(10 === "10");  // false
console.log(true === 1);   // false
console.log(10 === 10);    // true
```

**Best practice:** prefer `===` to avoid surprising type-coercion bugs.

---

## Q8. What is the purpose of the `isNaN()` function?

`isNaN()` checks whether a value is `NaN` (Not-a-Number) **after trying to convert it to a number**. It returns a boolean.

- `true` – the value is `NaN` or converts to `NaN`
- `false` – the value is a number or converts to a valid number

```js
isNaN(NaN);       // true
isNaN("Hello");   // true   (cannot be converted to a number)
isNaN(undefined); // true
isNaN(123);       // false
isNaN("123");     // false  (converted to 123)
isNaN(true);      // false  (converted to 1)
isNaN(null);      // false  (converted to 0)
isNaN([]);        // false  (converted to 0)
```

> Tip: `Number.isNaN()` is stricter. It does **no** type conversion, so `Number.isNaN("Hello")` is `false` and only `Number.isNaN(NaN)` is `true`.

---

## Q9. What are `null` and `undefined`?

Both represent "no value", but they are used differently.

- **`undefined`** – the default state: a variable was declared but not assigned a value yet (also returned for missing properties and functions with no `return`).
- **`null`** – an intentional empty value that you assign yourself, for example when you want to assign a value later or explicitly leave a variable empty.

```js
let x;
console.log(x);              // undefined

let y = null;
console.log(y);              // null

console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (historical bug)
```

---

## Q10. Explain the use of the `typeof` operator

`typeof` returns a **string** describing the data type of a value or variable.

```js
typeof 42;            // "number"
typeof "hello";       // "string"
typeof true;          // "boolean"
typeof undefined;     // "undefined"
typeof Symbol();      // "symbol"
typeof 10n;           // "bigint"
typeof {};            // "object"
typeof [];            // "object"  (use Array.isArray() to check arrays)
typeof null;          // "object"  (known quirk)
typeof function () {}; // "function"
```
