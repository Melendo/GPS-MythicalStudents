const request = require('supertest');
const app = require('../../app.js');
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');
const fs = require('fs');

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

});


async function cleanUpTestData() {
    // Abrir la conexión a la base de datos
    con = mysql.createConnection(dbConfig);
    con.connect();
    // Eliminación de datos de prueba
    const deleteQuery = "DELETE FROM usuario WHERE EMAIL LIKE '%@example.com'";
    //const userEmail = ['test@example.com', 'test1@example.com']; // Correo electrónico del usuario de prueba insertado

    await new Promise((resolve, reject) => {
        con.query(deleteQuery, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });

    // Cerrar la conexión a la base de datos
    con.end();
}

async function insertTestData() {
    // Abrir la conexión a la base de datos
    con = mysql.createConnection(dbConfig);
    con.connect();
    // Inserción de datos de prueba
    const insertQuery = 'INSERT INTO usuario (EMAIL, NOMBRE_USUARIO, CONTRASEÑA, MONEDAS) VALUES (?, ?, ?, ?)';
    const userData = ['test1@example.com', 'test1_user', await bcryptjs.hash('Test1234', 8), 100];

    await new Promise((resolve, reject) => {
        con.query(insertQuery, userData, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });

    // Cerrar la conexión a la base de datos
    con.end();
}

describe('POST /', () => {

    beforeEach(async () => {
        // Insertar datos de prueba en la base de datos antes de cada test
        await insertTestData();
    });

    afterEach(async () => {
        // Limpiar datos de prueba en la base de datos después de cada test
        await cleanUpTestData();
    });
    it('should respond with success when valid data is provided', async () => {
        // Realizar la solicitud HTTP POST con datos válidos y una foto simulada adjunta
        const response = await request(app)
            .post('/registro')
            .field('email', 'test2@example.com')
            .field('nombreUsuario', 'test2_user')
            .field('contrasena1', 'Test1234')
            .field('contrasena2', 'Test1234')

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, redirect: '/inicioSesion' });
    });

    it('should respond with error when email is already registered', async () => {
        // Realizar la solicitud HTTP POST con un email ya registrado
        const response = await request(app)
            .post('/registro')
            .field('email', 'test1@example.com')
            .field('nombreUsuario', 'test1_user')
            .field('contrasena1', 'Test1234')
            .field('contrasena2', 'Test1234')

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            mensajeError: [{ msg: 'Ese email ya está registrado' }]
        });
    });

    it('should respond with error when username is already taken', async () => {
        // Realizar la solicitud HTTP POST con un nombre de usuario ya tomado
        const response = await request(app)
            .post('/registro')
            .field('email', 'test2@example.com')
            .field('nombreUsuario', 'test1_user')
            .field('contrasena1', 'Test1234')
            .field('contrasena2', 'Test1234')

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            mensajeError: [{ msg: 'El Nombre de Usuario ya existe' }]
        });
    });
});