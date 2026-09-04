// Higher Order Function => A function which takes another function as an argument or returns a function is called Higher Order Function.

function higherOrderFunction(callback) {
    console.log("Higher Order Function is called");
    callback();
}

function callbackFunction() {
    console.log("Callback Function is called");
}

higherOrderFunction(callbackFunction);

const radius = [1, 2, 3, 4];

// const calculateArea = function (radius) {
//     const output = radius.map(function (radius) {
//         return Math.PI * radius * radius;
//     });
//     return output;
// }

// const calculateCircumference = function (radius) {
//     const output = radius.map(function (radius) {
//         return 2 * Math.PI * radius;
//     });
//     return output;
// }

// const calculateDiameter = function (radius) {
//     const output = radius.map(function (radius) {
//         return 2 * radius;
//     });
//     return output;
// }

// console.log(calculateArea(radius));
// console.log(calculateCircumference(radius));
// console.log(calculateDiameter(radius));

const area = function (radius) {
    return Math.PI * radius * radius;
}

const circumference = function (radius) {
    return 2 * Math.PI * radius;
}

const diameter = function (radius) {
    return 2 * radius;
}

// const calculateForCircle = function (radius, logic) {
//     const output = radius.map(function (radius) {
//         return logic(radius);
//     });
//     return output;
// }

Array.prototype.calculateForCircle = function (logic) {
    const output = this.map(function (radius) {
        return logic(radius);
    });
    return output;
}

// console.log(calculateForCircle(radius, area));
// console.log(calculateForCircle(radius, circumference));
// console.log(calculateForCircle(radius, diameter));

console.log(radius.calculateForCircle(area));
console.log(radius.calculateForCircle(circumference));
console.log(radius.calculateForCircle(diameter  ));

console.log(radius.map(area));
console.log(radius.map(circumference));
console.log(radius.map(diameter));
