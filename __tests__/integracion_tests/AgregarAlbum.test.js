const request = require('supertest');
const app = require('../../app.js'); // Asegúrate de que esta ruta sea correcta

// Simula un usuario no autenticado
const unauthenticatedUser = { ID: null };
app.use((req, res, next) => {
    req.session.user = unauthenticatedUser;
    next();
});

describe('Registro', () => {
  it('Debería mostrar la página de registro si el usuario no está autenticado', async () => {
    const response = await request(app).get('/registro');
    // Verifica que la respuesta tenga el código de estado 200
    expect(response.status).toBe(200); 
  });
});
