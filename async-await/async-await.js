// always returns a promise
// async function getData() {
//     return "Hello, World!";
// }

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello, World!");
    }, 5000);
});

// function getData() {
//     p.then((res) => console.log(res));
//     console.log("Hello World");
// }

// const dataPromise = getData();

// dataPromise.then(data => {
//     console.log(data); // Output: Hello, World!
// });

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello, World!");
    }, 10000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello, World!");
    }, 3000);
});


// await can be used only inside async functions
async function handlePromise() {
    const val1 = await p;
    console.log("Hello World1");
    console.log(val1);

    // const val2 = await p;
    // console.log("Hello World2");
    // console.log(val2);

    const val3 = await p1;
    console.log("Hello World3");
    console.log(val3);

    const val4 = await p2;
    console.log("Hello World4");
    console.log(val4);
}

// handlePromise();

const API_URL = "https://api.github.com/users/15K07U20N04J";

async function fetchDataGithub() {
    // const response = await fetch(API_URL);
    // const data = await response.json();
    // console.log(data);
    // fetch() => Response.json() => Json Value

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchDataGithub();