import { Server, Socket } from "socket.io"
import StorageMessages from "./storage";
interface Message{
	content: string
	author: string
	time?: Date
}

const client = new StorageMessages()


const handlers = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log(socket.id);
		client.getAllMessages()
			.then(keys => {
				const messages: Message[] = []
				keys.map(key =>
					client.getMessage(key)
						.then(value => socket.emit("messageGET", JSON.parse(value)))
				)
			}		
			)
		socket.on("messageSEND", (data: Message) => {
			io.emit("messageGET", data)
			client.setMessage(data)
			console.log(data)
		})
	});
}

export default handlers