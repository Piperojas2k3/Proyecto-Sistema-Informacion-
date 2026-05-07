// /backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURACIÓN DE MIDDLEWARES ---
// CORS permite que tu Frontend en React se comunique con este servidor
app.use(cors());
// Permite que el servidor entienda los datos en formato JSON que envía React
app.use(express.json());

// --- CONFIGURACIÓN DE POSTGRESQL ---
// Los datos de conexión se toman de tu archivo .env para mayor seguridad
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verificar conexión a la base de datos
pool.connect((err) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('Conexión a PostgreSQL exitosa.');
  }
});

// --- RUTAS DEL API ---

/**
 * 1. GET /api/dashboard
 * Calcula métricas clave para el negocio: facturación mensual y saldos pendientes.
 */
app.get('/api/dashboard', async (req, res) => {
  try {
    // Consulta para sumar el total facturado del mes actual
    const facturadoQuery = `
      SELECT SUM(monto) as total_facturado 
      FROM facturas 
      WHERE DATE_TRUNC('month', fecha_emision) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    // Consulta para sumar lo que aún no se ha pagado
    const porCobrarQuery = `
      SELECT SUM(monto) as total_pendiente 
      FROM facturas 
      WHERE pagada = false
    `;

    // Consulta para la tarifa efectiva (Ingresos totales / Horas totales trabajadas)
    const tarifaQuery = `
      SELECT (SUM(f.monto) / NULLIF(SUM(s.horas_totales), 0)) as tarifa_efectiva
      FROM facturas f
      JOIN sesiones_trabajo s ON f.cliente_id = s.cliente_id
    `;

    const [facturado, pendiente, tarifa] = await Promise.all([
      pool.query(facturadoQuery),
      pool.query(porCobrarQuery),
      pool.query(tarifaQuery)
    ]);

    res.json({
      totalFacturado: facturado.rows[0].total_facturado || 0,
      totalPorCobrar: pendiente.rows[0].total_pendiente || 0,
      tarifaEfectiva: parseFloat(tarifa.rows[0].tarifa_efectiva || 0).toFixed(2)
    });

  } catch (error) {
    console.error('Error en Dashboard:', error);
    res.status(500).json({ error: 'Error al obtener métricas del servidor' });
  }
});

/**
 * 2. POST /api/clientes
 * Registra un nuevo cliente desde el formulario de React.
 */
app.post('/api/clientes', async (req, res) => {
  const { nombre, empresa, email } = req.body;

  try {
    const query = 'INSERT INTO clientes (nombre, empresa, email) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, empresa, email];
    
    const result = await pool.query(query, values);
    res.status(201).json({
      message: 'Cliente guardado correctamente',
      cliente: result.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    res.status(500).json({ error: 'No se pudo registrar el cliente' });
  }
});

/**
 * 3. POST /api/sesiones
 * Guarda el tiempo registrado por el cronómetro del freelance.
 */
app.post('/api/sesiones', async (req, res) => {
  const { cliente_id, horas_totales, descripcion } = req.body;

  try {
    const query = `
      INSERT INTO sesiones_trabajo (cliente_id, horas_totales, descripcion, fecha) 
      VALUES ($1, $2, $3, NOW()) RETURNING *
    `;
    const values = [cliente_id, horas_totales, descripcion];

    const result = await pool.query(query, values);
    res.status(201).json({
      message: 'Sesión de tiempo guardada',
      sesion: result.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar sesión:', error);
    res.status(500).json({ error: 'Error al procesar el registro de tiempo' });
  }
});

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});
