const express = require('express');
const router = express.Router();
const messageDao = require('../dao/messageDao');

// Route pour obtenir tous les messages d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const messages = await messageDao.getMessagesByUserId(userId);
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour créer un nouveau message
router.post('/', async (req, res) => {
    const { userId, avatar, name, message } = req.body;
    try {
        const newMessage = await messageDao.createMessage(userId, avatar, name, message);
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour supprimer un message
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await messageDao.deleteMessage(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
