const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userNoAssistance = ['67aa21e44df5374200071041', '67ab6bc9d3f1331bfa79f725', '67ab6f04d3f1331bfa79f75a', '67ad0b2b79b60513d805d1ef', '67b04b23c1551c66aa28b301'];

// Ruta para obtener usuarios que van
router.get('/api/users', async (req, res) => {
  try {
    const userGo = [];
    const userNoGo = [];
    const users = await User.find();
    for (let user of users){
      if(!userNoAssistance.includes(user.id)){
        if(user.assistance[user.assistance.length - 1])
          userGo.push(user.username +', ');
        else
          userNoGo.push(user.username + ', ');
      }
    }
    jsonRes = {userGo, userNoGo};
    res.status(200).json(jsonRes);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

module.exports = router;