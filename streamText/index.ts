import express from 'express'
import cors from "cors"
import { Server } from "socket.io"
import handlers from './handlers'
const http = require('http')
import StorageMessages from "./storage"

const app = express()
const server = http.createServer(app)


const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["POST", "GET"]
	}
})


app.use(cors())


app.get('/', (req, res) => {
  res.end("Helo!");
});



handlers(io)


// client.getAllMessages(console.log)


export default server