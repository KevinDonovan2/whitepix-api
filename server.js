const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const publicationRoutes = require('./routes/publicationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 8081;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/publications', publicationRoutes)
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
