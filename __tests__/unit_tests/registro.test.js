//---------------------- PROBANDO VERIFICAR EMAIL---------------
const verificarEmail = require('../../routes/registro.js').verificarEmail;

describe('Función verificarEmail', () => {
  
  it('Debería devolver true si el correo electrónico no está en uso', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(null, []); 
      }),
      release: jest.fn() 
    };

    return verificarEmail(conMock, 'correo@ejemplo.com')
      .then(result => {
        expect(result).toBe(true);
      })
      .catch(error => {
        expect(error).toBeNull();
      });
  });

  it('Debería devolver false si el correo electrónico está en uso', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(null, [{/* Usuario encontrado */}]); 
      }),
      release: jest.fn() 
    };

    return verificarEmail(conMock, 'correo@ejemplo.com')
      .then(result => {
        expect(result).toBe(false);
      })
      .catch(error => {
        expect(error).toBeNull();
      });
  });

  it('Debería rechazar la promesa si la consulta falla', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    return verificarEmail(conMock, 'correo@ejemplo.com')
      .then(result => {
        expect(result).toBeNull();
      })
      .catch(error => {
        expect(error.message).toBe('Error de consulta');
      });
  });
});



//---------------------- PROBANDO VERIFICAR NOMBRE USUARIO---------------
const verificarNombreUsuario =  require('../../routes/registro.js').verificarNombreUsuario;

describe('Función verificarNombreUsuario', () => {
  
  it('Debería devolver true si el nombre de usuario no está en uso', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que no se encontraron resultados (nombre de usuario no está en uso)
        callback(null, []); 
      }),
      release: jest.fn() 
    };

    return verificarNombreUsuario(conMock, 'nombreUsuario')
      .then(result => {
        expect(result).toBe(true);
      })
      .catch(error => {
        // Si hay un error inesperado, forzar que el test falle
        expect(error).toBeNull();
      });
  });

  it('Debería devolver false si el nombre de usuario está en uso', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que se encontraron resultados (nombre de usuario en uso)
        callback(null, [{/* Usuario encontrado */}]); 
      }),
      release: jest.fn() 
    };

    return verificarNombreUsuario(conMock, 'nombreUsuario')
      .then(result => {
        expect(result).toBe(false);
      })
      .catch(error => {
        expect(error).toBeNull();
      });
  });

  it('Debería rechazar la promesa si la consulta falla', () => {
    
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular un error en la consulta
        callback(new Error('Error de consulta'), null);
      }),
      release: jest.fn() 
    };

    return verificarNombreUsuario(conMock, 'nombreUsuario')
      .then(result => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(result).toBeNull();
      })
      .catch(error => {
        // Verificar que la promesa se haya rechazado con el error esperado
        expect(error.message).toBe('Error de consulta');
      });
  });
});