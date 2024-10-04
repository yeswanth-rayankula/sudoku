// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
    io.to(room).emit('notification', `User ${socket.id} has joined the room: ${room}`);
  });

  socket.on('send_message', (data) => {
    const { room, message } = data;
    io.to(room).emit('receive_message', message);
    console.log(`Message sent to room ${room}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
