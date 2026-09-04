let arr = ["Akshay", "Rohit", "Saurabh", "Ramesh", "Suresh", "Rakesh", "Amit", "Ankit", "Anil", "Anup"];
let object = {
    "name": "Akshay",
    "age": 25,
    "city": "Pune",
    getIntroduction: function() {
        console.log(`My name is ${this.name}, I am ${this.age} years old and I live in ${this.city}`);
    }
}

