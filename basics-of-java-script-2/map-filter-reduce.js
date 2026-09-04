const arr =[5, 1, 2, 3, 6];

const users = [
    {firstName: "Harshit", lastName: "Vashisth", age: 26},
    {firstName: "Mohit", lastName: "Kumar", age: 75},
    {firstName: "nitish", lastName: "Chaudhary", age: 50},
    {firstName: "garima", lastName: "Sharma", age: 26},
]

// =========== Map Function =============
// Double
// const output  = arr.map((x) => x * 2);

// Triple
// const output  = arr.map((x) => x * 3);

// Binary
// const output  = arr.map((x) => x.toString(2));

// const output  = users.map((user) => user.firstName + " " + user.lastName);

// console.log(output);


// =========== Filter Function =============

// More than 2
// const output  = arr.filter((x) => x > 2);

// Odd Number
// const output  = arr.filter((x) => x % 2);

// Even Number
// const output  = arr.filter((x) => x % 2 === 0);

// console.log(output);


// =========== Reduce Function =============


// Sum of all numbers
// const output  = arr.reduce((acc, curr) => {
//     acc = acc + curr;
//     return acc;
// }, 0);
// const output  = arr.reduce((acc, curr) => acc + curr, 0);


// Max number
// const output = arr.reduce((max, curr) => {
//     if(curr > max) {
//         max = curr;
//     }
//     return max;
// }, 0);
// const output = arr.reduce((max, curr) => max > curr ? max : curr, 0);

// const output = users.reduce((acc, curr) => {
//     if(acc[curr.age]) {
//         acc[curr.age] = ++acc[curr.age];
//     } else {
//         acc[curr.age] = 1;
//     }
//     return acc;
// },{})

const output = users.reduce((acc, curr) => curr.age > 30  ? [...acc, curr.firstName] : acc, [])

console.log(output);


// =========== Chaining of Map, Filter and Reduce Function =============

// const output = users.filter((user) => user.age > 30).map((user) => user.firstName);
// console.log(output);
