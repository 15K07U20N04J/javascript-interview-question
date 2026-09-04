// let multipy = function (x, y) {
//     console.log(x * y);
// }

// let multiplyByTwo = multipy.bind(this, 2);
// multiplyByTwo(5);

// let multiplyByThree = multipy.bind(this, 3);
// multiplyByThree(5);

function multiply(x) {
    return function(y) {
        console.log(x * y);
    }
}

let multiplyByTwo = multiply(2);
multiplyByTwo(5);

let multiplyByThree = multiply(3);
multiplyByThree(5);

let sum = (a) => {
    return function(b) {
        if(b) {
            return sum(a + b);
        } else {
            return a;
        }
    }
}

console.log(sum(2)(3)(4)()); // 9
