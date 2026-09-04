let counter = 0;
const expensiveFunction = () => {
    console.log("Fetching Data ", counter++);
}

const throttle = (fn, d) => {
    let flag = true;
    return function() {
        let context = this;
        let args = arguments;
        if(flag) {
            fn.apply(context, args);
            flag = false;
            setTimeout(() => {
                flag = true;
            }, d);
        }
    }
}

const betterExpensiveFunction = throttle(expensiveFunction, 1000);

window.addEventListener("resize",betterExpensiveFunction);

// window.addEventListener("resize", expensiveFunction);
