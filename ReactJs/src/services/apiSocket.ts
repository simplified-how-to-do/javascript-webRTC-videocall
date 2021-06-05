import { io } from 'socket.io-client';

// const apiSocket = io('https://d2474bb59f8b.ngrok.io/');
const apiSocket = io('http://localhost:3334/');

export default apiSocket;
