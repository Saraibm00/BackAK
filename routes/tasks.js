const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');
const User = require('../models/User');

// Obtener todas las tareas
router.get('/api/tasks', async (req, res) => {
  try {
    const user = await User.findById('67aa21e44df5374200071041');
    const tasks = await Task.find();
    const today = new Date();
    const firstThursday  = new Date(today.getFullYear(), 0, 4);
    const dayOfYear = (today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1;
    const weekNumber = Math.ceil((dayOfYear + firstThursday.getDay() - 1) / 7);
    if (user.week[0] != weekNumber){
      console.log("Ejecutando tarea de reinicio de las tasks...");
      console.log("La semana de hoy es la " + weekNumber);
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
        
      } catch (error) {
        console.error("Error al ejecutar la tarea:", error);
      }
      user.week[0] = weekNumber;
      user.save();
      console.log("Valores reseteados y actualizados correctamente.");
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
});

// Completar una tarea
router.post('/api/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const id = req.body.userId;
    
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    if (task.completedBy.includes(id)) {
      return res.status(400).json({ message: 'Esta tarea ya fue completada y no puede repetirse' });
    }

    if (!task.completedBy.includes(id)) {
      
      const idObject = mongoose.Types.ObjectId(id);
      
      task.completedBy.push(idObject);

      await task.save();
    }

    if (req.params.id == '67aa1c00e777a0ebbe8943b1') { //Aquí compruebo si la tarea es la de ir al Taller y se lo meto al usuario
      const user = await User.findById(id);
      user.assistance.set((user.assistance.length - 1), true);
      await user.save();
    }

    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al completar la tarea' });
  }
});


// Desmarcar una tarea
router.post('/api/tasks/:id/unComplete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const id = req.body.userId;
    
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    if (!task.completedBy.includes(id)) {
      return res.status(400).json({ message: 'Esta tarea todavía no fue completada y no puede desmarcarse' });
    }

    if (task.completedBy.includes(id)) {
      
      const index = task.completedBy.findIndex(item => item.toString() === id);
      task.completedBy.splice(index, 1);

      await task.save();
    }

    if (req.params.id == '67aa1c00e777a0ebbe8943b1') { //Aquí compruebo si la tarea es la de ir al Taller y se lo meto al usuario
      const user = await User.findById(id);
      user.assistance.set((user.assistance.length - 1), false);
      await user.save();
    }

    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al completar la tarea' });
  }
});

module.exports = router;
