const pool = require('../db/db');

// Exemple de fonction pour obtenir les messages entre deux utilisateurs
const getMessagesBetweenUsers = async (userId1, userId2) => {
    const query = `
        SELECT * FROM messages
        WHERE (user_id_source = $1 AND user_id_destinataire = $2)
           OR (user_id_source = $2 AND user_id_destinataire = $1)
        ORDER BY created_at ASC;
    `;
    const values = [userId1, userId2];
    const result = await pool.query(query, values);
    return result.rows;
};

// Créer un nouveau message
const createMessage = async (userIdSource, userIdDestinataire, message) => {
    const result = await pool.query(
        'INSERT INTO messages (user_id_source, user_id_destinataire, message) VALUES ($1, $2, $3) RETURNING *',
        [userIdSource, userIdDestinataire, message]
    );
    return result.rows[0];
};

// Supprimer un message
const deleteMessage = async (id) => {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
};

module.exports = {
    getMessagesBetweenUsers,
    createMessage,
    deleteMessage,
};
