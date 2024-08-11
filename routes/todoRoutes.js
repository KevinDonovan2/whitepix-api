const express = require('express');
const router = express.Router();
const todoDao = require('../dao/todoDao');

// Route pour obtenir tous les todos
router.get('/', async (req, res) => {
  try {
    const todos = await todoDao.getTodos();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour créer un nouveau todo
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = await todoDao.createTodo(title, description);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour mettre à jour un todo
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, is_completed } = req.body;
  try {
    const updatedTodo = await todoDao.updateTodo(id, title, description, is_completed);
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour supprimer un todo
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await todoDao.deleteTodo(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;