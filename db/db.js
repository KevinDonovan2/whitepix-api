require('dotenv').config();
const { Pool } = require('pg');

// Configuration de la connexion au pool PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// Fonction pour vérifier et créer les tables si elles n'existent pas
const createTablesIfNotExists = async () => {
  const tableCheckQuery = `
    SELECT EXISTS (
      SELECT FROM pg_tables 
      WHERE tablename = $1
    ) AS exists;
  `;

  const tablesToCheck = [
    {
      name: 'users',
      createQuery: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          photo TEXT
        );
      `
    },
    {
      name: 'messages',
      createQuery: `
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          user_id_source INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_id_destinataire INTEGER REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'publications',
      createQuery: `
        CREATE TABLE IF NOT EXISTS publications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_name VARCHAR(255) NOT NULL,
          reaction VARCHAR(50),
          description TEXT,
          creation_date DATE DEFAULT CURRENT_DATE,
          creation_time TIME DEFAULT CURRENT_TIME,
          photo_url TEXT,
          comment TEXT
        );
      `
    }
  ];

  try {
    for (const table of tablesToCheck) {
      const result = await pool.query(tableCheckQuery, [table.name]);
      const tableExists = result.rows[0].exists;

      if (!tableExists) {
        console.log(`Création de la table '${table.name}'...`);
        await pool.query(table.createQuery);
        console.log(`Table '${table.name}' créée avec succès.`);
      } else {
        console.log(`La table '${table.name}' existe déjà.`);
      }
    }
  } catch (err) {
    console.error(
      'Erreur lors de la vérification ou de la création des tables:',
      err.stack
    );
  }
};

// Initialisation de la base de données
const initDatabase = async () => {
  try {
    await createTablesIfNotExists();
    console.log('Initialisation de la base de données terminée.');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la base de données:', err.stack);
  }
};

// Exécute l'initialisation de la base de données
initDatabase();

// Export du pool pour l'utiliser dans d'autres fichiers
module.exports = pool;
