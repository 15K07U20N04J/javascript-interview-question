console.log("Namaste");

setTimeout(() => {
    console.log("Java Script");
}, 5000);

console.log("Season 2");

const card = ["Shoes", "Shirts", "Pants", "Socks"];

// Example Of Callback Hell
api.createOrder(function () {
    api.procedToPayment(function () {
        api.showOrderSummary(function () {
            api.updateWallet(function () {
                console.log("Payment Done");
            })
        })
    })
})

// Example Of Inversion Of Control
