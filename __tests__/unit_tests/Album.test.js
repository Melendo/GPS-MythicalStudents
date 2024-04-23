/*
      TESTS UNITARIOS
      ----------------
*/


// -----------------PROBANDO FUNCION CROMOS TOTALES-----------------------------------
const getCromosTotales = require('../../routes/album.js').getCromosTotales;

describe('Función getCromosTotales', () => {
  it('Debería devolver los cromos totales del álbum si la consulta es exitosa', (done) => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(null, [{ id: 1, nombre: 'Cromo 1' }, { id: 2, nombre: 'Cromo 2' }]);
      }),
      release: jest.fn() 
    };

   
    const callback = jest.fn((error, cromosTotales) => {
     
      expect(error).toBeNull();
      expect(cromosTotales).toEqual([{ id: 1, nombre: 'Cromo 1' }, { id: 2, nombre: 'Cromo 2' }]);
      done(); 
    });

   
    getCromosTotales('album1', conMock, callback);

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM cromos WHERE album = ?;',
      ['album1'], 
      expect.any(Function) 
    );
  });

  it('Debería devolver un error si la consulta falla', (done) => {
   
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

  
    getCromosTotales('album1', conMock, (error, cromosTotales) => {
      
      expect(error).toBeDefined();
      expect(cromosTotales).toBeNull();
      done(); 
    });

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM cromos WHERE album = ?;',
      ['album1'],
      expect.any(Function) 
    );
  });
});









// -----------------PROBANDO FUNCION CROMOS PERSONALES-----------------------------------
const getCromosPersonales = require('../../routes/album.js').getCromosPersonales;

describe('Función getCromosPersonales', () => {
  it('Debería devolver los cromos personales del álbum si la consulta es exitosa', (done) => {
    // Simulación del objeto de conexión
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simula una consulta exitosa
        callback(null, [{ id: 1, nombre: 'Cromo personal 1' }, { id: 2, nombre: 'Cromo personal 2' }]);
      }),
      release: jest.fn() // Simula el método release
    };

    // Función de callback
    const callback = jest.fn((error, cromosPersonales) => {
      // Verifica que no haya error
      expect(error).toBeNull();
      // Verifica los resultados de la consulta
      expect(cromosPersonales).toEqual([{ id: 1, nombre: 'Cromo personal 1' }, { id: 2, nombre: 'Cromo personal 2' }]);
      done(); // Indica que el test ha finalizado
    });

    // Llama a la función a probar con los mocks
    getCromosPersonales('usuario1', 'album1', conMock, callback);

    // Verifica que se llame a la consulta con los parámetros adecuados
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT c.*, cp.* FROM cromos c JOIN cromos_personal cp ON c.ID = cp.ID_CROMO WHERE cp.ID_USU = ? AND c.ALBUM = ?;',
      ['usuario1', 'album1'],
      expect.any(Function)
    );
  });

  it('Debería devolver un error si la consulta falla', (done) => {
    // Simulación del objeto de conexión
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simula un error en la consulta
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() // Simula el método release
    };

    // Llama a la función a probar con los mocks
    getCromosPersonales('usuario1', 'album1', conMock, (error, cromosPersonales) => {
      // Verifica que se reciba un error
      expect(error).toBeDefined();
      // Verifica que los cromos personales sean nulos
      expect(cromosPersonales).toBeNull();
      done(); // Indica que el test ha finalizado
    });

    // Verifica que se llame a la consulta con los parámetros adecuados
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT c.*, cp.* FROM cromos c JOIN cromos_personal cp ON c.ID = cp.ID_CROMO WHERE cp.ID_USU = ? AND c.ALBUM = ?;',
      ['usuario1', 'album1'],
      expect.any(Function)
    );
  });
});








// -----------------PROBANDO FUNCION INFO ALBUMES-----------------------------------

const getInfoAlbum = require('../../routes/album.js').getInfoAlbum;

describe('Función getInfoAlbum', () => {
  it('Debería devolver la información del álbum si la consulta es exitosa', (done) => {
   
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        
        callback(null, [{ id: 1, nombre: 'Álbum de ejemplo', fechaLanzamiento: '2022-01-01' }]);
      }),
      release: jest.fn() 
    };

    
    const callback = jest.fn((error, infoAlbum) => {
      
      expect(error).toBeNull();
     
      expect(infoAlbum).toEqual([{ id: 1, nombre: 'Álbum de ejemplo', fechaLanzamiento: '2022-01-01' }]);
      done(); 
    });

    
    getInfoAlbum(1, conMock, callback);

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM album WHERE ID = ?;',
      [1],
      expect.any(Function)
    );
  });

  it('Debería devolver un error si la consulta falla', (done) => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    
    getInfoAlbum(1, conMock, (error, infoAlbum) => {
      
      expect(error).toBeDefined();
      
      expect(infoAlbum).toBeNull();
      done(); 
    });

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM album WHERE ID = ?;',
      [1],
      expect.any(Function)
    );
  });
});