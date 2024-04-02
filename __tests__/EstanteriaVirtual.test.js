const request = require('supertest');
const express = require('express');
const session = require('express-session');
const estanteriaVirtualRouter = require('../../routes/estanteriaVirtual.js');

// Mock de función para db.getConnection
const mockDbConnection = jest.fn((callback) => {
  // Simular que la consulta a la base de datos se ejecuta correctamente sin devolver datos específicos
  callback(null, {
    query: jest.fn(),
    release: jest.fn(),
  });
});

describe('Routes de Estanteria Virtual', () => {
  let app;

  beforeEach(() => {
    app = express();

    // Simular la sesión del usuario con datos de álbumes
    app.use((req, res, next) => {
      req.session = {
        user: { MONEDAS: 1000 },
        albumes: [{ ID_ALBUM: 1 }, { ID_ALBUM: 2 }],
      };
      next();
    });

    // Ruta para la estantería virtual
    app.use('/estanteriaVirtual', estanteriaVirtualRouter);

    // Configurar el motor de plantillas EJS
    app.set('view engine', 'ejs');

    // Mockear db.getConnection en la ruta
    jest.mock('../../connection/connection.js', () => ({
      getConnection: mockDbConnection,
    }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Debería devolver una respuesta exitosa con datos simulados para /', async () => {
    const response = await request(app).get('/estanteriaVirtual');
    expect(response.status).toBe(200);
    //REDIRIGE A OTRO HTML
  });

  it('Debería devolver una imagen con datos simulados para /imagen:id', async () => {
    // Mockear la consulta a la base de datos para la imagen
    mockDbConnection.mockImplementationOnce((callback) => {
      // Simular que la consulta a la base de datos se ejecuta correctamente
      callback(null, {
        query: jest.fn(),
        release: jest.fn(),
      });
    });

    // Realizar la solicitud GET a la ruta de la estantería virtual con un ID de imagen simulado
    const response = await request(app).get('/estanteriaVirtual/imagen1');

    // Verificar el código de estado de la respuesta
    expect(response.status).toBe(200);

    // Verificar que se devuelva la imagen
    // Aquí puedes agregar más expectativas si necesitas verificar otros aspectos de la respuesta
  });
});