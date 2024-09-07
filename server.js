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

// Écouter les connexions Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Gérer les messages entrants
  socket.on('sendMessage', async (messageData) => {
    try {
      // Sauvegarder le message dans la base de données
      const newMessage = await messageDao.createMessage(
        messageData.userId,
        messageData.avatar,
        messageData.name,
        messageData.message
      );

      // Envoyer le message à tous les clients connectés
      io.emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Remplacer app.listen par server.listen
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
