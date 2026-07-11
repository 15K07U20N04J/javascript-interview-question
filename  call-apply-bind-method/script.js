name1 = {
    firstName: "John",
    lastName: "Doe"
}

let printFullName = function(hometown, state) {
    console.log(this.firstName + " " + this.lastName, + " from " + hometown + ", " + state);
}

name2 = {
    firstName: "Donald",
    lastName: "Trump"
}

// call method is used to invoke a function with a specified this value and arguments provided individually.
printFullName.call(name1, "New York", "NY"); // Output: John Doe
printFullName.call(name2, "Washington", "DC"); // Output: Donald Trump

// apply method is similar to call, but it takes an array of arguments instead of a list of arguments.
printFullName.apply(name1, ["New York", "NY"]); // Output: John Doe
printFullName.apply(name2, ["Washington", "DC"]); // Output: Donald Trump

// bind method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
let printFullNameBind = printFullName.bind(name1, "New York", "NY");
console.log(printFullNameBind);
printFullNameBind(); // Output: John Doe from New York, NY

let printFullNameBind2 = printFullName.bind(name2, "Washington", "DC");
console.log(printFullNameBind2);
printFullNameBind2();
