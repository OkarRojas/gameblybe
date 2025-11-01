//
const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  juegoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Juego', // Referencia al modelo Juego
    required: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  contenido: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000
  },
  puntuacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resena', resenaSchema);
