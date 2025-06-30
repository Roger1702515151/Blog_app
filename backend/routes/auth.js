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
const verifyToken = require('./verifyToken'); 

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ mensaje: 'Acceso permitido', usuario: req.user });
});
const express = require('express');
const passport = require('passport');
require('../config/passport'); // asegúrate de que esta línea se ejecuta

const router = express.Router();

// Inicia el login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback que Google redirige
router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/'
}), (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.redirect(`${process.env.FRONT_URL}/oauth-success?token=${token}`);
});

module.exports = router;
