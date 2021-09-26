import "../deno.js";

const port = parseInt(Deno.env.get("PORT")) ?? 8080;
const server = Deno.listen({ port });

async function serveHttp(connection) {
	const httpConnection = Deno.serveHttp(connection);
	for await (const requestEvent of httpConnection) {
		requestEvent.respondWith(
			new Response(`Hello from Server!`, {
				status: 200,
				headers: {
					"Content-Type": "text/plain"
				}
			})
		);
	}
}

console.log(`Server running on port ${port}`);

//keep alive
setInterval(() => {}, 1000);

for await (const connection of server) {
	serveHttp(connection);
}

console.log("done");
