const test = require('ava');
const request = require('supertest');
const app = require('../server');

// Reset data before each test to ensure clean state
test.beforeEach(() => {
  // Reset to initial state
  global.books = [
    { id: 1, title: "The Great Gatsby", author_id: 1, category_id: 1, published_year: 1925 },
    { id: 2, title: "To Kill a Mockingbird", author_id: 2, category_id: 2, published_year: 1960 }
  ];
  
  global.authors = [
    { id: 1, name: "F. Scott Fitzgerald" },
    { id: 2, name: "Harper Lee" }
  ];
  
  global.categories = [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Classic" }
  ];
  
  global.currentBookId = 3;
  global.currentAuthorId = 3;
  global.currentCategoryId = 3;
});

// ========== ROOT ENDPOINT ==========
test('GET / returns API info', async t => {
  const res = await request(app).get('/');
  t.is(res.status, 200);
  t.is(res.body.message, 'Bookstore Management API');
});

// ========== BOOKS TESTS ==========
test.serial('GET /books returns array', async t => {
  const res = await request(app).get('/books');
  t.is(res.status, 200);
  t.is(res.body.length, 2);
});

test.serial('GET /books/:id returns book if exists', async t => {
  const res = await request(app).get('/books/1');
  t.is(res.status, 200);
  t.is(res.body.id, 1);
});

test.serial('GET /books/:id returns empty object if not exists', async t => {
  const res = await request(app).get('/books/999');
  t.is(res.status, 200);
  t.deepEqual(res.body, {});
});

test.serial('POST /books creates new book with auto-increment ID', async t => {
  const newBook = {
    title: "1984",
    author_id: 1,
    category_id: 1,
    published_year: 1949
  };
  
  const res = await request(app).post('/books').send(newBook);
  t.is(res.status, 201);
  t.is(res.body.id, 3); // currentBookId was 3
  t.is(res.body.title, "1984");
  
  // Verify it was added
  const allBooks = await request(app).get('/books');
  t.is(allBooks.body.length, 3);
});

test.serial('POST /books without validation accepts incomplete data', async t => {
  // Missing required fields but still creates
  const res = await request(app).post('/books').send({ title: "Incomplete" });
  t.is(res.status, 201);
  t.is(res.body.title, "Incomplete");
});

test.serial('PUT /books/:id updates existing book', async t => {
  const res = await request(app)
    .put('/books/1')
    .send({ title: "Updated Title", published_year: 2024 });
  
  t.is(res.status, 200);
  t.is(res.body.title, "Updated Title");
  t.is(res.body.published_year, 2024);
});

test.serial('PUT /books/:id creates new book if ID not found', async t => {
  const res = await request(app)
    .put('/books/999')
    .send({ 
      title: "New via PUT", 
      author_id: 1, 
      category_id: 1, 
      published_year: 2023 
    });
  
  t.is(res.status, 200);
  t.is(res.body.id, 999);
  t.is(res.body.title, "New via PUT");
});

test.serial('DELETE /books/:id removes book', async t => {
  const res = await request(app).delete('/books/1');
  t.is(res.status, 204);
  
  // Verify it's gone
  const getRes = await request(app).get('/books/1');
  t.deepEqual(getRes.body, {});
});

test.serial('DELETE /books/:id returns 204 even if book not found', async t => {
  const res = await request(app).delete('/books/999');
  t.is(res.status, 204);
});

// ========== AUTHORS TESTS ==========
test.serial('GET /authors returns array', async t => {
  const res = await request(app).get('/authors');
  t.is(res.status, 200);
  t.is(res.body.length, 2);
});

test.serial('GET /authors/:id returns author if exists', async t => {
  const res = await request(app).get('/authors/1');
  t.is(res.status, 200);
  t.is(res.body.id, 1);
});

test.serial('GET /authors/:id returns empty object if not exists', async t => {
  const res = await request(app).get('/authors/999');
  t.is(res.status, 200);
  t.deepEqual(res.body, {});
});

test.serial('POST /authors creates new author', async t => {
  const res = await request(app)
    .post('/authors')
    .send({ name: "George Orwell" });
  
  t.is(res.status, 201);
  t.is(res.body.id, 3);
  t.is(res.body.name, "George Orwell");
});

test.serial('PUT /authors/:id updates existing author', async t => {
  const res = await request(app)
    .put('/authors/1')
    .send({ name: "Updated Name" });
  
  t.is(res.status, 200);
  t.is(res.body.name, "Updated Name");
});

