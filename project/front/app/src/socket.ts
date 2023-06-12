import io from 'socket.io-client';
import {cookies} from "./App";

class SocketSingleton {
	private static instance: SocketSingleton;
	private socket;

	private constructor () {
		this.socket = io(process.env.REACT_APP_IP + ":3000", {
			transports: ['websocket']
		});
		this.socket.on('connect', async () => {
			let jwtAuthorization = cookies.get('jwtAuthorization');
			while (!jwtAuthorization) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				jwtAuthorization = cookies.get('jwtAuthorization');
			}
			this.socket.emit('connection', { token: jwtAuthorization });
			console.log('connected');
		});


	}

	public static getInstance() {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}
		return SocketSingleton.instance;
	}

	public getSocket() {
		return this.socket;
	}
}

export default SocketSingleton;
