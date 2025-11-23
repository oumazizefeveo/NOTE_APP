const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Note = require('../src/models/Note');

const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/notes_test';

let token;
let createdNoteId;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Note.deleteMany({});

  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'Password123' });

  expect(userRes.statusCode).toBe(201);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'Password123' });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Notes API', () => {
  test('should create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nouvelle note', content: 'Contenu test', category: 'travail' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Nouvelle note');
    createdNoteId = res.body._id;
  });

  test('should reject note creation without title', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Pas de titre' });

    expect(res.statusCode).toBe(400);
  });

  test('should not allow access without token', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(401);
  });

  test('should list notes', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should filter notes by category', async () => {
    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Note perso', category: 'personnel' });

    const res = await request(app)
      .get('/api/notes')
      .query({ category: 'personnel' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.every(note => note.category === 'personnel')).toBe(true);
  });

  test('should delete a note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Note supprimée');
  });
});
