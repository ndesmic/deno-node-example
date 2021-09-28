import fs from "fs/promises";

export function readTextFile(path) {
	return fs.readFile(path, "utf-8");
}
