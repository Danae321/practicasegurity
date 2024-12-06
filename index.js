// Cargar dependencias necesarias
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config(); // Cargar las variables del archivo .env

const app = express();
app.use(express.json()); // Permitir trabajar con JSON en las solicitudes

// Simulación de un usuario en base de datos
const user = {
    id: 1,
    username: 'admin',
    password: '$2b$10$yP4oIu0GgT6uPGrqPzCl5eRQ/vs.QGEih8mGy93SIkQgdd3RupR/u', // Contraseña 'password' hasheada
};

// Ruta básica para la raíz del servidor
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Endpoint para iniciar sesión y generar el token JWT
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario existe
    if (username !== user.username) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = jwt.sign(
        { id: user.id, username: user.username }, // Payload
        process.env.JWT_SECRET,                   // Clave secreta
        { expiresIn: '1h' }                       // Expira en 1 hora
    );

    res.json({ token });
});

// Puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
