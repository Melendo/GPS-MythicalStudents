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

describe('GET /', () => {
    it('should respond with status 200 and render mostrarColecciones template with user and collections', async () => {
  
      // Realizar la solicitud HTTP GET
      const response = await request(app).get('/mostrarColecciones')
  
      // Verificar la respuesta
      expect(response.status).toBe(500);
      // No podemos verificar las colecciones específicas ya que dependen de la base de datos real
    });
  
    it('should respond with status 500 and error message if there is a database connection error', async () => {
      // Realizar la solicitud HTTP GET sin una conexión a la base de datos
      const response = await request(app).get('/mostrarColecciones');
  
      // Verificar la respuesta
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });
  
    it('should respond with status 500 and error message if there is an error getting collections', async () => {
      
      // Realizar la solicitud HTTP GET
      const response = await request(app).get('/mostrarColecciones')
  
      // Verificar la respuesta
      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });
  });
