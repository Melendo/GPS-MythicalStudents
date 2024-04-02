/*
      TEST INTEGRACION
      ----------------
*/


/*const actualizarMonedas = require('../../routes/actualizarMonedas.js').actualizarMonedas;

describe('Función actualizarMonedas', () => {
  it('Debería actualizar el número total de monedas correctamente si la consulta es exitosa', (done) => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        callback(null);
      }),
      release: jest.fn() 
    };

   
    actualizarMonedas(1, 10, (error) => {
      
      expect(error).toBeUndefined();
      done(); 
    }, conMock); 

   
    expect(conMock.query).toHaveBeenCalledWith(
      'UPDATE usuario SET MONEDAS = MONEDAS + ? WHERE ID = ?',
      [10, 1],
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

  
    actualizarMonedas(1, 10, (error) => {
      
      expect(error).toBeDefined();
      done(); 
    }, conMock); 

    expect(conMock.query).toHaveBeenCalledWith(
      'UPDATE usuario SET MONEDAS = MONEDAS + ? WHERE ID = ?',
      [10, 1],
      expect.any(Function)
    );
  });
});*/