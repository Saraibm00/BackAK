const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const rankingsRouter = require('./routes/rankings');
const usersRouter = require('./routes/users');
require('dotenv').config();
const authRouter = require('./routes/auth');
const resetRouter = require('./routes/reset');
const cron = require("node-cron");
const Task = require('./models/Task');
const User = require('./models/User');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use(tasksRouter);
app.use(rankingsRouter);
app.use(authRouter);
app.use(usersRouter);
app.use(resetRouter);


// Conexión a MongoDB
mongoose.connect( process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.BD_NAME,
  user: process.env.BD_USER,
  pass: process.env.BD_PASS,
  replicaSet: 'atlas-q3cze7-shard-0'
}).then(() => {
  console.log('Conectado a MongoDB');
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}).catch(err => console.error('Error al conectar a MongoDB:', err));
