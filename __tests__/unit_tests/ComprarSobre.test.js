/*
      TESTS UNITARIOS
      ----------------
*/


// -----------------PROBANDO FUNCION OBTENER SOBRE-----------------------------------
const obtenerSobre = require('../../routes/comprarSobre.js').obtenerSobre;

describe('Función obtenerSobre', () => {
  it('Debería devolver información del sobre si la consulta es exitosa', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(null, [{ id: 1, nombre: 'Sobre de ejemplo' }]);
      }),
      release: jest.fn() 
    };


    const callback = jest.fn((sobre) => {
      expect(sobre).toEqual({ id: 1, nombre: 'Sobre de ejemplo' });
    });

   
    obtenerSobre(conMock, 1, callback);

   
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM sobre WHERE ID = ?',
      [1],
      expect.any(Function)
    );
  });

  
  it('Debería lanzar un error si la consulta falla', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

   
    expect(() => obtenerSobre(conMock, 1, () => {})).toThrow('Error de consulta');

   
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM sobre WHERE ID = ?',
      [1],
      expect.any(Function)
    );
  });
});






// -----------------PROBANDO FUNCION COMPROBAR ALBUM ----------------------------------
const comprobarAlbum = require('../../routes/comprarSobre.js').comprobarAlbum;


describe('Función comprobarAlbum', () => {
  
  it('Debería devolver los álbumes del usuario si la consulta es exitosa', () => {
   
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        
        callback(null, [{ id: 1, nombre: 'Álbum de ejemplo' }]);
      }),
      release: jest.fn() 
    };

   
    const callback = jest.fn((albumesResult) => {
      expect(albumesResult).toEqual([{ id: 1, nombre: 'Álbum de ejemplo' }]);
    });

   
    comprobarAlbum(conMock, 1, { ALBUM: 1 }, callback);

   
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?',
      [1, 1],
      expect.any(Function)
    );
  });

 
  it('Debería lanzar un error si la consulta falla', () => {
   
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    
    expect(() => comprobarAlbum(conMock, 1, { ALBUM: 1 }, () => {})).toThrow('Error de consulta');

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT * FROM album_personal WHERE ID_USU = ? AND ID_ALBUM = ?',
      [1, 1],
      expect.any(Function)
    );
  });
});






//--------------PROBANDO FUNCION RESTAR MONEDAS-----------------------------

const restarMonedas = require('../../routes/comprarSobre.js').restarMonedas; 


describe('Función restarMonedas', () => {
  
  it('Debería restar las monedas del usuario correctamente si la consulta es exitosa', (done) => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(null);
      }),
      release: jest.fn() 
    };

   
    const callback = jest.fn(() => {
      
      expect(callback).toHaveBeenCalled();
      done(); 
    });

    
    restarMonedas(conMock, 50, 1, callback);

   
    expect(conMock.query).toHaveBeenCalledWith(
      'UPDATE usuario SET MONEDAS = ? WHERE ID = ?',
      [50, 1],
      expect.any(Function)
    );
  });

  
  it('Debería lanzar un error si la consulta falla', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    
    expect(() => restarMonedas(conMock, 50, 1, () => {})).toThrow('Error de consulta');

   
    expect(conMock.query).toHaveBeenCalledWith(
      'UPDATE usuario SET MONEDAS = ? WHERE ID = ?',
      [50, 1],
      expect.any(Function)
    );
  });
});






//--------------PROBANDO FUNCION ABRIR SOBRE-----------------------------

const abrirSobre = require('../../routes/comprarSobre.js').abrirSobre; 

describe('Función abrirSobre', () => {
  it('Debería devolver el número total de cromos en el álbum si la consulta es exitosa', (done) => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        
        callback(null, [{ 'COUNT(*)': 10 }]); 
      }),
      release: jest.fn() 
    };

  
    const callback = jest.fn((totalCromos) => {
      
      expect(totalCromos['COUNT(*)']).toBe(10); 
      done(); 
    });

    
    abrirSobre(conMock, { ALBUM: 1 }, callback);

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) FROM cromos WHERE ALBUM = ?',
      [1],
      expect.any(Function)
    );
  });

  it('Debería lanzar un error si la consulta falla', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
       
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    
    expect(() => abrirSobre(conMock, { ALBUM: 1 }, () => {})).toThrow('Error de consulta');

    
    expect(conMock.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) FROM cromos WHERE ALBUM = ?',
      [1],
      expect.any(Function)
    );
  });
});






//--------------PROBANDO FUNCION GENERAR NUMEROS ALEATORIOS -----------------------------

const generarNumerosAleatorios = require('../../routes/comprarSobre.js').generarNumerosAleatorios;

describe('Función generarNumerosAleatorios', () => {
  it('Debería generar la cantidad correcta de números aleatorios', () => {
    const maximo = 10;
    const cantidad = 5;

    generarNumerosAleatorios(maximo, cantidad, (numeros) => {
     
      expect(numeros.length).toBe(cantidad);

      
      numeros.forEach((numero) => {
        expect(numero).toBeGreaterThanOrEqual(1); // Verifica que sea mayor o igual a 1
        expect(numero).toBeLessThanOrEqual(maximo); // Verifica que sea menor o igual al máximo
      });
    });
  });
});








