const express = require('express');
const router = express.Router();
const messageDao = require('../dao/messageDao');

// Route pour obtenir tous les messages entre deux utilisateurs
router.get('/conversation', async (req, res) => {
    const { userId1, userId2 } = req.query;

    // Vérification des paramètres
    if (!userId1 || !userId2) {
        return res.status(400).json({ error: 'Missing userId1 or userId2' });
    }

    console.log(`Request for messages between userId1: ${userId1} and userId2: ${userId2}`);

    try {
        // Appel à la fonction DAO pour récupérer les messages
        const messages = await messageDao.getMessagesBetweenUsers(userId1, userId2);

        // Vérifie s'il y a des messages à renvoyer
        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: 'No messages found between these users.' });
        }

        // Réponse avec les messages récupérés
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route pour créer un nouveau message
router.post('/', async (req, res) => {
    const { userIdSource, userIdDestinataire, message } = req.body;

    // Vérification des paramètres
    if (!userIdSource || !userIdDestinataire || !message) {
        return res.status(400).json({ error: 'Paramètres manquants.' });
    }

    console.log(`Creating message from userIdSource: ${userIdSource} to userIdDestinataire: ${userIdDestinataire}`);

    try {
        // Appel à la fonction DAO pour créer un message
        const newMessage = await messageDao.createMessage(userIdSource, userIdDestinataire, message);

        // Réponse avec le message nouvellement créé
        res.status(201).json(newMessage);
    } catch (err) {
        console.error('Error creating message:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route pour supprimer un message
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid message ID.' });
    }

    console.log(`Deleting message with ID: ${id}`);

    try {
        // Appel à la fonction DAO pour supprimer un message
        await messageDao.deleteMessage(id);
        res.status(204).send();
    } catch (err) {
        console.error(`Error deleting message with ID ${id}:`, err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
