const request = require('supertest');
const express = require('express');
const router = require('../../routes/crearColeccion.js'); // Asegúrate de importar tu archivo de rutas
const db = require('../connection/connection.js'); // Importa tu módulo de conexión a la base de datos

const app = express();
app.use('/', router);

describe('Prueba de integración para insertarColeccion', () => {
  beforeAll(async () => {
    // Código para establecer el estado inicial de la base de datos antes de ejecutar las pruebas
    // Por ejemplo, podrías insertar datos de prueba necesarios para la prueba
  });

  afterAll(async () => {
    // Código para limpiar el estado de la base de datos después de ejecutar todas las pruebas
    // Por ejemplo, podrías eliminar los datos de prueba que insertaste antes de las pruebas
  });

  it('Debería insertar una colección en la base de datos y devolver un objeto JSON', async () => {
    const imagen = 'imagen de prueba';
    const nombre = 'nombre de prueba';
    const descripcion = 'descripcion de prueba';
    const categorias = 'categoria1,categoria2'; // Ejemplo de categorías separadas por comas

    // Realizar una solicitud HTTP simulada al endpoint
    const response = await request(app)
      .post('/insertarColeccion')
      .field('nombre', nombre)
      .field('descripcion', descripcion)
      .field('categorias', categorias)
      .attach('imagen', Buffer.from(imagen), 'imagen.png'); // Adjuntar una imagen simulada como archivo

    // Verificar que la respuesta sea exitosa (código 200) y que devuelva el objeto JSON esperado
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ insertado: true });

    // Realizar consultas a la base de datos para verificar si los datos se han insertado correctamente
    const result = await db.query('SELECT * FROM mm_coleccion WHERE nombre = ?', [nombre]);
    expect(result.length).toBeGreaterThan(0);
  });
});
