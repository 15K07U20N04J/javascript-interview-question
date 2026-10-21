// Q1. Explain the event loop in JS?
// => A technique that allows  you to manage events for multiple more efficiently by using a single event listener on a common parent element rather than on each individual child element.


// Q2. What is the differance between a promise and an async/await function?
// => async/await : inside the functions, you use await to pause executation until tje promise resolves
//                : async/await is a cleaner , more redable way to handle Promises
// => promise : Promises are the building blocks that async/await works on top of, but Promises themselves don't "enclose" async/await.
//            : Promises are the underlying mechanism.

async function fetchData() {
    try {
        result1 = await fetchData1();
        result2 = await fetchDate2(result1);
        console.log("Result : ", result2);
    } catch (error) {
        console.log("Error : ", error);
    }
}
fetchData();


// Q3. Purpose of the reduce method in arrays.
// => The reduce() method in JS is used to reduce an array to a single value by applying a function on each element in the array.
number = [1,2,3,4,5];
const sum = number.reduce((num, acc) => num + acc);
console.log(sum);


// Q4. Explain currying in JavaScript.
// => Currying is a concept in functional programming where a function that takes multiple arguments is transformed into a seqaunce of funcrtions, each accepting a single argument.
// => Currying is used because it makes your code more flexible and reusable.
function multi(a) {
    return function(b) {
        return a*b;
    }
}
const double = multi(2);
console.log(double(3));
console.log(double(4));


// Q5. What is a generator function and its usage?
// => A generator function in JS is a special type of function that can pause its executaion and resume it later.
function* genFunction() {
    let num =0;
    while(true) {
        yield num;
        num++;
    }
}

const seq = genFunction();
console.log(seq.next().value);
console.log(seq.next().value);


// Q6. What are weak maps and weak sets in JavaScript?
// => Weak Maps : A Weakmap is a collection of jey-value pairs where the keys are required to be objects.
// => Weak Sets : A collection of unique object referances that only stores objects and does not allow any primitives.
// => Both WeakMap and WeakSet are non-iterable, have no size property, and are ideal for temporary data storage and memory-efficient management of objects.

let weakMap = new WeakMap();
let obj = { name : "Adam" };
weakMap.set(obj, "Emp");
console.log(weakMap.get(obj));
obj = null;
console.log(weakMap.get(obj));

let weakSet = new WeakSet();
weakSet.add(obj, "Emp");
console.log(weakSet.has(obj));
obj = null;
console.log(weakSet.has(obj));


// Q7. How does JavaScript handle memory management?
// => Stack Memory (Numbers, Strings, Boolean etc)
// => Heap Memory (Objects, Arrays, Function)
// => Garbase Collection (swpper function())


// Q8. Difference between shallow and deep copying.
// => Shallow Copy : in the shallow copy of an object, the main properties are copied, but any nested objects or arrays are still linked to the original.
// => Deep Copy : With a Deep Copy, every part of the object, including all nested objects or arrays, is fully copied, ensuring the modifications to the copy does not affect the original.
const original = {
    name : "john",
    address : {
        city : "delhi"
    }
}

const shallowCopy1 = Object.assign({}, original);
const shallowCopy2 = {...original};
shallowCopy2.address.city = "New City";
console.log(shallowCopy1);
console.log(shallowCopy2);
console.log(original);

const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.address.city = "Mehsana";
console.log(deepCopy);
console.log(original);


// Q9. What is strict mode in JavaScript and how is it enabled?
// => It enforces various rules to make your code cleaner and more secure.

// "use strict";
// 1> undeclared variable
x = 10;  // ReferenceError
console.log(x);

// 2> Read-only Properties
const obj1 = {}
Object.defineProperties(obj1, "prop", { value : 40, writable : false })
obj1.prop = 100; // Can not assign to read only property 'prop' of object

// 3> this as global object
function show() {
    console.log(this); // undefined
}
show();

// 4> Eliminated with
with(Math) { //'with' statements are not allowed in strict mode.
    console.log(sin(90));
}

// 5> Secures eval
eval("var x = 10")
console.log(x); //  ReferenceError

// 6> Duplicates in Function
function sum(a, a, b) { // Duplicates Parameter are not allowed.
    return a + a + b;
}
console.log(sum(a + a + b));


// Q10. Observer pattern and its relation to JavaScript.
// => The Observer Pattern is a design pattern in which an object(called the subject) maintains a list of its dependents (called observers) and notifies them of any changes. typically through a broadcasr mechanisml.
const  button = document.querySelector("button");
function observer1() {
    console.log("Obserber 1 Notified");
}
function observer2() {
    console.log("Obserber 2 Notified");
}

button.addEventListener("click", observer1)
button.addEventListener("click", observer2)
