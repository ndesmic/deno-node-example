class NodeResponse {
	#request;
	#status;
	#statusText;
	#headers;
	#body;
	constructor(request){
		this.#request = request;
	}
	writeHead(status, statusText, headers){
		this.#status = status;
		this.#statusText = statusText;
		this.#headers = headers;
	}
	end(body){
		this.#body = body;
		this.#end();
	}
	#end(){
		const response = new Response(this.#body, {
			status: this.#status,
			statusText: this.#statusText,
			headers: this.#headers
		});
		this.#request.respondWith(response);
	}
}

function createServer(requestHandler){
	return {
		listen: async port => {
			const server = Deno.listen({ port: parseInt(port) });
			for await(const connection of server){
				const httpConnection = Deno.serveHttp(connection);
				for await(const requestEvent of httpConnection){
					requestHandler(null, new NodeResponse(requestEvent));
				}
			}
		}
	}
}

export default {
	createServer
}