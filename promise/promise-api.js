const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise 1 resolved");
    }, 3000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve("Promise 2 resolved");
        reject("Promise 2 rejected");
    }, 1000);
});

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise 3 resolved");
    }, 2000);
});

Promise.all([p1, p2, p3]).then((values) => {
    console.log(values);
}).catch((err) => {
    console.log("Error", err);
});

Promise.allSettled([p1, p2, p3]).then((values) => {
    console.log(values);
}).catch((err) => {
    console.log("Error", err);
});

Promise.race([p1, p2, p3]).then((values) => {
    console.log(values);
}).catch((err) => {
    console.log("Error", err);
});

Promise.any([p1, p2, p3]).then((values) => {
    console.log(values);
}).catch((err) => {
    console.log("Error", err);
    console.log(err.errors);
});
