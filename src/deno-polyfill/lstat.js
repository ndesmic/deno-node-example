import fs from "fs/promises";

export function lstat(path){
	return fs.lstat(path);
}