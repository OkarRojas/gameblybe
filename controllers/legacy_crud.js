
const mongoose = require('mongoose');
const games = require('../models/games');

// Obtener modelo de juego - simplificado
const getGameModel = () => {
  try {
    return mongoose.model('Game') || mongoose.model('Juego');
  } catch (error) {
    throw new Error('Modelo de Juego no registrado. Asegúrate de cargar el modelo antes de usar este controlador.');
  }
};

let Juego = null;


/**
 * Inicializa el modelo de Juego
 */
const initializeModel = (model) => {
  Juego = model;
};

/**
 * Obtener todos los juegos
 * @returns {Promise<Array>} Array de juegos o array vacío
 * @throws {Error} Error de base de datos
 */
const obtenerTodosLosJuegos = async () => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    const juegos = await games.find().lean();
    return juegos;
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    throw error;
  }
};

/**
 * Obtener juegos filtrados por plataforma
 * @param {string} plataforma - Plataforma a filtrar
 * @returns {Promise<Array>} Array de juegos de la plataforma
 * @throws {Error} Error de validación o base de datos
 */
const obtenerJuegosPorPlataforma = async (plataforma) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (!plataforma || typeof plataforma !== 'string') {
      throw new Error('Plataforma debe ser una cadena válida');
    }
    
    const juegos = await Juego.find({ plataforma: plataforma.trim() }).lean();
    return juegos;
  } catch (error) {
    console.error(`Error al obtener juegos por plataforma ${plataforma}:`, error);
    throw error;
  }
};

/**
 * Obtener un juego por ID
 * @param {string} id - ID del juego
 * @returns {Promise<Object|null>} Juego encontrado o null
 * @throws {Error} Error de validación o base de datos
 */
