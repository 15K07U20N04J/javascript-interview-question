// function x() {
//     var a = 7;
//     function y() {
//         console.log(a);
//     }
//     // y();
//     a = 100;
//     return y;
// }

// var z = x();
// z(); // 100


function z() {
    var b = 900;
    function x() {
        var a = 7;
        function y() {
            console.log(a, b);  // 7 900
        }
        y();
    }
    x();
}

z();


// setTimeout & Closure

// function xy() {
//     var i =1;
//     setTimeout(function () {
//         console.log(i);
//     }, 1000)
//     // i = 100;
//     console.log("SetTimeout & Closures");
// }
// xy();

// function xy() {
//     var k =1;
//     for (var i = 1; i <= 5; i++) {
//         setTimeout(function () {
//             console.log(Date.now(), k);
//             k = k +1;
//         }, i* 1000)
//     }
//     console.log("SetTimeout & Closures");
// }
// xy();


// function xy() {
//     for (let i = 1; i <= 5; i++) {
//         setTimeout(function () {
//             console.log(Date.now(), i);
//         }, i * 1000)
//     }
//     console.log("SetTimeout & Closures");
// }
// xy();


function xy() {
    for (var i = 1; i <= 5; i++) {
        function close(i) {
            setTimeout(function () {
                console.log(Date.now(), i);
            }, i * 1000)
        }
        close(i);
    }
    console.log("SetTimeout & Closures");
}
xy();


// closure Example
// function outer(b) {
//     var s =1000;
//     function inner() {
//         console.log(s, k, m, b);
//     }
//     var k = 123;
//     let m = 456;
//     return inner;
// }

// // var innerFn = outer();
// // innerFn();
// outer("Hello World" )();

function outest() {
    var c= 30;
    function outer (b) {
        function inner() {
            console.log(a,b,c);
        }
        let a= 10;
        return inner;
    }
    return outer;
}
let a = 100;
outest()("Hello World")();

// function counter() {
//     var count =0;
//     return function incrementCounter() {
//         count++;
//         console.log(count);
//     }
// }

// var counter1 = counter();
// counter1();
// counter1();


// var counter2 = counter();
// counter2();
// counter2();

function Counter() {
    var count =0;
    this.incrementCounter = function () {
        count++;
        console.log(count);
    }
    this.decrementCounter = function () {
        count--;
        console.log(count);
    }
}

var counter1 = new Counter();
counter1.incrementCounter();
counter1.incrementCounter();
counter1.incrementCounter();
counter1.decrementCounter()

function a() {
    let x =0; z=10;
    return function () {
        console.log(x);
    }
}

// z is garbase collected
var y = a();
y();

