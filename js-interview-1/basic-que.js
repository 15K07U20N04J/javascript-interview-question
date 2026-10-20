// Q1. What is JS and Where is it commonly used?
// Js is a high-level programming language. that is used widely to creare inreactive effect within the web browsers. A high-level programming language is human-understadable language. it is commonly used for devloping both web and mobile applicationa.


// Q2. What are template literal in JS?
// ===> $, {}, ``
// Template literals are strings written using backticks (`) that allow variables and expressions to be embedded directly. Introduced in ES6, they make strings more readable and support easy interpolation and multi-line text without complex concatenation.
// const a = 10;
// const b = 20;
// console.log("The sum of ", a, " and ", b, " is", a + b);
// console.log(`The Sum of ${a} and ${b} is ${a + b}`);


// Q3. What is hoisting? Give an example.
// ==> Hoisting is phenomena where variables and function declaration are moved or hoisted to the top of their scopr before their executaion.
// Hoisting is two types:
// 1 > variable hoisting
// console.log(a);  /20
// var a = 20;

// console.log(b, c);  // referance error b and c is not defined
// const b = 20;
// let c = 30;

// 2 > function hoisting

// greet();     // Hello
// greet2();    // greet2 is not function
// function greet() {
//     return "Hello";
// }
// const greet2 = () => {
//     return "world";
// }


// Q4.Explain the Diff between let, var asd const?
// if (true) {
//     let a = 10;
//     var b = 20;
//     const c = 30;
//     console.log(a, b, c); // 10 20 30
// }
// console.log(a);
// console.log(b);  // ReferenceError
// console.log(c);  // ReferenceError

// ReferenceError => let and const have block scope, meaning they are only accessible within the block in which they are declared.while the var have function scope, meaning it can be accessed globally,

// function scope() {
//     var a = 10;
//     console.log(a);  // 10
// }
// console.log(a);  // ReferenceError


// Q5. What are data type availables in JS?
// JavaScript has 8 built-in data types, which are divided into two main categories: Primitive values (immutable and stored directly) and Objects (mutable and stored by reference).
// Here is the quick breakdown of all data types in JavaScript:

// 1. Primitive Data Types

// Primitive values are immutable (cannot be changed) and are compared by value.
// • Number: Represents both integer and floating-point numbers (e.g., 42, 3.14). It also includes special values like Infinity, -Infinity, and NaN (Not a Number).
// • String: Represents textual data wrapped in single quotes, double quotes, or backticks (e.g., 'Hello', "World", `Value: \${x}`).
// • Boolean: Represents a logical entity and can have only two values: true and false.
// • Undefined: A variable that has been declared but has not yet been assigned a value automatically gets the value undefined.
// • Null: Represents the intentional absence of any object value. (Note: typeof null returns "object" due to a historical bug in JavaScript).
// • BigInt: Used to store whole numbers larger than the safe integer limit for Number (greater than 2⁵³ - 1). Created by appending n to an integer (e.g., 9007199254740991n).
// • Symbol: A unique and immutable primitive value often used as private keys for object properties.

// 2. Structural Data Type (Objects)

// • Object: Used to store collections of data and more complex entities. Regular objects, Arrays, Functions, Dates, and Maps all fall under the Object type. They are mutable and compared by reference.


// Q6. What is an array in JS, and how to access its elements?
// An array in JS is ordered collection of valuesor element. the element stored in array can be  of any data types, but they all must belong to same data type. array element is accessed by their index.

// Q7. Difference between == and ===.
// console.log(5  == '5');     // true
// console.log(5  === ' 5');   // false

// How == (Loose Equality) Works

// The loose equality operator uses the Abstract Equality Comparison Algorithm. If the data types are different, JavaScript forces one or both values into a matching type behind the scenes.
// javascript
// console.log(10 == "10"); // true (string "10" is converted to number 10)
// console.log(true == 1);   // true (boolean true is converted to number 1)
// console.log(0 == false);  // true (boolean false is converted to number 0)
// Use code with caution.

// How === (Strict Equality) Works

// The strict equality operator checks for both value and type matching. If the types do not match, it immediately returns false without trying to convert them.
// javascript
// console.log(10 === "10"); // false (types 'number' and 'string' are different)
// console.log(true === 1);   // false (types 'boolean' and 'number' are different)
// console.log(10 === 10);    // true (both type)


// Q8. What is the Purpose of the isNaN function.
// The purpose of the isNaN() function is to determine whether a value is NaN (Not-a-Number) or cannot be successfully converted into a valid number.

// How it Works

// The function returns a boolean value:
// • true: If the value is NaN or converts to NaN (e.g., text strings, undefined).
// • false: If the value is a valid number or can be converted into one (e.g., numeric strings, booleans, empty arrays).

// Key Examples

// • isNaN(NaN); // true
// • isNaN("Hello"); // true (cannot be converted to a number)
// • isNaN(123); // false (is a valid number)
// • isNaN("123"); // false (can be successfully converted to the number 123)
// • isNaN(true); // false (converts to 1)
// • isNaN(null); // false (converts to 0)


// Q9.  what is null and undefined?
// null and undefined both indicate the absence of value. On one hand, undefined is used when a variable is declared but has bot been assigned a value yet. it's more of a default state. Null on the other hand is the intentional absence of any value. it is when you do not want to assign any value to a variable. because either you might assign it lateror you just want to leave it empty.


// Q10. Explain the use of typeof operator?
// It determine the data type of a given value or variable and a returns string
