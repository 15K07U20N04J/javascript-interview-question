// Q1. What is the Purpose of the map method in JavaScript.
// => The map() method in JS is used to create new array by applying a specified function to each element in existing array.
const numbers  = [1,2,3,4,5];
const doubleNumber = numbers.map((num) => num*2);
console.log(numbers);
console.log(doubleNumber);


// Q2. What is Event Bubbling & Capturing?
// => Event Bubbling = A Propagation model where are handled from the innermost element to the outermost.
// => Event Capturing = A Propagation model where are handled from the outermost element to the innermost.
// document.querySelector('#grandparent').addEventListener('click', function(e) {
//     console.log('Grandparent Clicked');
// }, false);

// document.querySelector('#parent').addEventListener('click', function(e) {
//     console.log('Parent Clicked');
//     e.stopPropagation();
// }, false);

// document.querySelector('#child').addEventListener('click', function(e) {
//     console.log('Child Clicked');
// }, false);

document.querySelector('#grandparent').addEventListener('click', function(e) {
    console.log('Grandparent Clicked');
}, true);

document.querySelector('#parent').addEventListener('click', function(e) {
    console.log('Parent Clicked');
    e.stopPropagation();
}, true);

document.querySelector('#child').addEventListener('click', function(e) {
    console.log('Child Clicked');
}, true);


// Q3. What are Higher-Order Functions? Can you give examples?
// => Higher Order Functions are functions that can either take other functions as arguments or return a function as a result. example map function
const numbers  = [1,2,3,4,5];
const doubleNumber = numbers.map(function(num) {
    return num*2;
});


// Q4. What is IIFE(Immediately Invoked Function Expression) in JS?
// => An IIFE(Immediately Invoked Function Expression) is a JS Function that is defined and executed immediately after it's created.
// Regular Function
function greet(){
    return "Hello";
}
greet()
// IIFE Function
(function greet(){
    return "Hello";
}());


// Q5. What do you understand by closures in JS?
// => In JS a closures is a function that remembers the environment in which it was created even after the outer function has finished executing
function outerFunction() {
    let outerVar = "This is from outside!"
    function innerFunction() {
        console.log(outerVar);
    }
    return innerFunction
}
const closureFunction = outerFunction();
closureFunction();

function counter() {
    let count = 0;
    return {
        increment : function () {
            count += 1;
        },
        decrement : function () {
            count -= 1;
        },
        displatCount : function () {
            console.log(`Current Count is ${count}`);
        }
    }
}
const closureCounter = counter();
closureCounter.increment(); // 1
closureCounter.increment(); // 2
closureCounter.decrement(); // 1


// Q6. How do setTimeout and setInterval work?
// => in JS, setTimeout and setInterval are functions used to schedule tasks to run after a specified amount of time.
// => They are both part of the web APIs provided by the browser and they allow you to create delays or repeated action in your code.
// => setTimeout() :  Used to execute function once after a specified delay.
// => setInterval() :  Used to execute function repeatedly after a specified intervals.

// setTimeout(() => {
//     console.log("Run after 2 second");
// },2000);

const timerId = setInterval(() => {
    console.log("Run aftre every 2 Second");
})

setTimeout(() => {
    clearInterval(timerId)
},5000);


// Q7. Explain the concept of promises in JS?
// => Promises handle asynchronous tasks in JS by providing a more redable and structured approach rather than callbacks for handling outputs.
// => pending, fulfilled, rejected

data = { name: 'john', age: 30 }
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        },2000)
    })
}

fetchData().then((res) => {
    console.log(data);
})
.catch((err) => {
    console.log(err);
});


// Q8. What is the use of async and await in JS?
// => async : Declaring a function with async makes it return promise
// => await : It pauses the executation of the code until the promise it's waiting for is resolved, then returns the resolved value.

async function fetchData() {
    try {
        const response = await fetch("https://api.github.com/users/15K07U20N04J");
        const data = response.json()
        console.log(`Data : ${data}`);
    } catch (error) {
        console.log(`Error : ${error}`);
    }
}
fetchData();


// Q9. What is the differance between call, apply and bind?
// => Call : Invokes the function immediately, with the set to thisArg, and accepts arguments one by one.
// => Apply : Invokes the function immediately, with the set to thisArg, but takes arguments as an array.
// => Bind : Retuen a  new function with this set to thisArg, and any preset arguments, but does not invoke it immediately.
function cook(ing1, ing2) {
    console.log(`${this.name} is having a meal with ${ing1} and ${ing2}`);
}

const adam = { name: "Adam" };
cook.call(adam, "Rice", "Beans");
cook.apply(adam, ["Rice", "Beans"]);
const cookForAdam = cook.bind(adam, "Rice", "Beans");
cookForAdam();


// Q9. What is Event Delegation?
// => A technique  that allows you to manage events for multiple elements more efficiently by using a single event listener on a common parent element rather than on each individual child element.
// => Improve Performance, Handle Dynamic Elements, Cleaner Code

const items = document.getElementById('itemList')
items.addEventListener("click", function(e) {
    if(e.target.tagName == "LI") {
        console.log(`Clicked : ${e.target.textContent}`);
    }
})
