const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');

// Obtener todas las tareas
router.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
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
