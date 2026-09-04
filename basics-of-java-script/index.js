
getName();  // Namaste Javascript
// arrowGetName();  // Not a function - ERROR
console.log(x); // undefined
console.log(getName); // function
console.log(arrowGetName);

var x= 7;

// behave like function
function getName() {
    console.log("Namaste Javascript");
}

//behave like variable
var arrowGetName = () => {
    console.log("Arrow Namaste Javascript");
}

//behave like variable
var getName1 = function () {
    console.log("Arrow Namaste Javascript");
}


getName();  // Namaste Javascript
arrowGetName();  // Arrow Namaste Javascript
console.log(x); // 7
console.log(getName); // function
console.log(arrowGetName); // function


// How JS Function Works

var x =1;
a(); // 10
b(); // 1
c(); // 100
console.log(x); // 1


function a() {
    var x =10;
    console.log(x);
}

function b() {
    console.log(x);
}

function c() {
    var x =100;
    console.log(x);
}

// Scope Chain, Scop & Lexical Environment

function d() {
    var c = 30;
    console.log(b); // 10
    console.log(c); // 30
    function e() {
        console.log(b); // 10
        console.log(c); // 30
    }
    e();
}

var b =10;
d()
// console.log(c); Not defined


var j =10;
let k = 20;
const l =30;
{
    // Compound Statement
    var m = 40;
    var j = 50;
    let k = 60;
    const l = 70;
    let n = 80;
    console.log(j);  // 50
    console.log(k);  // 60
    console.log(l);  // 70
    console.log(m);  // 40
    console.log(n);  // 80
}

console.log(j);  // 50
console.log(k);  // 20
console.log(l);  // 30
console.log(m);  // 40
// console.log(n);  // referance Error
