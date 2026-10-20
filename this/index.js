"use strict";

// this in global space

var globalVar = "I am a global variable";
console.log(this);  // global object in browsers, or module.exports in Node.js


// this inside a function

function myFunction() {
    var localVar = "I am a local variable";
    console.log(localVar);
    // the value depend on the strict mode, in strict mode it will be undefined, otherwise it will be the global object
    console.log(this);

}

myFunction();

// this in strict mode  - (this substitution)

// If the value of this keyword is undefined or null.
// this will be replace eith globalObject.
// Only in non-strict mode.

// this keyword value depends on how this is called

window.myFunction();  // this will refer to the window object in browsers.

// this keyword inside a object's method

var myObject = {
    name: "My Object",
    myMethod: function() {
        console.log(this);  // this will refer to myObject
    }
};

myObject.myMethod();

// call, apply and bind methods

const student = {
    name: "John",
    greet: function() {
        console.log(this);  // this will refer to student
        console.log(`Hello, my name is ${this.name}`);
    }
}

const student2 ={
    name: "Jane"
}

student.greet.call(student2);  // Hello, my name is Jane


// this keyword inside a arrow function

const obj = {
    name: "My Object",
    myMethod: () => {
        console.log("Arrow Function", this);
    }
}

const obj1 = {
    name: "My Object",
    myMethod: function () {
        const y = () => {
            console.log(this);
        }
        y();
    }
}

obj.myMethod()
obj1.myMethod()

// this keyword inside DOM elements