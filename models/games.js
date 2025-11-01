//
const mongoose = require('mongoose');

const juegoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  plataforma: {
    type: String,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  fechaLanzamiento: {
    type: Date
  },
  portada: {
    type: String, // URL de la imagen
    default: 'default-cover.jpg'
  },
  completado: {
    type: Boolean,
    default: false
  },
  horasJugadas: {
    type: Number,
    default: 0,
    min: 0
  },
  puntuacion: {
    type: Number,
    min: 1,
    max: 5
  },
  descripcion: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Exportar el modelo
module.exports = mongoose.model('games', juegoSchema);
