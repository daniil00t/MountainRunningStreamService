import { Server, Socket } from "socket.io"
import StorageMessages from "./storage";
interface Message{
	key: string
	content: string
	author: string
	time?: Date
}

const client = new StorageMessages()


const handlers = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log(socket.id);
		client.getAllMessages(value => {
			console.log(value)
			socket.emit("messageGET", value)
		})
		socket.on("messageSEND", (data: Message) => {
			io.emit("messageGET", data)
			client.setMessage(data)
			console.log(data)
		})
	});
}

export default handlers