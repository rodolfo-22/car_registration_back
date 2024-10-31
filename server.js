const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/placas')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });

const vehiculoSchema = new mongoose.Schema({
  nombre: { type: String, trim: true },
  placa: { type: String, trim: true, unique: true },
  marca: String,
  modelo: String,
  tipo: String,
  color: String,
  anio: Number,
  estado: String,
  extravio: String,
  numero: Number
});

// Crear un modelo basado en el esquema
const Vehiculo = mongoose.model('Vehiculo', vehiculoSchema);

// Ruta principal para la búsqueda
app.get('/search', async (req, res) => {
  const searchType = req.query.type;
  const searchValue = req.query.value.trim().toLowerCase();

  let results = null;

  try {
    if (searchType === 'placa') {
      results = await Vehiculo.find({ placa: { $regex: new RegExp(`^${searchValue}$`, 'i') } });
            console.log('Resultado de la búsqueda por placa:', results);

    } else if (searchType === 'nombre') {
      results = await Vehiculo.find({ nombre: { $regex: new RegExp(`^${searchValue}$`, 'i') } });
            console.log('Resultado de la búsqueda por nombre:', results);

    }

    if (results && results.length > 0) {
      res.json(results); 
    } else {
      res.status(404).json({ error: 'No se encontraron resultados.' });
    }
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
