import { ReadableStream } from "node:stream/web";

const stream = new ReadableStream({
	start(controller){
		controller.enqueue("A")
	}
});

async function* streamAsyncIterator(stream) {
	// Get a lock on the stream
	const reader = stream.getReader();

	try {
		while (true) {
			// Read from the stream
			const { done, value } = await reader.read();
			// Exit if we're done
			if (done) return;
			// Else yield the chunk
			yield value;
		}
	}
	finally {
		reader.releaseLock();
	}
}

setInterval(() => { console.log("poll")}, 1000);

const itr = streamAsyncIterator(stream);


for await(const item of itr){
	console.log(item);
}

console.log("Done!");
