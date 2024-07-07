let objectA = { a: 1 };
let objectB = { b: 2 };
let objectC = { c: 3 };

let a = {a:54, b:651, c:516};

let mergedObject = Object.assign({}, objectA, objectB, objectC, a);

console.log(typeof objectA, "|", typeof a);

console.log(mergedObject);  // Should print { a: 1, b: 2, c: 3 }

console.log(mergedObject.a);