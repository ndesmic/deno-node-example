import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import typescript from "typescript";
import { fileURLToPath } from "url";

const isWebUrl = specifier => /^https?:\/\//.test(specifier);

async function findNodeRoot() {
	const thisPath = fileURLToPath(new URL(import.meta.url));
	const thisUrlParts = thisPath.split(path.sep);
	while (thisUrlParts.length > 0) {
		thisUrlParts.pop();
		try {
			await fs.access(path.join(...thisUrlParts, "package.json"));
			break;
		} catch { }
	}
	return path.join(...thisUrlParts);
}

const nodeRoot = await findNodeRoot();

export async function resolve(specifier, context, defaultResolve){
	if(isWebUrl(specifier)){
		return {
			url: specifier
		};
	} else if(context.parentURL && isWebUrl(context.parentURL)){
		return {
			url : new URL(specifier, context.parentURL).href
		};
	}

	return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url, context, defaultGetFormat) {
	if (isWebUrl(url)) {
		return {
			format: 'module'
		};
	}
	
	return defaultGetFormat(url, context, defaultGetFormat);
}

export async function getSource(url, context, defaultGetSource){
	if(isWebUrl(url)){
		const webUrl = new URL(url);
		const filePath = path.join(nodeRoot, "deno_modules", webUrl.protocol.replace(":", ""), webUrl.host, ...webUrl.pathname.split("/"));
		let source;

		try{
			//check cache
			await fs.access(filePath);
			source = await fs.readFile(filePath, "utf-8");
			return {
				source
			};
		} catch {6
			//fetch
			const response = await fetch(url);
			source = await response.text();

			if (url.endsWith(".ts")) { //ts files in deno_modules will always be compiled JS
				source = typescript.transpileModule(source, {
					compilerOptions: {
						module: typescript.ModuleKind.ESNext
					}
				}).outputText;
			}

			//cache module
			await fs.mkdir(path.dirname(filePath), { recursive: true });
			fs.writeFile(filePath, source);

			return {
				source
			};
		}
	}
	return defaultGetSource(url, context, defaultGetSource);
}