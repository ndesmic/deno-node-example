import { promises as fs } from "fs";

const data = await fs.readFile("../data/hello.txt", "utf-8");

console.log(data);