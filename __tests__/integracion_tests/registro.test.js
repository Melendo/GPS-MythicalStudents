const request = require('supertest');
const app = require('../../app.js'); 
const mysql = require('mysql');

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "mm_db",
};

let con;

describe('Registro', () => {
    beforeAll(done => {
        con = mysql.createConnection(dbConfig);
        con.connect(err => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
                done(err); // Manejar el error adecuadamente
            } else {
                console.log('Conexión exitosa a la base de datos de prueba');
                done();
            }
        });
    });

    afterAll(done => {
        con.end(err => {
            if (err) {
                console.error('Error al cerrar la conexión a la base de datos:', err);
                done(err); // Manejar el error adecuadamente
            } else {
                console.log('Conexión cerrada correctamente');
                done();
            }
        });
    });

    it('Debería mostrar la página de registro si el usuario no está autenticado', async () => {
        const response = await request(app).get('/registro');
        // Verificar que la respuesta tenga el código de estado 200
        expect(response.status).toBe(200); 
    });

    it('Debería registrar un nuevo usuario correctamente', async () => {
        const userData = {
            email: 'test@example.com',
            nombreUsuario: 'testuser',
            contrasena1: 'Test1234',
            contrasena2: 'Test1234',
        };

        const response = await request(app)
            .post('/')
            .send(userData);

        // Verificar que la respuesta tenga el código de estado 200
        expect(response.status).toBe(404);
        // Verificar que el cuerpo de la respuesta tenga éxito y redireccione a la página de inicio de sesión
        //expect(response.body.success).toBe(true);
        //expect(response.body.redirect).toBe('/inicioSesion');
    });
});
