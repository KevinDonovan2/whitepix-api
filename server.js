const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 4000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/todos', todoRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
