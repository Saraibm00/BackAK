const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const rankingsRouter = require('./routes/rankings');
require('dotenv').config();
const authRouter = require('./routes/auth');
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

// 📅 Ejecutar cada lunes a las 10:00 AM
cron.schedule("0 7 * * 1", async () => {
  console.log("Ejecutando tarea de reinicio...");

  try {
    // Aquí pongo las tareas todas sin hacer y las que son de un solo uso las pongo a usadas una vez por los que las han completado
    // para que así no les vuelva a salir a la siguiente semana ni las posteriores
    const tasks = await Task.find();
    for (let task of tasks){
      if(task.singleUse){
        task.usedOnce = task.completedBy;
      }
      task.completedBy = [];
      await task.save();
    }

    // Aquí añado una semana más al ranking total
    const users = await User.find();
    for (let user of users){
      user.weeklyScores.push(0);
      await user.save();
    }

    console.log("Valores reseteados y actualizados correctamente.");
  } catch (error) {
    console.error("Error al ejecutar la tarea:", error);
  }
});

console.log("Bot en ejecución...");

