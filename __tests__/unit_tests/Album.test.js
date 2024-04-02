const {
    getCromosTotales,
    getCromosPersonales,
    getInfoAlbum
  } = require('../../routes/album.js'); // Reemplaza 'tu_ruta' por la ruta real de tu archivo de funciones
  
  // Define una suite de pruebas para las funciones relacionadas con los álbumes
  describe('Funciones relacionadas con los álbumes', () => {
    // Define una prueba para la función getCromosTotales
    describe('getCromosTotales', () => {
      it('Debería devolver los cromos totales del álbum si la consulta es exitosa', () => {
        const conMock = {
          query: jest.fn((querySql, params, callback) => {
            // Simula una consulta exitosa
            callback(null, [{ id: 1, nombre: 'Cromo 1' }, { id: 2, nombre: 'Cromo 2' }]);
          }),
          release: jest.fn() // Simula el método release
        };
  
        const callback = jest.fn((cromosTotales) => {
          expect(cromosTotales).toEqual([{ id: 1, nombre: 'Cromo 1' }, { id: 2, nombre: 'Cromo 2' }]);
        });
  
        getCromosTotales(1, conMock, callback);
  
        expect(conMock.query).toHaveBeenCalledWith(
          'SELECT * FROM cromos WHERE album = ?',
          [1],
          expect.any(Function)
        );
      });
    });
  
    // Define una prueba para la función getCromosPersonales
    describe('getCromosPersonales', () => {
      it('Debería devolver los cromos personales del álbum si la consulta es exitosa', () => {
        const conMock = {
          query: jest.fn((querySql, params, callback) => {
            // Simula una consulta exitosa
            callback(null, [{ id: 1, nombre: 'Cromo Personal 1' }]);
          }),
          release: jest.fn() // Simula el método release
        };
  
        const callback = jest.fn((cromosPersonales) => {
          expect(cromosPersonales).toEqual([{ id: 1, nombre: 'Cromo Personal 1' }]);
        });
  
        getCromosPersonales(1, conMock, callback);
  
        expect(conMock.query).toHaveBeenCalledWith(
          'SELECT * FROM cromos_personal, cromos WHERE ID_CROMO = ID AND album = ?',
          [1],
          expect.any(Function)
        );
      });
    });
  
    // Define una prueba para la función getInfoAlbum
    describe('getInfoAlbum', () => {
      it('Debería devolver la información del álbum si la consulta es exitosa', () => {
        const conMock = {
          query: jest.fn((querySql, params, callback) => {
            // Simula una consulta exitosa
            callback(null, [{ id: 1, nombre: 'Álbum 1', descripcion: 'Descripción del álbum' }]);
          }),
          release: jest.fn() // Simula el método release
        };
  
        const callback = jest.fn((infoAlbum) => {
          expect(infoAlbum).toEqual([{ id: 1, nombre: 'Álbum 1', descripcion: 'Descripción del álbum' }]);
        });
  
        getInfoAlbum(1, conMock, callback);
  
        expect(conMock.query).toHaveBeenCalledWith(
          'SELECT * FROM album WHERE ID = ?',
          [1],
          expect.any(Function)
        );
      });
    });
  });
  