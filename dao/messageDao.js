const pool = require('../db/db');

// Récupérer tous les messages d'un utilisateur
const getMessagesByUserId = async (userId) => {
    const result = await pool.query('SELECT * FROM messages WHERE user_id = $1 ORDER BY id ASC', [userId]);
    return result.rows;
};

// Créer un nouveau message
const createMessage = async (userId, avatar, name, message) => {
    const result = await pool.query(
        'INSERT INTO messages (user_id, avatar, name, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, avatar, name, message]
    );
    return result.rows[0];
};

// Supprimer un message
const deleteMessage = async (id) => {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
};

module.exports = {
    getMessagesByUserId,
    createMessage,
    deleteMessage,
};
