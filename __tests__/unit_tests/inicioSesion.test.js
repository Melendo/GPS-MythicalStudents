const verificarUsuario = require('../../routes/inicioSesion.js').verificarUsuario;
const bcryptjs = require('bcryptjs');

describe('Función verificarUsuario', () => {

    it('Debería devolver el usuario si las credenciales son válidas', () => {
        const conMock = {
            query: jest.fn((querySql, params, callback) => {
                // Simulamos un usuario en la base de datos
                const usuario = {
                    EMAIL: 'usuario@ejemplo.com',
                    CONTRASEÑA: bcryptjs.hashSync('contraseña123', 10)
                };
                callback(null, [usuario]);
            }),
            release: jest.fn()
        };

        verificarUsuario(conMock, 'usuario@ejemplo.com', 'contraseña123', (result) => {
            expect(result.EMAIL).toBe('usuario@ejemplo.com');
        });
    });

    it('Debería devolver null si las credenciales son inválidas', () => {
        const conMock = {
            query: jest.fn((querySql, params, callback) => {
                // Simulamos un usuario en la base de datos con una contraseña incorrecta
                const usuario = {
                    EMAIL: 'usuario@ejemplo.com',
                    CONTRASEÑA: bcryptjs.hashSync('contraseña123', 10)
                };
                callback(null, [usuario]);
            }),
            release: jest.fn()
        };

        verificarUsuario(conMock, 'usuario@ejemplo.com', 'contraseña456', (result) => {
            expect(result).toBeNull();
        });
    });

    it('Debería devolver null si el usuario no se encuentra en la base de datos', () => {
        const conMock = {
            query: jest.fn((querySql, params, callback) => {
                // Simulamos que no se encontraron resultados en la base de datos
                callback(null, []);
            }),
            release: jest.fn()
        };

        verificarUsuario(conMock, 'usuario@ejemplo.com', 'contraseña123', (result) => {
            expect(result).toBeNull();
        });
    });

    it('Debería manejar correctamente errores en la consulta', () => {
        const conMock = {
            query: jest.fn((querySql, params, callback) => {
                // Simulamos un error en la consulta llamando al callback con un error
                callback(new Error('Error de consulta'), null);
            }),
            release: jest.fn()
        };

        verificarUsuario(conMock, 'usuario@ejemplo.com', 'contraseña123', (result) => {
            expect(result).toBeNull();
        });
    });
});
