
const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  juegoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'games', // Referencia al modelo Juego
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


// Obtener todos los juegos
const obtenerTodosLosJuegos = async () => {
  try {
    const juegos = await Juego.find();
    console.log('Juegos encontrados:', juegos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Obtener juegos con filtro
const obtenerJuegosPorPlataforma = async (plataforma) => {
  try {
    const juegos = await Juego.find({ plataforma: plataforma });
    console.log('Juegos de', plataforma, ':', juegos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Obtener un juego por ID
const obtenerJuegoPorId = async (id) => {
  try {
    const juego = await Juego.findById(id);
    if (!juego) {
      console.log('Juego no encontrado');
      return;
    }
    console.log('Juego:', juego);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Obtener el primer juego que coincida
const obtenerUnJuego = async () => {
  try {
    const juego = await Juego.findOne({ completado: true });
    console.log('Primer juego completado:', juego);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Juegos con puntuación mayor a 4
const obtenerJuegosAltaPuntuacion = async () => {
  try {
    const juegos = await Juego.find({
      puntuacion: { $gte: 4 }
    });
    console.log('Juegos con alta puntuacion:', juegos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ordenar por título
const obtenerJuegosOrdenados = async () => {
  try {
    const juegos = await Juego.find().sort({ titulo: 1 }); // 1 = ascendente, -1 = descendente
    console.log('Juegos ordenados por titulo:', juegos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Limitar resultados
const obtenerPrimerosCincoJuegos = async () => {
  try {
    const juegos = await Juego.find().limit(5);
    console.log('Primeros cinco juegos:', juegos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Seleccionar solo ciertos campos
const obtenerSoloTitulos = async () => {
  try {
    const juegos = await Juego.find().select('titulo plataforma');
    console.log('Solo titulos y plataforma:', juegos);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Actualizar por ID
const actualizarJuego = async (id) => {
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(
      id,
      { 
        completado: true,
        horasJugadas: 50
      },
      { 
        new: true, // Retorna el documento actualizado
        runValidators: true // Ejecuta las validaciones del esquema
      }
    );
    
    console.log('Juego actualizado:', juegoActualizado);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Actualizar múltiples documentos
const marcarJuegosCompletados = async () => {
  try {
    const resultado = await Juego.updateMany(
      { horasJugadas: { $gte: 100 } },
      { completado: true }
    );
    
    console.log(`${resultado.modifiedCount} juegos actualizados`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Eliminar por ID
const eliminarJuego = async (id) => {
  try {
    const juegoEliminado = await Juego.findByIdAndDelete(id);
    
    if (!juegoEliminado) {
      console.log('Juego no encontrado');
      return;
    }
    
    console.log('Juego eliminado:', juegoEliminado);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Eliminar múltiples documentos
const eliminarJuegosAntiguos = async () => {
  try {
    const resultado = await Juego.deleteMany({
      fechaLanzamiento: { $lt: new Date('2010-01-01') }
    });
    
    console.log(`${resultado.deletedCount} juegos eliminados`);
  } catch (error) {
    console.error('Error:', error);
  }
};
