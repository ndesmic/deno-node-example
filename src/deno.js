import fs from "fs/promises";
import { ReadableStream } from "node:stream/web";
import net from "net";

function readTextFile(path){
	return fs.readFile(path, "utf-8");
}

function listen({ port }){
	const stream = new ReadableStream({
		start(controller){
			const server = net.createServer(socket => {
				controller.enqueue(socket)
			});
			server.listen(port)
		}
	});
	return stream;
}

function responseToHttp(response){
	if(!response.options.headers["Content-Length"]){
		response.options.headers["Content-Length"] = response.body.length;
	}

	return `HTTP/1.1 ${response.options.status} ${response.options.statusText ?? "OK"}
${Object.entries(response.options.headers).map(([name, value]) => `${name}: ${value}`).join("\n")}

${response.body}`;
}

function serveHttp(socket){
	const stream = new ReadableStream({
		start(controller){
			socket.on("data", data => {
				controller.enqueue({
					respondWith: (response) => {
						socket.write(responseToHttp(response));
					}
				});
			});

			socket.on("close", () => {
				controller.close()
			});

		}
	});

	return stream;
}

const env = {
	get: name => process.env[name]
};

globalThis.Deno = {
	env,
	listen,
	readTextFile,
	serveHttp
};

class Response {
	body;
	options;
	constructor(body, options){
		this.body = body;
		this.options = options;
	}
}

globalThis.Response = Response;