// -----------------PROBANDO FUNCION COMPROBAR ALBUM -----------------------------------
const comprobarAlbum = require('../../routes/agregarAlbum.js').comprobarAlbum;

describe('Función comprobarAlbum', () => {
  it('Debería devolver los álbumes del usuario si la consulta es exitosa', (done) => {
    // Mock de conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(null, [{ ID_USU: 1, ID_ALBUM: 1 }, { ID_USU: 1, ID_ALBUM: 2 }]);
      }),
      release: jest.fn() 
    };

    // Función de retorno de la llamada (callback)
    const callback = jest.fn((albumesResult) => {
      expect(albumesResult).toEqual([{ ID_USU: 1, ID_ALBUM: 1 }, { ID_USU: 1, ID_ALBUM: 2 }]);
      done(); 
    });

    // Llamada a la función que se está probando
    comprobarAlbum(conMock, 1, 1, callback);

    // Verificar la consulta SQL realizada por la función
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?',
      [1, 1], 
      expect.any(Function)
    );
  });

  it('Debería devolver un error si la consulta falla', (done) => {
    // Mock de conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    // Llamada a la función que se está probando
    comprobarAlbum(conMock, 1, 1, (error) => {
      expect(error).toBeDefined();
      done(); 
    });

    // Verificar la consulta SQL realizada por la función
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?',
      [1, 1],
      expect.any(Function) 
    );
  });
});





// -----------------PROBANDO FUNCION AGREGAR ALBUM -----------------------------------
const agregarAlbum = require('../../routes/agregarAlbum.js').agregarAlbum;

describe('Función agregarAlbum', () => {
  it('Debería agregar un álbum al usuario si la inserción es exitosa', (done) => {
    // Mock de conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simula una inserción exitosa
        callback(null, { insertId: 1 });
      }),
      release: jest.fn() 
    };

    // Función de retorno de la llamada (callback)
    const callback = jest.fn((insertarAlbumResult) => {
      // Verifica que se haya devuelto el resultado esperado
      expect(insertarAlbumResult).toEqual({ insertId: 1 });
      done(); 
    });

    // Llamada a la función que se está probando
    agregarAlbum(conMock, 1, 1, callback);

    // Verificar la consulta SQL realizada por la función
    expect(conMock.query).toHaveBeenCalledWith(
      'INSERT INTO album_personal (ID_USU, ID_ALBUM) VALUES (?, ?) ',
      [1, 1], 
      expect.any(Function)
    );
  });

  it('Debería devolver un error si la inserción falla', (done) => {
    // Mock de conexión a la base de datos
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simula un error de inserción
        callback(new Error('Error de inserción'), null);
      }),
      release: jest.fn() 
    };

    // Llamada a la función que se está probando
    agregarAlbum(conMock, 1, 1, (error) => {
      // Verifica que se haya devuelto un error
      expect(error).toBeDefined();
      done(); 
    });

    // Verificar la consulta SQL realizada por la función
    expect(conMock.query).toHaveBeenCalledWith(
      'INSERT INTO album_personal (ID_USU, ID_ALBUM) VALUES (?, ?) ',
      [1, 1],
      expect.any(Function) 
    );
  });
});
