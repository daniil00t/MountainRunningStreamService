// import redis, { createClient } from 'redis';
import * as redis from "redis"

type RadisClient = {
	get: (key: string) => Promise<string>,
	set: (key: string, value: string | Buffer) => Promise<string>,
	keys: (pattern: string) => Promise<string[]>,
	on: (e: string, cb: (er) => void) => void,
	connect: () => void
}

export interface Message{
	content: string
	author: string
	time?: Date
}

export default class StorageMessages{
	public client: RadisClient
	constructor(){
		this.client = redis.createClient()
		this.client.on('error', (err) => console.log('Redis Client Error', err));
		this.client.connect()
	}
	setMessage(data: Message){
		const key = '_' + Math. random().toString(36).substr(2, 9)
		this.client.set(key, JSON.stringify(data))
	}
	getMessage(key: string): Promise<any>{
		return this.client.get(key)
	}

	getAllMessages(){
		return this.client.keys("*")
	}
}