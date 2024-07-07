function Car(make, model, year)
{
	this.make = make;
	this.model = model;
	this.year = year;
}

let myCar1 = new Car("toyota", "Prius", "2025");
let myCar2 = Object.assign({}, myCar1);

myCar2.year = 2021;

console.log("OG: ", myCar1); 
console.log("Copy: ", myCar2);
