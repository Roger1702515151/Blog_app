const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado, token requerido' });
  }

  const token = authHeader.split(' ')[1]; // Extrae solo el token después de 'Bearer'

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Agrega el usuario verificado al request
    next(); // Continúa al siguiente middleware o ruta
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido' });
  }
}

module.exports = verifyToken;
