const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: '2023',
  port: 5432,
});

const dbName = 'whitepix';

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.stack);
  } else {
    try {
      // Vérifier si la base de données existe
      const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname='${dbName}'`;
      const res = await client.query(dbCheckQuery);

      if (res.rowCount === 0) {
        // Créer la base de données si elle n'existe pas
        const createDbQuery = `CREATE DATABASE ${dbName}`;
        await client.query(createDbQuery);
        console.log(`Base de données '${dbName}' créée avec succès.`);
      } else {
        console.log(`La base de données '${dbName}' existe déjà.`);
      }
    } catch (queryErr) {
      console.error('Erreur lors de la vérification ou de la création de la base de données:', queryErr.stack);
    } finally {
      release(); // Libérer le client après utilisation
    }
  }
});

module.exports = pool;
