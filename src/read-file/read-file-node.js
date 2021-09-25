import fs from "fs/promises";

const data = await fs.readFile("../data/hello.txt", "utf-8");

console.log(data);