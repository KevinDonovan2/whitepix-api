const express = require('express');
const router = express.Router();
const userDao = require('../dao/userDao');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await userDao.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await userDao.authenticateUser(email, password);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await userDao.createUsers(name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    try {
        const updatedUser = await userDao.updateUser(id, name, email, password);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await userDao.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
