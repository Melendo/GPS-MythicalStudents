const getColecciones = require('../../routes/mostrarColecciones.js').getColecciones;

describe('Función getColecciones', () => {
  it('Debería devolver información de las colecciones si la consulta es exitosa', () => {
    // Mockear la conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, callback) => {
        // Simular que la consulta a la base de datos se ejecuta correctamente
        callback(null, [{ ID: 1, NOMBRE: 'Colección 1' }]);
      })
    };

    // Definir la función de callback
    const callback = jest.fn((error, colecciones) => {
      // Verificar que no hay errores
      expect(error).toBeNull();
      // Verificar que se devuelve la información de las colecciones
      expect(colecciones).toEqual([{ ID: 1, NOMBRE: 'Colección 1' }]);
    });

    // Llamar a la función getColecciones con el mock de conexión y el callback
    getColecciones(conMock, callback);

    // Verificar que se hace la consulta SQL adecuada
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM colecciones;',
      expect.any(Function)
    );
  });

  it('Debería pasar un error al callback si la consulta falla', () => {
    // Mockear la conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, callback) => {
        // Simular que la consulta a la base de datos falla
        const error = new Error('Error de consulta');
        callback(error, null);
      }),
    };

    // Definir la función de callback
    const callback = jest.fn((error, colecciones) => {
      // Verificar que se pasa un error al callback
      expect(error.message).toBe('Error de consulta');
      // Verificar que no hay colecciones
      expect(colecciones).toBeNull();
    });

    // Llamar a la función getColecciones con el mock de conexión y el callback
    getColecciones(conMock, callback);

    // Verificar que se hace la consulta SQL adecuada
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM colecciones;',
      expect.any(Function)
    );
  });
  
});




const getColeccionImagen = require('../../routes/mostrarColecciones.js').getColeccionImagen;

describe('Función getColeccionImagen', () => {
  it('Debería devolver la imagen de la colección si la consulta es exitosa', () => {
    // Mockear la conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular una consulta exitosa que devuelve la imagen
        callback(null, [{ IMAGEN: Buffer.from('imagen de prueba') }]);
      })
    };

    // Definir la función de callback
    const callback = jest.fn((error, result) => {
      // Verificar que no hay errores
      expect(error).toBeNull();
      // Verificar que se devuelve la imagen de la colección
      expect(result).toEqual([{ IMAGEN: Buffer.from('imagen de prueba') }]);
    });

    // Llamar a la función getColeccionImagen con el mock de conexión, el ID y el callback
    getColeccionImagen(conMock, 1, callback);

    // Verificar que se hace la consulta SQL adecuada
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT IMAGEN FROM colecciones WHERE ID = ?;',
      [1],
      expect.any(Function)
    );
  });

  it('Debería pasar un error al callback si la consulta falla', () => {
    // Mockear la conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta a la base de datos falla
        const error = new Error('Error de consulta');
        callback(error, null);
      }),
    };

    // Definir la función de callback
    const callback = jest.fn((error, result) => {
      // Verificar que se pasa un error al callback
      expect(error.message).toBe('Error de consulta');
      // Verificar que no hay resultado
      expect(result).toBeNull();
    });

    // Llamar a la función getColeccionImagen con el mock de conexión y el callback
    getColeccionImagen(conMock, 1, callback);

    // Verificar que se hace la consulta SQL adecuada
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT IMAGEN FROM colecciones WHERE ID = ?;',
      [1],
      expect.any(Function)
    );
  });
});
