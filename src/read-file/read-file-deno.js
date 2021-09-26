import "../deno.js";

const data = await Deno.readTextFile("../data/hello.txt");
console.log(data);