const obtenerJuegoPorId = async (id) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de juego inválido');
    }
    
    const juego = await Juego.findById(id).lean();
    return juego || null;
  } catch (error) {
    console.error(`Error al obtener juego con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener el primer juego que coincida con criterios
 * @param {Object} criterios - Criterios de búsqueda
 * @returns {Promise<Object|null>} Primer juego encontrado o null
 * @throws {Error} Error de base de datos
 */
const obtenerUnJuego = async (criterios = { completado: true }) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    
    const juego = await Juego.findOne(criterios).lean();
    return juego || null;
  } catch (error) {
    console.error('Error al obtener un juego:', error);
    throw error;
  }
};

/**
 * Obtener juegos con puntuación mínima
 * @param {number} puntuacionMinima - Puntuación mínima (default: 4)
 * @returns {Promise<Array>} Array de juegos con alta puntuación
 * @throws {Error} Error de validación o base de datos
 */
const obtenerJuegosAltaPuntuacion = async (puntuacionMinima = 4) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (typeof puntuacionMinima !== 'number' || puntuacionMinima < 0 || puntuacionMinima > 5) {
      throw new Error('Puntuación debe ser un número entre 0 y 5');
    }
    
    const juegos = await Juego.find({
      puntuacion: { $gte: puntuacionMinima }
    }).lean();
    return juegos;
  } catch (error) {
    console.error(`Error al obtener juegos con puntuación >= ${puntuacionMinima}:`, error);
    throw error;
  }
};

/**
 * Obtener juegos ordenados
 * @param {string} campo - Campo para ordenar (default: 'titulo')
 * @param {number} orden - 1 ascendente, -1 descendente (default: 1)
 * @returns {Promise<Array>} Array de juegos ordenados
 * @throws {Error} Error de validación o base de datos
 */
const obtenerJuegosOrdenados = async (campo = 'titulo', orden = 1) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (![1, -1].includes(orden)) {
      throw new Error('Orden debe ser 1 (ascendente) o -1 (descendente)');
    }
    
    const juegos = await Juego.find().sort({ [campo]: orden }).lean();
    return juegos;
  } catch (error) {
    console.error(`Error al obtener juegos ordenados por ${campo}:`, error);
    throw error;
  }
};

/**
 * Obtener juegos con límite
 * @param {number} limite - Número máximo de resultados (default: 5)
 * @param {number} pagina - Número de página para paginación (default: 1)
 * @returns {Promise<Array>} Array de juegos limitados
 * @throws {Error} Error de validación o base de datos
 */
const obtenerJuegosLimitados = async (limite = 5, pagina = 1) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (typeof limite !== 'number' || limite < 1) {
      throw new Error('Límite debe ser un número positivo');
    }
    
    const skip = (pagina - 1) * limite;
    const juegos = await Juego.find()
      .limit(limite)
      .skip(skip)
      .lean();
    return juegos;
  } catch (error) {
    console.error(`Error al obtener ${limite} juegos (página ${pagina}):`, error);
    throw error;
  }
};

/**
 * Obtener solo campos específicos
 * @param {string} campos - Campos a seleccionar (separados por espacio)
 * @returns {Promise<Array>} Array de juegos con campos seleccionados
 * @throws {Error} Error de validación o base de datos
 */
const obtenerSoloTitulos = async (campos = 'titulo plataforma') => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    
    const juegos = await Juego.find().select(campos).lean();
    return juegos;
  } catch (error) {
    console.error(`Error al obtener juegos con campos: ${campos}:`, error);
    throw error;
  }
};

/**
 * Actualizar un juego por ID
 * @param {string} id - ID del juego
 * @param {Object} actualizaciones - Datos a actualizar
 * @returns {Promise<Object|null>} Juego actualizado o null
 * @throws {Error} Error de validación o base de datos
 */
const actualizarJuego = async (id, actualizaciones = {}) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de juego inválido');
    }
    if (Object.keys(actualizaciones).length === 0) {
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    const juegoActualizado = await Juego.findByIdAndUpdate(
      id,
      actualizaciones,
      { 
        new: true,
        runValidators: true
      }
    ).lean();
    
    if (!juegoActualizado) {
      throw new Error(`Juego con ID ${id} no encontrado`);
    }
    
    return juegoActualizado;
  } catch (error) {
    console.error(`Error al actualizar juego ${id}:`, error);
    throw error;
  }
};

/**
 * Actualizar múltiples juegos basado en criterios
 * @param {Object} criterios - Criterios para encontrar juegos
 * @param {Object} actualizaciones - Datos a actualizar
 * @returns {Promise<Object>} Resultado de la actualización (modifiedCount)
 * @throws {Error} Error de validación o base de datos
 */
const actualizarMultiplesJuegos = async (criterios = {}, actualizaciones = {}) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (Object.keys(actualizaciones).length === 0) {
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    const resultado = await Juego.updateMany(criterios, actualizaciones);
    return {
      modifiedCount: resultado.modifiedCount,
      matchedCount: resultado.matchedCount
    };
  } catch (error) {
    console.error('Error al actualizar múltiples juegos:', error);
    throw error;
  }
};

/**
 * Eliminar múltiples juegos basado en criterios
 * @param {Object} criterios - Criterios para encontrar juegos a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación (deletedCount)
 * @throws {Error} Error de validación o base de datos
 */
const eliminarJuegos = async (criterios = {}) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (Object.keys(criterios).length === 0) {
      throw new Error('Debe proporcionar criterios de eliminación');
    }
    
    const resultado = await Juego.deleteMany(criterios);
    return {
      deletedCount: resultado.deletedCount
    };
  } catch (error) {
    console.error('Error al eliminar juegos:', error);
    throw error;
  }
};

/**
 * Eliminar juego por ID
 * @param {string} id - ID del juego
 * @returns {Promise<Object|null>} Juego eliminado o null
 * @throws {Error} Error de validación o base de datos
 */
const eliminarJuegoPorId = async (id) => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de juego inválido');
    }
    
    const juegoEliminado = await Juego.findByIdAndDelete(id).lean();
    
    if (!juegoEliminado) {
      throw new Error(`Juego con ID ${id} no encontrado`);
    }
    
    return juegoEliminado;
  } catch (error) {
    console.error(`Error al eliminar juego ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener estadísticas de juegos
 * @returns {Promise<Object>} Estadísticas generales
 * @throws {Error} Error de base de datos
 */
const obtenerEstadisticas = async () => {
  try {
    if (!Juego) throw new Error('Modelo no inicializado');
    
    const estadisticas = await Juego.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          puntuacionPromedio: { $avg: '$puntuacion' },
          puntuacionMaxima: { $max: '$puntuacion' },
          puntuacionMinima: { $min: '$puntuacion' }
        }
      }
    ]);
    
    return estadisticas[0] || { total: 0 };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

module.exports = {
  initializeModel,
  obtenerTodosLosJuegos,
  obtenerJuegosPorPlataforma,
  obtenerJuegoPorId,
  obtenerUnJuego,
  obtenerJuegosAltaPuntuacion,
  obtenerJuegosOrdenados,
  obtenerJuegosLimitados,
  obtenerSoloTitulos,
  actualizarJuego,
  actualizarMultiplesJuegos,
  eliminarJuegos,
  eliminarJuegoPorId,
  obtenerEstadisticas
};
