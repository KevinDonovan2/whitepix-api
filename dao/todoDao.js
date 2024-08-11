const pool = require('../db/db');

const getTodos = async () => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  return result.rows;
};

const getTodoById = async (id) => {
  const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
  return result.rows[0];
};

const createTodo = async (title, description) => {
  const result = await pool.query(
    'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
    [title, description]
  );
  return result.rows[0];
};

const updateTodo = async (id, title, description, is_completed) => {
  const result = await pool.query(
    'UPDATE todos SET title = $1, description = $2, is_completed = $3 WHERE id = $4 RETURNING *',
    [title, description, is_completed, id]
  );
  return result.rows[0];
};

const deleteTodo = async (id) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [id]);
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
                                                                                