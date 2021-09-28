import { Response, Request, default as fetch } from "node-fetch";

import { build } from "./deno-polyfill/build.js";
import { listen } from "./deno-polyfill/listen.js";
import { readTextFile } from "./deno-polyfill/read-text-file.js";
import { lstat } from "./deno-polyfill/lstat.js";
import { env } from "./deno-polyfill/env.js";
import { serveHttp } from "./deno-polyfill/serve-http.js";
import { writeTextFile } from "./deno-polyfill/write-text-file.js";

globalThis.Response = Response;
globalThis.Request = Request;
globalThis.fetch = fetch;

globalThis.Deno = {
	build,
	env,
	listen,
	lstat,
	readTextFile,
	serveHttp,
	writeTextFile
};