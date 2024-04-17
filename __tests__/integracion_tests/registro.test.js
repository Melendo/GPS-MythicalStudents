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
        done.fail(err);
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
        done.fail(err);
      } else {
        console.log('Conexión cerrada correctamente');
        done();
      }
    });
  });

  it('Debería mostrar la página de registro si el usuario no está autenticado', async () => {
    
    const response = await request(app).get('/registro');
    expect(response.status).toBe(200); 
  });
});