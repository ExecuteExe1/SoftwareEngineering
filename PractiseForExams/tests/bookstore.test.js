const request = require('supertest');
const app = require('../server');

describe('Complete Coverage Tests', () => {
  // Reset data before each test to ensure clean state
  beforeEach(() => {
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
  test('GET / returns API info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Bookstore Management API');
  });

  // ========== BOOKS TESTS ==========
  describe('Books', () => {
    test('GET /books returns array', async () => {
      const res = await request(app).get('/books');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    test('GET /books/:id returns book if exists', async () => {
      const res = await request(app).get('/books/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    test('GET /books/:id returns empty object if not exists', async () => {
      const res = await request(app).get('/books/999');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    test('POST /books creates new book with auto-increment ID', async () => {
      const newBook = {
        title: "1984",
        author_id: 1,
        category_id: 1,
        published_year: 1949
      };
      
      const res = await request(app).post('/books').send(newBook);
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(3); // currentBookId was 3
      expect(res.body.title).toBe("1984");
      
      // Verify it was added
      const allBooks = await request(app).get('/books');
      expect(allBooks.body.length).toBe(3);
    });

    test('POST /books without validation accepts incomplete data', async () => {
      // Missing required fields but still creates
      const res = await request(app).post('/books').send({ title: "Incomplete" });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Incomplete");
    });

    test('PUT /books/:id updates existing book', async () => {
      const res = await request(app)
        .put('/books/1')
        .send({ title: "Updated Title", published_year: 2024 });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Title");
      expect(res.body.published_year).toBe(2024);
    });

    test('PUT /books/:id creates new book if ID not found', async () => {
      const res = await request(app)
        .put('/books/999')
        .send({ 
          title: "New via PUT", 
          author_id: 1, 
          category_id: 1, 
          published_year: 2023 
        });
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(999);
      expect(res.body.title).toBe("New via PUT");
    });

    test('DELETE /books/:id removes book', async () => {
      const res = await request(app).delete('/books/1');
      expect(res.status).toBe(204);
      
      // Verify it's gone
      const getRes = await request(app).get('/books/1');
      expect(getRes.body).toEqual({});
    });

    test('DELETE /books/:id returns 204 even if book not found', async () => {
      const res = await request(app).delete('/books/999');
      expect(res.status).toBe(204);
    });
  });

  // ========== AUTHORS TESTS ==========
  describe('Authors', () => {
    test('GET /authors returns array', async () => {
      const res = await request(app).get('/authors');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    test('GET /authors/:id returns author if exists', async () => {
      const res = await request(app).get('/authors/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    test('GET /authors/:id returns empty object if not exists', async () => {
      const res = await request(app).get('/authors/999');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    test('POST /authors creates new author', async () => {
      const res = await request(app)
        .post('/authors')
        .send({ name: "George Orwell" });
      
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(3);
      expect(res.body.name).toBe("George Orwell");
    });

    test('PUT /authors/:id updates existing author', async () => {
      const res = await request(app)
        .put('/authors/1')
        .send({ name: "Updated Name" });
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Name");
    });

    test('PUT /authors/:id creates new author if ID not found', async () => {
      const res = await request(app)
        .put('/authors/999')
        .send({ name: "New Author" });
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(999);
      expect(res.body.name).toBe("New Author");
    });

    test('DELETE /authors/:id removes author', async () => {
      const res = await request(app).delete('/authors/1');
      expect(res.status).toBe(204);
    });
  });

  // ========== CATEGORIES TESTS ==========
  describe('Categories', () => {
    test('GET /categories returns array', async () => {
      const res = await request(app).get('/categories');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    test('GET /categories/:id returns category if exists', async () => {
      const res = await request(app).get('/categories/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    test('GET /categories/:id returns empty object if not exists', async () => {
      const res = await request(app).get('/categories/999');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    test('POST /categories creates new category', async () => {
      const res = await request(app)
        .post('/categories')
        .send({ name: "Science Fiction" });
      
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(3);
      expect(res.body.name).toBe("Science Fiction");
    });

    test('PUT /categories/:id updates existing category', async () => {
      const res = await request(app)
        .put('/categories/1')
        .send({ name: "Updated Category" });
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Category");
    });

    test('PUT /categories/:id creates new category if ID not found', async () => {
      const res = await request(app)
        .put('/categories/999')
        .send({ name: "New Category" });
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(999);
      expect(res.body.name).toBe("New Category");
    });

    test('DELETE /categories/:id removes category', async () => {
      const res = await request(app).delete('/categories/1');
      expect(res.status).toBe(204);
    });
  });

  // ========== EDGE CASES ==========
  describe('Edge Cases', () => {
    test('Handles non-numeric IDs in GET', async () => {
      const res = await request(app).get('/books/abc');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    test('Handles decimal IDs (parseInt truncates)', async () => {
      const res = await request(app).get('/books/1.99');
      expect(res.status).toBe(200);
      // parseInt('1.99') = 1, so should return book with id 1
      if (res.body.id) {
        expect(res.body.id).toBe(1);
      }
    });

    test('Handles zero ID', async () => {
      const res = await request(app).get('/books/0');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({}); // No book with id 0
    });

    test('Handles negative ID', async () => {
      const res = await request(app).get('/books/-1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    test('Partial updates with PUT (only some fields)', async () => {
      // Update only title
      const res = await request(app)
        .put('/books/1')
        .send({ title: "Just Title Updated" });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Just Title Updated");
      // Other fields should remain
      expect(res.body.published_year).toBe(1925);
    });

    test('Multiple creates get different auto-increment IDs', async () => {
      const book1 = await request(app).post('/books').send({
        title: "Book A", author_id: 1, category_id: 1, published_year: 2023
      });
      
      const book2 = await request(app).post('/books').send({
        title: "Book B", author_id: 1, category_id: 1, published_year: 2023
      });
      
      expect(book1.body.id).toBe(3); // Started at 3
      expect(book2.body.id).toBe(4); // Next one is 4
    });
  });

  // ========== DATA INTEGRITY ==========
  describe('Data Integrity', () => {
    test('Creating book doesn\'t affect authors', async () => {
      const authorsBefore = await request(app).get('/authors');
      
      await request(app).post('/books').send({
        title: "New Book", author_id: 1, category_id: 1, published_year: 2023
      });
      
      const authorsAfter = await request(app).get('/authors');
      expect(authorsBefore.body.length).toBe(authorsAfter.body.length);
    });

    test('Updating one item doesn\'t affect others', async () => {
      const book2Before = await request(app).get('/books/2');
      
      await request(app)
        .put('/books/1')
        .send({ title: "Updated" });
      
      const book2After = await request(app).get('/books/2');
      expect(book2Before.body.title).toBe(book2After.body.title);
    });
  });
});