//--------------PROBANDO FUNCION PROCESAR CROMOS -----------------------------
const procesarCromos = require('../../routes/comprarSobre.js').procesarCromos;

describe('Función procesarCromos', () => {
    it('Debería procesar los cromos obtenidos del sobre', (done) => {
      
      const conMock = {
        query: jest.fn((querySql, params, callback) => {
          
          if (querySql === 'SELECT * FROM cromos_personal WHERE ID_CROMO = ?') {
            // Simula que no hay cromos para el ID de cromo 2
            if (params[0] === 2) {
              callback(null, []); // Simula que no hay resultados
            } else {
              // Simula que hay resultados para cualquier otro ID de cromo
              callback(null, [{ 'ID_USU': 1, 'ID_CROMO': params[0], 'CANTIDAD': 1 }]);
            }
          } else if (querySql === 'UPDATE cromos_personal SET CANTIDAD = CANTIDAD + 1 WHERE ID_USU = ? AND ID_CROMO = ?') {
            // Simula una actualización exitosa
            callback(null);
          } else if (querySql === 'INSERT INTO cromos_personal (ID_USU, ID_CROMO, CANTIDAD) VALUES (?, ?, 1)') {
            // Simula una inserción exitosa
            callback(null);
          } else {
            // Simula cualquier otro tipo de consulta
            callback(new Error('Consulta no reconocida'));
          }
        }),
        release: jest.fn() // Simula el método release
      };
  
     
      const callback = jest.fn(() => {
        
        expect(conMock.query).toHaveBeenCalledWith(
          'SELECT * FROM cromos_personal WHERE ID_CROMO = ?',
          [1], 
          expect.any(Function)
        );
        expect(conMock.query).toHaveBeenCalledWith(
          'SELECT * FROM cromos_personal WHERE ID_CROMO = ?',
          [2], 
          expect.any(Function)
        );
        expect(conMock.query).toHaveBeenCalledWith(
          'SELECT * FROM cromos_personal WHERE ID_CROMO = ?',
          [3], 
          expect.any(Function)
        );
        expect(conMock.query).toHaveBeenCalledWith(
          'UPDATE cromos_personal SET CANTIDAD = CANTIDAD + 1 WHERE ID_USU = ? AND ID_CROMO = ?',
          [1, 1], 
          expect.any(Function)
        );
        expect(conMock.query).toHaveBeenCalledWith(
          'UPDATE cromos_personal SET CANTIDAD = CANTIDAD + 1 WHERE ID_USU = ? AND ID_CROMO = ?',
          [1, 3], 
          expect.any(Function)
        );
        expect(conMock.query).toHaveBeenCalledWith(
          'INSERT INTO cromos_personal (ID_USU, ID_CROMO, CANTIDAD) VALUES (?, ?, 1)',
          [1, 2], 
          expect.any(Function)
        );
        done(); 
      });
  
        procesarCromos(conMock, 1, [1, 2, 3], callback);
    });
  });





/*
      TESTS INTEGRACION
      ----------------
*/



//--------------PROBANDO FUNCION PRINCIPAL RUTA POST -----------------------------

const express = require('express');
const request = require('supertest');
const router = require('../../routes/comprarSobre.js');

describe('POST /:id', () => {
    it('Debería devolver un mensaje de éxito si la compra se realiza correctamente', async () => {
      // Simula los datos necesarios para la solicitud
      const idSobre = 1; // Por ejemplo, un ID de sobre válido
      const idUsuario = 1; // ID de usuario válido
      const monUsuario = 1000; // Monedas del usuario suficientes
      const datosSobre = { PRECIO: 150, ALBUM: 1, NUM_CROMOS: 5 }; // Actualizado: "Álbum de ejemplo" reemplazado por 1
  
      // Crear un objeto de solicitud simulado
      const app = express();
      app.use(express.json());
  
      // Simular middleware de sesión
      app.use((req, res, next) => {
        req.session = {
          user: {
            ID: idUsuario,
            MONEDAS: monUsuario
          }
        };
        next();
      });
  
      app.use(router); // Agregar el router al objeto de la aplicación
  
      // Realiza una solicitud POST a la ruta que deseas probar y pasa los datos simulados
      const response = await request(app)
        .post(`/${idSobre}`)
        .send(); // No necesitas enviar datos de sesión, ya que están simulados
      
    
      // Verifica el código de estado de la respuesta


      expect(response.status).toBe(200);
  
      // Verifica el cuerpo de la respuesta
      expect(response.body).toEqual({ success: true, mensaje: "Compra realizada correctamente", album: 1, numeros: expect.any(Array) }); // Actualizado: 'Álbum de ejemplo' reemplazado por 1
    });
  });