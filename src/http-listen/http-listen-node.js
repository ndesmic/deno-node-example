import http from "http";

function getEnv(name){
	return globalThis.Deno ? Deno.env.get(name) : process.env[name];
}

const port = getEnv("PORT") ?? "8080";

function requestListener(req, res) {
	res.writeHead(200, "OK", {
		"Content-Type" : "text/plain"
	});
	res.end("Hello from server!");
}

const server = http.createServer(requestListener);
console.log(`Server running on port ${port}`);
server.listen(port);