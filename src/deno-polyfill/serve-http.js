import { ReadableStream } from "node:stream/web";

function responseToHttp(response) {
	if (!response.headers.get("Content-Length")) {
		response.headers.set("Content-Length", response.body.length);
	}

	return `HTTP/1.1 ${response.status} ${response.statusText ?? "OK"}
${[...response.headers.entries()].map(([name, value]) => `${name}: ${value}`).join("\n")}

${response.body}`;
}

function httpToRequest(http){
	const lines = http.toString().split("\n");
	const [method, url] = lines[0].split(" ").map(x => x.trim());
	const headers = {};
	let i = 1;
	while(lines[i].trim() !== ""){
		const [key, value] = lines[i].split(":", 2);
		headers[key.trim()] = value.trim();
		i++;
	}

	const requestUrl = new URL(url, "http://" + headers["Host"]).href;

	return new Request(requestUrl, {
		method,
		headers
	});
}

function requestEventFromData(data, socket){
	return {
		request: httpToRequest(data),
		respondWith: response => {
			socket.write(responseToHttp(response))
		}
	}
}

export function serveHttp(socket) {
	const stream = new ReadableStream({
		start(controller) {
			socket.on("data", data => {
				controller.enqueue(requestEventFromData(data, socket));
			});

			socket.on("close", () => {
				controller.close()
			});

		}
	});

	return stream;
}

class Response {
	body;
	options;
	constructor(body, options) {
		this.body = body;
		this.options = options;
	}
}

globalThis.Response = Response;