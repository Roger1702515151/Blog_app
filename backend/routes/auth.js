const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new User({ username, email, password: hash });
    await nuevoUsuario.save();
    res.status(201).json('Usuario registrado');
  } catch (error) {
    res.status(500).json('Error en el registro');
  }
});

module.exports = router;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json('Correo no registrado');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json('Contraseña incorrecta');

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json('Error en el inicio de sesión');
  }
});
