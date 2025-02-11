const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const mongoose = require('mongoose');

// Ruta para obtener rankings
router.get('/api/rankings/:id', async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.id);

    // Obtener tareas completadas esta semana
    const tasksThisWeek = await Task.find({ completedBy: userId });
    const percentageThisWeek = tasksThisWeek.length >= 5 ? 100 : (tasksThisWeek.length / 5) * 100;

    // Obtener datos de todas las semanas
    const user = await User.findById(userId);
    user.weeklyScores.set((user.weeklyScores.length - 1), percentageThisWeek);
    await user.save();
    const weeklyRankings = user.weeklyScores.reduce((acumulador, valorActual) => acumulador + valorActual, 0) / user.weeklyScores.length;
    res.json({
      weeklyTasksCompleted: percentageThisWeek,
      weeklyRankings: weeklyRankings
    });
  } catch (error) {
    console.error('Error al obtener rankings:', error);
    res.status(500).json({ message: 'Error al obtener rankings' });
  }
});

module.exports = router;
