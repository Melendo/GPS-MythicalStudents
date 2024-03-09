
const request = require('supertest');
const express = require('express');

// Mock de la función de consulta de la base de datos
jest.mock('../../connection/connection.js', () => ({
  getConnection: jest.fn((callback) => {
    const mockConnection = {
      query: jest.fn((query, params, callback) => {
        if (query === 'SELECT * FROM mm_coleccion WHERE nombre = ?' && params[0] === 'nombreExistente') {
          // Simular resultado de la consulta si el nombre existe en la base de datos
          callback(null, [{ id: 1, nombre: 'nombreExistente' }]);
        } else {
          // Simular resultado de la consulta si el nombre no existe en la base de datos
          callback(null, []);
        }
      }),
      release: jest.fn()
    };
    callback(null, mockConnection);
  })
}));

const router = require('../../routes/crearColeccion.js'); // Asegúrate de importar tu archivo de rutas

// Creamos una aplicación de Express para probar el endpoint
const app = express();
app.use('/', router);

describe('Endpoint consultarNombre', () => {
  it('Debería devolver verdadero si el nombre existe en la base de datos', async () => {
    const response = await request(app).get('/consultarNombre').query({ nombre: 'nombreExistente' });
    expect(response.status).toBe(200); // Verifica que la respuesta sea 200 (OK)
    expect(response.body).toBe(true); // Verifica que el cuerpo de la respuesta sea true
  });

  it('Debería devolver falso si el nombre no existe en la base de datos', async () => {
    const response = await request(app).get('/consultarNombre').query({ nombre: 'nombreNoExistente' });
    expect(response.status).toBe(200); // Verifica que la respuesta sea 200 (OK)
    expect(response.body).toBe(false); // Verifica que el cuerpo de la respuesta sea false
  });
});
