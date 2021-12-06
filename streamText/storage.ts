// import redis, { createClient } from 'redis';
import * as redis from "redis"

type RadisClient = {
	get: (key: string) => Promise<string>,
	set: (key: string, value: string | Buffer) => Promise<string>,
	keys: (pattern: string) => Promise<string[]>,
	on: (e: string, cb: (er) => void) => void,
	connect: () => Promise<any>,
	disconnect: () => void,
}

export interface Message{
	key: string
	content: string
	author: string
	time?: Date
}

export default class StorageMessages{
	public client: RadisClient
	private reserve_storage: Message[] = []
	private connected: boolean = true


	constructor(){
		this.client = redis.createClient()
		this.client.on('error', (err) =>{
			console.log(err)
			if(err) {
				this.connected = false
			}
		})
		
		try{
			this.client.connect()
			this.connected = true
		}
		catch(e){
			this.connected = false
		}
		
		
		console.log(this.connected)
	}
	setMessage(data: Message){
		const key = '_' + Math. random().toString(36).substr(2, 9)
		if(this.connected)
			this.client.set(key, JSON.stringify(data))
		else
			this.reserve_storage.push({key, ...data})
	}
	getMessage(key: string): Promise<any>{
		if(this.connected)
			return this.client.get(key)
		else
			return new Promise<Message>((resolve, reject) => {
				try{
					resolve(this.reserve_storage.find(message => message.key === key))
				}
				catch(e){ reject(null) }
			})
		
	}

	getAllMessages(sendCallBack: (mess: Message) => void): void{
		if(this.connected){
			this.client.keys("*")
				.then(keys => {
					const messages: Message[] = []
					keys.map(key => {
						this.getMessage(key)
							.then((value: string) => sendCallBack(JSON.parse(value) as Message))
					})
			})
		}
		else this.reserve_storage.map(sendCallBack)
		
	}
}