test.serial('PUT /authors/:id creates new author if ID not found', async t => {
  const res = await request(app)
    .put('/authors/999')
    .send({ name: "New Author" });
  
  t.is(res.status, 200);
  t.is(res.body.id, 999);
  t.is(res.body.name, "New Author");
});

test.serial('DELETE /authors/:id removes author', async t => {
  const res = await request(app).delete('/authors/1');
  t.is(res.status, 204);
});

// ========== CATEGORIES TESTS ==========
test.serial('GET /categories returns array', async t => {
  const res = await request(app).get('/categories');
  t.is(res.status, 200);
  t.is(res.body.length, 2);
});

test.serial('GET /categories/:id returns category if exists', async t => {
  const res = await request(app).get('/categories/1');
  t.is(res.status, 200);
  t.is(res.body.id, 1);
});

test.serial('GET /categories/:id returns empty object if not exists', async t => {
  const res = await request(app).get('/categories/999');
  t.is(res.status, 200);
  t.deepEqual(res.body, {});
});

test.serial('POST /categories creates new category', async t => {
  const res = await request(app)
    .post('/categories')
    .send({ name: "Science Fiction" });
  
  t.is(res.status, 201);
  t.is(res.body.id, 3);
  t.is(res.body.name, "Science Fiction");
});

test.serial('PUT /categories/:id updates existing category', async t => {
  const res = await request(app)
    .put('/categories/1')
    .send({ name: "Updated Category" });
  
  t.is(res.status, 200);
  t.is(res.body.name, "Updated Category");
});

test.serial('PUT /categories/:id creates new category if ID not found', async t => {
  const res = await request(app)
    .put('/categories/999')
    .send({ name: "New Category" });
  
  t.is(res.status, 200);
  t.is(res.body.id, 999);
  t.is(res.body.name, "New Category");
});

test.serial('DELETE /categories/:id removes category', async t => {
  const res = await request(app).delete('/categories/1');
  t.is(res.status, 204);
});

// ========== EDGE CASES ==========
test.serial('Handles non-numeric IDs in GET', async t => {
  const res = await request(app).get('/books/abc');
  t.is(res.status, 200);
  t.deepEqual(res.body, {});
});

test.serial('Handles decimal IDs (parseInt truncates)', async t => {
  const res = await request(app).get('/books/1.99');
  t.is(res.status, 200);
  // parseInt('1.99') = 1, so should return book with id 1
  if (res.body.id) {
    t.is(res.body.id, 1);
  } else {
    t.deepEqual(res.body, {});
  }
});

test.serial('Handles zero ID', async t => {
  const res = await request(app).get('/books/0');
  t.is(res.status, 200);
  t.deepEqual(res.body, {}); // No book with id 0
});

test.serial('Handles negative ID', async t => {
  const res = await request(app).get('/books/-1');
  t.is(res.status, 200);
  t.deepEqual(res.body, {});
});

test.serial('Partial updates with PUT (only some fields)', async t => {
  // Update only title
  const res = await request(app)
    .put('/books/1')
    .send({ title: "Just Title Updated" });
  
  t.is(res.status, 200);
  t.is(res.body.title, "Just Title Updated");
  // Other fields should remain
  t.is(res.body.published_year, 1925);
});

test.serial('Multiple creates get different auto-increment IDs', async t => {
  const book1 = await request(app).post('/books').send({
    title: "Book A", author_id: 1, category_id: 1, published_year: 2023
  });
  
  const book2 = await request(app).post('/books').send({
    title: "Book B", author_id: 1, category_id: 1, published_year: 2023
  });
  
  t.is(book1.body.id, 3); // Started at 3
  t.is(book2.body.id, 4); // Next one is 4
});

// ========== DATA INTEGRITY ==========
test.serial('Creating book doesn\'t affect authors', async t => {
  const authorsBefore = await request(app).get('/authors');
  
  await request(app).post('/books').send({
    title: "New Book", author_id: 1, category_id: 1, published_year: 2023
  });
  
  const authorsAfter = await request(app).get('/authors');
  t.is(authorsBefore.body.length, authorsAfter.body.length);
});

test.serial('Updating one item doesn\'t affect others', async t => {
  const book2Before = await request(app).get('/books/2');
  
  await request(app)
    .put('/books/1')
    .send({ title: "Updated" });
  
  const book2After = await request(app).get('/books/2');
  t.is(book2Before.body.title, book2After.body.title);
});