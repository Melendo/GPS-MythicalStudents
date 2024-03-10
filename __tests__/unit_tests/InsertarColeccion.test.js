const request = require('supertest');
const express = require('express');
const router = require('../../routes/crearColeccion.js');

jest.mock('../../connection/connection.js', () => ({
  getConnection: jest.fn((callback) => {
    const mockConnection = {
      query: jest.fn((query, params, callback) => {
        // Simulamos una inserción exitosa en la base de datos
        if (query === 'INSERT INTO mm_coleccion (nombre, imagen, descripcion) VALUES (?, ?, ?)') {
          callback(null, { insertId: 1 }); // Devolvemos el ID de la nueva colección
        } else {
          callback(null, []);
        }
      }),
      release: jest.fn()
    };
    callback(null, mockConnection);
  })
}));

const app = express();
app.use('/', router);

describe('Pruebas para la ruta insertarColeccion', () => {
  it('Debería insertar una nueva colección en la base de datos y devolver una respuesta exitosa', async () => {
    const response = await request(app)
      .post('/insertarColeccion')
      .send({
        nombre: 'Nueva Colección',
        descripcion: 'Descripción de la nueva colección',
        categorias: 'Deportes,Futbol,Personas,Matematicas',
        imagen : 'imagen.jpg'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ insertado: true });
  });
});