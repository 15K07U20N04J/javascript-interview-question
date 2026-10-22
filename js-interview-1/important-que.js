// Q1.

// console.log("Value of Age is", age); // undefined => Why Not error : Hoisting
// var age = 20;
// console.log("Value of Age is", age); // 20

// Global Execution Context
// 1> Memory Phase
// var age : undefined
// 2> code Phase
// Change the value of age


// Q2.

age = 100;
console.log("Value of Age is", age); // 100
var age = 30;
console.log("Value of Age is", age); // 30

age = 100;
console.log("Value of Age is", age); // ReferenceError(TDZ)
let age = 30;


// Q3.
myFun()  // Second
var myFun = function() {
    console.log("First");
}
myFun()  // First
function myFun() {
    console.log("Second");
}
myFun()  // First


// Q4.
var variable = 10;
(() => {
    console.log(variable); // 10
    variable = 20;
    console.log(variable); // 20
})();
console.log(variable); // 20
var variable = 30;
console.log(variable); // 30


// Q5.
foo =30;
console.log("FOO : ", foo); // 30
var foo = 100;
console.log("FOO : ", foo); // 100;


// Q6.
variable = 10;
(() => {
    foo = 100;
    console.log("Variable : ", variable);  // 10
    var foo = 100;
    variable = 20;
    console.log("Variable : ", variable);  // 20
})();
console.log("FOO : ", foo);  // ReferenceError: foo is not defined
console.log("Variable : ", variable);
var variable = 30;

/*
MEMORY / EXECUTION CONTEXT
══════════════════════════════════════════════════════════════════════

GLOBAL EXECUTION CONTEXT (GEC)
┌──────────────────────────────┬─────────────────────────────────────┐
│          MEMORY              │               CODE                  │
├──────────────────────────────┼─────────────────────────────────────┤
│ variable : undefined         │ variable = 10;                      │
│ foo      : not defined       │                                     │
├──────────────────────────────┼─────────────────────────────────────┤
│ variable : 10                │ (() => {                            │
│                              │     foo = 100;                      │
│                              │     console.log(variable); // 10    │
│                              │     var foo = 100;                  │
│                              │     variable = 20;                  │
│                              │     console.log(variable); // 20    │
│                              │ })();                               │
├──────────────────────────────┼─────────────────────────────────────┤
│ variable : 20                │ console.log("FOO : ", foo);         │
│                              │ // ReferenceError                   │
│                              │ console.log("Variable : ",variable);│
│                              │ var variable = 30;                  │
└──────────────────────────────┴─────────────────────────────────────┘


FUNCTION EXECUTION CONTEXT (FEC) — INSIDE IIFE
┌──────────────────────────────┬─────────────────────────────────────┐
│          MEMORY              │               CODE                  │
├──────────────────────────────┼─────────────────────────────────────┤
│ foo : undefined              │ foo = 100;                          │
│                              │ console.log(variable); // 10        │
│                              │ var foo = 100;                      │
│                              │ variable = 20;                      │
│                              │ console.log(variable); // 20        │
└──────────────────────────────┴─────────────────────────────────────┘

IMPORTANT:
1. Global `var variable` is hoisted and initialized to undefined.
2. `variable = 10` assigns 10 to the global variable.
3. Inside the IIFE, `var foo` is hoisted and initialized to undefined.
4. `foo = 100` updates the LOCAL `foo` variable because of hoisting.
5. `variable` is not local to the IIFE, so JavaScript accesses the global variable.
6. `variable = 20` changes the global variable to 20.
7. Outside the IIFE, `foo` is inaccessible, causing ReferenceError.
8. Because execution stops at the uncaught ReferenceError, the final
   console.log and `variable = 30` are never executed.

══════════════════════════════════════════════════════════════════════
*/


// Q7.

for(var i =0; i < 10; i++) {
    setTimeout(() => console.log(i), 0);  // 10 10 10 10 10 10 10 10 10 10
}

for(let i =0; i < 10; i++) {
    setTimeout(() => console.log(i), 0);  // 0 1 2 3 4 5 6 7 8 9
}


// Q8.

var fullName = "Piyush Garg";
var obj = {
    fullName: "Hacked Full Name",

    prop: {
        fullName: "Inside Prop",
        getFullName: function () {
            return this.fullName;  // Insode Prop
        },
    },

    getFullName: function() {
        return this.fullName;  // Hacked Full Name"
    },

    getFullNameV2: () => this.fullName, // undefined arraow function point to global context

    getFullNameV3 : (function() {
        return this.fullName;  // undefined
    })(),
}

console.log(obj.prop.getFullName());
console.log(obj.getFullName());
console.log(obj.getFullNameV2());
console.log(obj.getFullNameV3);


// Q9.

const piyush = {
    name: "Piyush Garg",
    sayName: function () {
        console.log(this.name);
    }
}

const jhon = {
    name: "Jhon Dow",
    sayName: function () {
        console.log(this.name);
    }
}

function sayMyName() {
    console.log(this.name);
}

sayMyName() // undefined
sayMyName.call(jhon); // Jhon Dow
jhon.sayName.call(piyush); // Piyush Garg
const newFn = jhon.sayName.bind(piyush);
newFn()  // Piyush Garg

// Q10.

const piyush = {
    name: "Piyush Garg",
    sayName: function () {
        console.log(this.name);
    }
}

setTimeout(piyush.sayName, 3 * 1000); // undefined
setTimeout(() => piyush.sayName(), 3 * 1000); // Piyush Garg
setTimeout(piyush.sayName.bind(piyush), 3 * 1000); // Piyush Garg


// Q11.

const obj = {
    height: 30,
}

console.log(obj.height);  // 30

delete obj.height;

console.log(obj.height);  // undefined


const obj = Object.create({
    height: 30,
})

console.log(obj.height);  // 30

delete obj.height;

console.log(obj.height);  // 30
