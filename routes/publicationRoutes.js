const express = require('express');
const router = express.Router();
const publicationDao = require('../dao/publicationDao');

// Route pour obtenir toutes les publications
router.get('/', async (req, res) => {
  try {
    const publications = await publicationDao.getPublications();
    res.status(200).json(publications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour créer une nouvelle publication
router.post('/', async (req, res) => {
  const { user_name, reaction, description, creation_date, creation_time, photo_url, comment } = req.body;
  try {
    const newPublication = await publicationDao.createPublication(user_name, reaction, description, creation_date, creation_time, photo_url, comment);
    res.status(201).json(newPublication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour mettre à jour une publication
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { user_name, reaction, description, creation_date, creation_time, photo_url, comment } = req.body;
  try {
    const updatedPublication = await publicationDao.updatePublication(id, user_name, reaction, description, creation_date, creation_time, photo_url, comment);
    res.status(200).json(updatedPublication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour supprimer une publication
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await publicationDao.deletePublication(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
