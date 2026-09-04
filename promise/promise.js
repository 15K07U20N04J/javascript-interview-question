cart = ["Shoes", "Shirts", "Pants", "Socks"]

// function createOrder(cart, function (orderId) {
//     proccedToPayment(orderId, function (paymentInfo) {
//         ShowOrderSummary(paymenrInfo, function () {
//             updateWalletBalance();
//         });
//     };
// });





const promise = createOrder(cart);

promise.then(function (orderId) {
    return proceedToPayment(orderId);
}).then(function (paymentInfo) {
    return showOrderSummary(paymentInfo);
}).then(function () {
    return updateWalletBalance();
}).catch(function (err) {
    console.log("Error", err);
});

const GITHUB_API = "https://api.github.com/users/15K07U20N04J"

const user = fetch(GITHUB_API);

user.then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log("Error", err);
})

// What is Promise in JavaScript?

// A Promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It allows you to write asynchronous code in a more manageable and readable way, avoiding the so-called "callback hell" that can occur when using nested callbacks.

// A Promise can be in one of three states:
// 1. **Pending**: The initial state, neither fulfilled nor rejected.
// 2. **Fulfilled**: The operation completed successfully, and the promise has a resulting value.
// 3. **Rejected**: The operation failed, and the promise has a reason for the failure.

// Promises provide methods like `.then()` for handling fulfilled values and `.catch()` for handling errors, making it easier to chain asynchronous operations together.

// -> It is a placeholder for a certain time period of time. It is used to handle asynchronous operations in JavaScript. It allows you to write asynchronous code in a more synchronous fashion, making it easier to read and maintain.
