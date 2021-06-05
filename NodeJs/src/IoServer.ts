import { Server } from 'http';
import socketIo from 'socket.io';

class IoServer {
  #activeSockets: string[] = [];

  constructor(httpServer: Server) {
    const io = new socketIo.Server(httpServer, {
      cors: {
        origin: '*',
      },
    });
    io.on('connection', (socket) => {
      console.log('socket');
      const existingSocket = this.#activeSockets.find(
        (existingSocket) => existingSocket === socket.id
      );

      if (!existingSocket) {
        this.#activeSockets.push(socket.id);

        socket.emit('update-user-list', {
          users: this.#activeSockets.filter(
            (existingSocket) => existingSocket !== socket.id
          ),
        });

        socket.broadcast.emit('update-user-list', {
          users: [socket.id],
        });
      }

      socket.on('call-user', (data: any) => {
        socket.to(data.to).emit('call-made', {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on('make-answer', (data: any) => {
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer,
        });
      });

      socket.on('reject-call', (data: any) => {
        socket.to(data.from).emit('call-rejected', {
          socket: socket.id,
        });
      });

      socket.on('disconnect', () => {
        this.#activeSockets = this.#activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id
        );
        socket.broadcast.emit('remove-user', {
          socketId: socket.id,
        });
      });
    });
  }
}

export default IoServer;
