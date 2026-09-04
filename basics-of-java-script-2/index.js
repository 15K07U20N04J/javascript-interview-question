// a();  // In Memory Allocatio => a = function
// b();  // In Memory Allocatio => b = undefined -> B is not a function Error
// Function Statement
function a() {
    console.log("A is called");
}
a() // A is called

// Function Expression
var b = function () {
    console.log("B Is called");
}
b() // B is called

// Function Declaration == Function Statement

//Anonymous Function
// function () {

// }

//Named Function Expression
var c = function xyz() {
    console.log("B Is called");
    console.log(xyz);
}
c()
// console.log(xyz);  referance error

// Difference b / w Parameters and Arguments

var d = function(param1) {
    console.log(param1);
}
var argument = "Hello"
d(argument)



// Things learned:
// 1.  What is Function Statement ?
//     A.A normal function that we create using Naming convention. & By this we can do the Hoisting.
//       For Ex - function xyz() {
//                    console.log("Function Statement");
//                }

// 2.  What is Function Expression ?
//     A.When we assign a function into a variable that is Function Expression. & We can not do Hoisting by this becz it acts like variable.
//       For Ex - var a = function () {
//                    console.log("Function Expression");
//                }

// 3.  What is Anonymous Function ?
//     A.A Function without the name is known as Anonymous Function. & It is used in a place where function are treated as value.
//       For Ex - function () {
//                }

// 4.  What is Named Function Expression ?
//     A.A function with a name is known as Named Function Expression.
//       For Ex - var a = function xyx() {
//     console.log("Names Function Expression");
// }

// 5.  Difference b / w Parameters and Arguments ?
//     A.When we creating a function  & put some variabels in this() that is our Parameters.
//        For Ex - function ab(param1, param2) {
//     console.log("
//                       }
//     & When we call this function & pass a variabel in this() that is our Arguments
//        For Ex - ab(4, 5);

// 6.  What is First Class Function Or First class citizens?
// A.The Ability of use function as value,
// * Can be passed as an Argument,
// * Can be executed inside a closured function &
// * Can be taken as return form.
//     For Ex - var b = function (param) {
//     return function xyz() {
//         console.log(" F C F ");
//     }
// }

// 7. Function are heart of JS.They are called first class citizens or first class functions because they have the ability to be stored in the variables, passed as parameters and arguments.They can also be returned in the function.




// *** Callback Functio ***

setTimeout(() => {
    console.log("Timer");
}, 5000);

function x(y) {
    console.log("x");
    y()
}

x(function () {
    console.log("y");
})

// About Event Listener
// document.getElementById("clickme")
//     .addEventListener("click", function () {
//         console.log("Button Clicked");
//     })

// Closure with Event Listener
function attachEventListener() {
    let count =0;
    document.getElementById("clickme")
    .addEventListener("click", function () {
        console.log("Button Clicked", ++count);
    })
}
attachEventListener();


var m=100;
let n =20;

function x() {
    var k=10;
    let z = 50
    console.log(k, m, z);
    // console.log(n)  ReferenceError
}
// console.log(k); ReferenceError
console.log(m, n);

x()
