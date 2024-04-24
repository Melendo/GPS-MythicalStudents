const request = require('supertest');
const app = require('../../app.js');
const mysql = require('mysql');
var bcryptjs = require('bcryptjs')


const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "mm_db",
};

let con;

describe('Inicio Sesion', () => {
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

    it('Debería mostrar la página de Login si el usuario no está autenticado', async () => {
        const response = await request(app).get('/inicioSesion');
        // Verificar que la respuesta tenga el código de estado 200
        expect(response.status).toBe(200);
    });
});

async function insertTestData() {
    // Abrir la conexión a la base de datos
    con = mysql.createConnection(dbConfig);
    con.connect();
    // Inserción de datos de prueba
    const insertQuery = 'INSERT INTO usuario (EMAIL, NOMBRE_USUARIO, CONTRASEÑA, MONEDAS) VALUES (?, ?, ?, ?)';
    const userData = ['test@example.com', 'johndoe', await bcryptjs.hash('Test1234', 8), 100];

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

async function cleanUpTestData() {
    // Abrir la conexión a la base de datos
    con = mysql.createConnection(dbConfig);
    con.connect();
    // Eliminación de datos de prueba
    const deleteQuery = "DELETE FROM usuario WHERE EMAIL LIKE '%@example.com'";

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

describe('POST /', () => {
    beforeEach(async () => {
        // Insertar datos de prueba en la base de datos antes de cada test
        await insertTestData();
    });

    afterEach(async () => {
        // Limpiar datos de prueba en la base de datos después de cada test
        await cleanUpTestData();
    });
    it('should respond with success when valid email and password are provided', async () => {
        // Datos de prueba
        const email = 'test@example.com';
        const password = 'Test1234';

        // Realizar la solicitud HTTP POST
        const response = await request(app)
            .post('/inicioSesion')
            .send({ email: email, contrasena: password });

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, redirect: '/' });
    });

    it('should respond with error when invalid email is provided', async () => {
        // Datos de prueba con un correo electrónico inválido
        const email = 'invalid_email';
        const password = 'Test1234';

        // Realizar la solicitud HTTP POST
        const response = await request(app)
            .post('/inicioSesion')
            .send({ email, contrasena: password });

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "mensajeError": [
                {
                    "location": "body",
                    "msg": "Por favor, ingrese un correo electrónico válido.",
                    "path": "email",
                    "type": "field",
                    "value": "invalid_email",
                },
            ],
            "success": false,
        });
    });

    it('should respond with error when invalid password is provided', async () => {
        // Datos de prueba con una contraseña inválida
        const email = 'test@example.com';
        const password = 'invalidpassword';

        // Realizar la solicitud HTTP POST
        const response = await request(app)
            .post('/inicioSesion')
            .send({ email, contrasena: password });

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "mensajeError": [
                {
                    "location": "body",
                    "msg": "La contraseña debe tener al menos una minúscula, una mayúscula, un número y ser de al menos 4 caracteres de longitud.",
                    "path": "contrasena",
                    "type": "field",
                    "value": "invalidpassword",
                },
            ],
            "success": false,
        });
    });

    it('should respond with error when user is not found', async () => {
        // Datos de prueba con un usuario no encontrado en la base de datos
        const email = 'nonexistent@example.com';
        const password = 'Test1234';

        // Realizar la solicitud HTTP POST
        const response = await request(app)
            .post('/inicioSesion')
            .send({ email, contrasena: password });

        // Verificar la respuesta
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "mensajeError": [
                {
                    "msg": "Usuario o contraseña incorrectos",
                },
            ],
            success: false,
        });
    });
});
