import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      alert(res.data);
    } catch (error) {
      alert('Error al registrar: ' + error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
        required
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
