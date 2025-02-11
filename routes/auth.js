const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;  // Cambia esto por algo más seguro en producción

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, id: user._id});
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión'});
  }
});

// Ruta para registrar un nuevo usuario
router.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Verifica si el usuario ya existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      // Encripta la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Crea el nuevo usuario
      const newUser = new User({
        username,
        password: hashedPassword,
        weeklyScores: [0], //La lógica será siempre iterar sobre la última cada vez que haga tareas esa semana
      });
  
      await newUser.save();
  
      // Genera un token para el nuevo usuario
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ token, message: 'Usuario registrado con éxito', id: newUser._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  });

module.exports = router;
