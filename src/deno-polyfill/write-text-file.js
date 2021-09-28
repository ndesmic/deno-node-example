import fs from "fs/promises";

export function writeTextFile(path) {
	return fs.writeFile(path, "utf-8");
}
