const express = require('express');
const connectDB = require('./config/database');
const juegosRoutes = require('./routes/games');  // ← Importar

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());

// Registrar rutas
app.use('/api/juegos', juegosRoutes);  // ← AGREGAR ESTA LÍNEA

// Ruta de prueba general
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '✅ Servidor funcionando' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
