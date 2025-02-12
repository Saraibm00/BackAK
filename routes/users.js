const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Ruta para obtener usuarios que van
router.get('/api/users', async (req, res) => {
  try {
    const userGo = [];
    const userNoGo = [];
    const users = await User.find();
    for (let user of users){
      if(user.assistance[user.assistance.length - 1])
        userGo.push(user.username +', ');
      else
        userNoGo.push(user.username + ', ');
    }
    jsonRes = {userGo, userNoGo};
    res.status(200).json(jsonRes);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

module.exports = router;