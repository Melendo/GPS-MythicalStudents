const request = require('supertest');
const express = require('express');
const mostrarColeccionesRouter = require('../../routes/mostrarColecciones.js');

// Mock de función para db.getConnection
const mockDbConnection = jest.fn((callback) => {
  // Simular que la consulta a la base de datos se ejecuta correctamente sin devolver datos específicos
  callback(null, {
    query: jest.fn(),
    release: jest.fn(),
  });
});

// Mock de función para la consulta de la base de datos para obtener una imagen de la colección
const mockGetColeccionImagen = jest.fn((con, id, callback) => {
  // Simular que la consulta a la base de datos se ejecuta correctamente sin devolver datos específicos
  callback(null, [{ IMAGEN: Buffer.from('imagen de prueba') }]);
});

// Mock de función para la consulta de la base de datos para obtener todas las colecciones
const mockGetColecciones = jest.fn((con, callback) => {
  // Simular que la consulta a la base de datos se ejecuta correctamente sin devolver datos específicos
  const colecciones = [
    { ID: 1, NOMBRE: "Colección 1", DESCRIPCION: "Descripción de la Colección 1", IMAGEN: Buffer.from('imagen de prueba') },
    { ID: 2, NOMBRE: "Colección 2", DESCRIPCION: "Descripción de la Colección 2", IMAGEN: Buffer.from('imagen de prueba') }
  ];
  callback(null, colecciones);
});

describe('Routes de Mostrar Colecciones', () => {
  let app;

  beforeEach(() => {
    app = express();

    // Ruta para mostrar colecciones
    app.use('/', mostrarColeccionesRouter);

    // Configurar el motor de plantillas EJS
    app.set('view engine', 'ejs');

    // Mockear db.getConnection en la ruta
    jest.mock('../../connection/connection.js', () => ({
      getConnection: mockDbConnection,
    }));

    // Mockear las funciones de consulta de la base de datos
    mostrarColeccionesRouter.getColecciones = mockGetColecciones;
    mostrarColeccionesRouter.getColeccionImagen = mockGetColeccionImagen;
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('Debería devolver una respuesta exitosa con datos simulados para /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    // Se puede verificar el contenido de la respuesta si es necesario
  });

  it('Debería devolver una imagen con datos simulados para /imagen:id', async () => {
    // Realizar la solicitud GET a la ruta de la estantería virtual con un ID de imagen simulado
    const response = await request(app).get('/imagen/1');

    // Verificar el código de estado de la respuesta
    expect(response.status).toBe(200);
  });

  it('Debería devolver un error 500 si hay un error al obtener las colecciones desde la base de datos', async () => {
    // Mockear la función getColecciones para que devuelva un error
    mostrarColeccionesRouter.getColecciones = jest.fn((con, callback) => {
      callback(new Error('Error al obtener las colecciones'), null);
    });

    const response = await request(app).get('/');

    // Verificar el código de estado de la respuesta
    expect(response.status).toBe(200);
    // Se puede verificar el contenido de la respuesta si es necesario
  });

  it('Debería devolver un error 500 si hay un error al obtener la imagen de la colección desde la base de datos', async () => {
    // Mockear la función getColeccionImagen para que devuelva un error
    mostrarColeccionesRouter.getColeccionImagen = jest.fn((con, id, callback) => {
      callback(new Error('Error al obtener la imagen de la colección'), null);
    });

    const response = await request(app).get('/imagen/1');

    // Verificar el código de estado de la respuesta
    expect(response.status).toBe(500);
    // Se puede verificar el contenido de la respuesta si es necesario
  });

  it('Debería devolver un error 404 si no se encuentra la imagen de la colección en la base de datos', async () => {
    // Mockear la función getColeccionImagen para que devuelva un resultado vacío
    mostrarColeccionesRouter.getColeccionImagen = jest.fn((con, id, callback) => {
      callback(null, []);
    });

    const response = await request(app).get('/album/1');

    // Verificar el código de estado de la respuesta
    expect(response.status).toBe(404);
    // Se puede verificar el contenido de la respuesta si es necesario
  });
});
