const request = require('supertest');
const express = require('express');
const router = require('../../routes/crearColeccion.js');

jest.mock('../../connection/connection.js', () => ({
  getConnection: jest.fn((callback) => {
    const mockConnection = {
      query: jest.fn((query, params, callback) => {
        if (query === 'INSERT INTO mm_coleccion (nombre, imagen, descripcion) VALUES (?, ?, ?)') {
          callback(null, { insertId: 1 });
        } else if (query === 'SELECT MAX(id) AS id FROM mm_coleccion') {
          callback(null, [{ id: 1 }]);
        } else if (query === 'SELECT id FROM mm_categorias WHERE categoria IN (?)') {
          callback(null, [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
        } else if (query === 'INSERT INTO mm_categorias_coleccion (id_coleccion, id_categoria) VALUES (?, ?)') {
          callback(null, [{ id: 1 }, {id: 2 }]);
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
  it('Debería devolver un error por lo que el cuerpo del json es vacio', async () => {
    const response = await request(app)
      .post('/insertarColeccion')
      .send({
        nombre: 'Nueva Colección',
        descripcion: 'Descripción de la nueva colección',
        categorias: 'Deportes,Futbol,Personas,Matematicas',
        imagen: null
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
  });
});