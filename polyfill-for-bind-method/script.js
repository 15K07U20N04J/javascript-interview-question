name1 = {
    firstName: "John",
    lastName: "Doe"
}

const printFullName = function(HomeTown, State, country) {
    console.log(this.firstName + " " + this.lastName + " from " + HomeTown + ", " + State + " " + country);
}

Function.prototype.myBind = function(...args) {
    let obj = this;
    return function(...args2) {
        obj.apply(args[0], [...args.slice(1), ...args2]);
    }
}

Function.prototype.mycall = function(...args) {
    let obj = this;
    obj.apply(args[0], args.slice(1));
}

Function.prototype.myapply = function(...args) {
    let obj = this;
    obj.call(args[0], ...args[1]);
}

printFullName.call(name1, "New York", "NY", "USA");
let printNameBind = printFullName.bind(name1, "New York", "NY");
printNameBind(country="USA");

let printNameMyBind1 = printFullName.myBind(name1, "New York", "NY");
printNameMyBind1(country="USA");

printFullName.mycall(name1, "New York", "NY", "USA");

printFullName.myapply(name1, ["New York", "NY", "USA"]);

