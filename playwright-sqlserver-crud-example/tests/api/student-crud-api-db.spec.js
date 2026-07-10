const { test, expect } = require('@playwright/test');
const {
  getStudentById,
  deleteStudentByEmail
} = require('../helpers/db.helper');

test.describe('Student CRUD through API with SQL Server validation', () => {
  const email = `api.student.${Date.now()}@example.com`;
  let studentId;

  test.afterAll(async () => {
    await deleteStudentByEmail(email);
  });

  test('CREATE - API response and database row should match', async ({ request }) => {
    const payload = {
      name: 'API Test Student',
      email,
      course: 'Playwright API Testing',
      age: 28
    };

    const response = await request.post('/api/students', { data: payload });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    studentId = responseBody.Id;

    expect(responseBody.Name).toBe(payload.name);
    expect(responseBody.Email).toBe(payload.email);
    expect(responseBody.Course).toBe(payload.course);
    expect(responseBody.Age).toBe(payload.age);

    const dbStudent = await getStudentById(studentId);
    expect(dbStudent).not.toBeNull();
    expect(dbStudent.Name).toBe(payload.name);
    expect(dbStudent.Email).toBe(payload.email);
    expect(dbStudent.Course).toBe(payload.course);
    expect(dbStudent.Age).toBe(payload.age);
  });

  test('READ - GET API should return the database record', async ({ request }) => {
    const response = await request.get(`/api/students/${studentId}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const dbStudent = await getStudentById(studentId);

    expect(responseBody.Id).toBe(dbStudent.Id);
    expect(responseBody.Name).toBe(dbStudent.Name);
    expect(responseBody.Email).toBe(dbStudent.Email);
  });

  test('UPDATE - API update should be persisted in SQL Server', async ({ request }) => {
    const updatedPayload = {
      name: 'Updated API Student',
      email,
      course: 'Playwright and SQL Server',
      age: 29
    };

    const response = await request.put(`/api/students/${studentId}`, {
      data: updatedPayload
    });

    expect(response.status()).toBe(200);

    const dbStudent = await getStudentById(studentId);
    expect(dbStudent.Name).toBe(updatedPayload.name);
    expect(dbStudent.Course).toBe(updatedPayload.course);
    expect(dbStudent.Age).toBe(updatedPayload.age);
  });

  /*test('DELETE - API delete should remove the SQL Server row', async ({ request }) => {
    const response = await request.delete(`/api/students/${studentId}`);

    expect(response.status()).toBe(204);

    const dbStudent = await getStudentById(studentId);
    expect(dbStudent).toBeNull();
  }); */
});
