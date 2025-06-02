
console.log(' Iniciando servidor...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)


  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(5000, () => {
      console.log('Servidor corriendo en el puerto', process.env.PORT);
    });
  })
  .catch(err => console.log('Error al conectar:', err));
