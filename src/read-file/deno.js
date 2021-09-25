import fs from "fs/promises";

function readTextFile(path){
	return fs.readFile(path, "utf-8");
}

globalThis.Deno = {
	readTextFile
};