const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const publicationRoutes = require('./routes/publicationRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { Server } = require('socket.io');

const app = express();
const port = 8081;

// Création d'un serveur HTTP
const server = http.createServer(app);

// Initialisation de Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/publications', publicationRoutes);
app.use('/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinConversation', ({ userId1, userId2 }) => {
    const room = [userId1, userId2].sort().join('-'); // Utiliser un nom de salle unique pour chaque conversation
    socket.join(room);
    console.log(`Utilisateur ${socket.id} a rejoint la salle: ${room}`);
  });

  socket.on('sendMessage', async (messageData) => {
    try {
      const newMessage = await messageDao.createMessage(
        messageData.userIdSource,
        messageData.userIdDestinataire,
        messageData.message
      );

      const room = [messageData.userIdSource, messageData.userIdDestinataire].sort().join('-');
      io.to(room).emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
