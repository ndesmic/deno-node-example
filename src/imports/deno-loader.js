import fetch from "node-fetch";
import typescript from "typescript";

const isWebUrl = specifier => /^https?:\/\//.test(specifier);

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
		const response = await fetch(url);
		let source = await response.text();

		if(url.endsWith(".ts")){
			source = typescript.transpileModule(source, {
				compilerOptions: {
					module: typescript.ModuleKind.ESNext
				}
			}).outputText;
		}

		return {
			source
		};
	}
	return defaultGetSource(url, context, defaultGetSource);
}