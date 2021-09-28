import { ReadableStream } from "node:stream/web";
import net from "net";

export function listen({ port }) {
	const stream = new ReadableStream({
		start(controller) {
			const server = net.createServer(socket => {
				controller.enqueue(socket)
			});
			server.listen(port)
		}
	});
	return stream;
}