const cart = ["Shoes", "Shirts", "Pants", "Socks"]

// const promise = createOrder(cart);  // orderId

// promise.then(function (orderId) {
//     return proceedToPayment(orderId);
// }).then(function (paymentInfo) {
//     return showOrderSummary(paymentInfo);
// }).then(function () {
//     return updateWalletBalance();
// }).catch(function (err) {
//     console.log("Error", err);
// });


// Create Promise in JavaScript
// Producer End
function createOrder(cart) {
    const pr = new Promise(function(resolve, reject) {
        // Logic to create order
        // Validation of cart
        // api call to create order
        // orderId
        if(!validateCart(cart)) {
            const err = new Error("Invalid cart");
            reject(err);
        }
        // logic to create order
        const orderId = "12345";
        if(orderId) {
            setTimeout(() => {
                resolve(orderId);
            }, 5000);
        } else {
            const err = new Error("Order creation failed");
            reject(err);
        }
    })

    return pr;
}

function proceedToPayment(orderId) {
    return new Promise(function(resolve, reject) {
        resolve("Payment Info");
    });
}

function validateCart(cart) {
    // Implementation for validating cart
    return true;
}

createOrder(cart)
    .then(function (orderId) {
        console.log(orderId);
        return orderId;
    })
    .then(function (orderId) {
        return proceedToPayment(orderId);
    })
    .then(function(paymentInfo) {
        console.log(paymentInfo);
    })
    .catch(function (err) {
        console.log("Error Message : ", err.message);
    });
