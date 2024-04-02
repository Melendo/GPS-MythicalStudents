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
   
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(null, [{ id: 1, nombre: 'Cromo personal 1' }, { id: 2, nombre: 'Cromo personal 2' }]);
      }),
      release: jest.fn()
    };

    
    const callback = jest.fn((error, cromosPersonales) => {
     
      expect(error).toBeNull();
      
      expect(cromosPersonales).toEqual([{ id: 1, nombre: 'Cromo personal 1' }, { id: 2, nombre: 'Cromo personal 2' }]);
      done(); 
    });

    
    getCromosPersonales('album1', conMock, callback);

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM cromos_personal, cromos WHERE ID_CROMO = ID AND album = ?;',
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

   
    getCromosPersonales('album1', conMock, (error, cromosPersonales) => {
      
      expect(error).toBeDefined();
      
      expect(cromosPersonales).toBeNull();
      done(); 
    });

   
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM cromos_personal, cromos WHERE ID_CROMO = ID AND album = ?;',
      ['album1'],
      expect.any(Function)
    );
  });
});









// -----------------PROBANDO FUNCION CROMOS PERSONALES-----------------------------------

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