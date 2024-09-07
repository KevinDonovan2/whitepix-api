const pool = require('../db/db');

// Récupérer toutes les publications
const getPublications = async () => {
  const result = await pool.query('SELECT * FROM publications ORDER BY id DESC;');
  return result.rows;
};

// Récupérer une publication par ID
const getPublicationById = async (id) => {
  const result = await pool.query('SELECT * FROM publications WHERE id = $1', [id]);
  return result.rows[0];
};

// Créer une nouvelle publication
const createPublication = async (user_name, reaction, description, creation_date, creation_time, photo_url, comment) => {
  const result = await pool.query(
    'INSERT INTO publications (user_name, reaction, description, creation_date, creation_time, photo_url, comment) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [user_name, reaction, description, creation_date, creation_time, photo_url, comment]
  );
  return result.rows[0];
};

// Mettre à jour une publication existante
const updatePublication = async (id, user_name, reaction, description, creation_date, creation_time, photo_url, comment) => {
  const result = await pool.query(
    'UPDATE publications SET user_name = $1, reaction = $2, description = $3, creation_date = $4, creation_time = $5, photo_url = $6, comment = $7 WHERE id = $8 RETURNING *',
    [user_name, reaction, description, creation_date, creation_time, photo_url, comment, id]
  );
  return result.rows[0];
};

// Supprimer une publication
const deletePublication = async (id) => {
  await pool.query('DELETE FROM publications WHERE id = $1', [id]);
};

module.exports = {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
};
