const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const userNoAssistance = ['67aa21e44df5374200071041', '67ab6bc9d3f1331bfa79f725', '67ab6f04d3f1331bfa79f75a', '67ad0b2b79b60513d805d1ef', '67b04b23c1551c66aa28b301'];

// Ruta para resetear los valores de cada semana
router.get('/api/reset', async (req, res) => {
  console.log("Ejecutando tarea de reinicio desde el reset...");
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
  
      // Aquí añado una semana más al ranking total y a la asistencia a los talleres
      const users = await User.find();
      for (let user of users){
        user.weeklyScores.push(0);
        user.assistance.push(false);
        await user.save();
      }
  
      console.log("Valores reseteados y actualizados correctamente.");
    } catch (error) {
      console.error("Error al ejecutar la tarea:", error);
    }
});

module.exports = router;