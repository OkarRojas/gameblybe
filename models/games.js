//
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gamebly';

mongoose.set('strictQuery', false);

// Intentar conectar automáticamente si no hay conexión activa.
// Esto evita el error "Operation `games.find()` buffering timed out..." cuando se hace
// una consulta antes de que la conexión se establezca.
async function ensureConnection() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('MongoDB conectado a', MONGO_URI);
    } catch (err) {
      console.error('Error conectando a MongoDB:', err);
      // No lanzar para permitir que la app maneje el error y devuelva respuestas controladas
    }
  }
}

// Llamada no bloqueante para intentar conexión al requerir el modelo
ensureConnection();

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

// Exportar el modelo (usar nombre singular para evitar confusiones)
// Si el modelo ya existe (por recarga en entorno de desarrollo) úsalo en lugar de crearlo de nuevo.
module.exports = mongoose.models.Game || mongoose.model('Game', juegoSchema);
