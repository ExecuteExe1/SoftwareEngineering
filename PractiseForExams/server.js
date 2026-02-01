const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
let books = [
  { id: 1, title: "The Great Gatsby", author_id: 1, category_id: 1, published_year: 1925 },
  { id: 2, title: "To Kill a Mockingbird", author_id: 2, category_id: 2, published_year: 1960 }
];

let authors = [
  { id: 1, name: "F. Scott Fitzgerald" },
  { id: 2, name: "Harper Lee" }
];

let categories = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Classic" }
];

let currentBookId = 3;
let currentAuthorId = 3;
let currentCategoryId = 3;

// ==================== BOOKS ENDPOINTS ====================

// GET /books - Get all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// GET /books/:bookId - Get a specific book
app.get('/books/:bookId', (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const book = books.find(b => b.id === bookId);
  
  // According to YAML, always return 200 with book data
  // If book doesn't exist, return empty object or null
  res.status(200).json(book || {});
});

// POST /books - Add a new book
app.post('/books', (req, res) => {
  const { title, author_id, category_id, published_year } = req.body;
  
  // No validation - assume all fields are provided
  const newBook = {
    id: currentBookId++,
    title,
    author_id: parseInt(author_id),
    category_id: parseInt(category_id),
    published_year: parseInt(published_year)
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:bookId - Update a book
app.put('/books/:bookId', (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const { title, author_id, category_id, published_year } = req.body;
  
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  // If book doesn't exist, create it (YAML doesn't specify 404)
  if (bookIndex === -1) {
    const newBook = {
      id: bookId,
      title,
      author_id: parseInt(author_id),
      category_id: parseInt(category_id),
      published_year: parseInt(published_year)
    };
    books.push(newBook);
    return res.status(200).json(newBook);
  }
  
  // Update only provided fields
  if (title) books[bookIndex].title = title;
  if (author_id) books[bookIndex].author_id = parseInt(author_id);
  if (category_id) books[bookIndex].category_id = parseInt(category_id);
  if (published_year) books[bookIndex].published_year = parseInt(published_year);
  
  res.status(200).json(books[bookIndex]);
});

// DELETE /books/:bookId - Delete a book
app.delete('/books/:bookId', (req, res) => {
  const bookId = parseInt(req.params.bookId);
  
  books = books.filter(b => b.id !== bookId);
  
  // Always return 204, even if book didn't exist
  res.status(204).send();
});

// ==================== AUTHORS ENDPOINTS ====================

// GET /authors - Get all authors
app.get('/authors', (req, res) => {
  res.status(200).json(authors);
});

// GET /authors/:authorId - Get a specific author
app.get('/authors/:authorId', (req, res) => {
  const authorId = parseInt(req.params.authorId);
  const author = authors.find(a => a.id === authorId);
  
  // Always return 200
  res.status(200).json(author || {});
});

// POST /authors - Add a new author
app.post('/authors', (req, res) => {
  const { name } = req.body;
  
  // No validation
  const newAuthor = {
    id: currentAuthorId++,
    name
  };
  
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// PUT /authors/:authorId - Update an author
app.put('/authors/:authorId', (req, res) => {
  const authorId = parseInt(req.params.authorId);
  const { name } = req.body;
  
  const authorIndex = authors.findIndex(a => a.id === authorId);
  
  // If author doesn't exist, create it
  if (authorIndex === -1) {
    const newAuthor = {
      id: authorId,
      name
    };
    authors.push(newAuthor);
    return res.status(200).json(newAuthor);
  }
  
  authors[authorIndex].name = name;
  res.status(200).json(authors[authorIndex]);
});

// DELETE /authors/:authorId - Delete an author
app.delete('/authors/:authorId', (req, res) => {
  const authorId = parseInt(req.params.authorId);
  
  authors = authors.filter(a => a.id !== authorId);
  
  res.status(204).send();
});

// ==================== CATEGORIES ENDPOINTS ====================

// GET /categories - Get all categories
app.get('/categories', (req, res) => {
  res.status(200).json(categories);
});

// GET /categories/:categoryId - Get a specific category
app.get('/categories/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const category = categories.find(c => c.id === categoryId);
  
  // Always return 200
  res.status(200).json(category || {});
});

// POST /categories - Add a new category
app.post('/categories', (req, res) => {
  const { name } = req.body;
  
  // No validation
  const newCategory = {
    id: currentCategoryId++,
    name
  };
  
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// PUT /categories/:categoryId - Update a category
app.put('/categories/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const { name } = req.body;
  
  const categoryIndex = categories.findIndex(c => c.id === categoryId);
  
  // If category doesn't exist, create it
  if (categoryIndex === -1) {
    const newCategory = {
      id: categoryId,
      name
    };
    categories.push(newCategory);
    return res.status(200).json(newCategory);
  }
  
  categories[categoryIndex].name = name;
  res.status(200).json(categories[categoryIndex]);
});

// DELETE /categories/:categoryId - Delete a category
app.delete('/categories/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  
  categories = categories.filter(c => c.id !== categoryId);
  
  res.status(204).send();
});

// ==================== SERVER START ====================

app.get('/', (req, res) => {
  res.json({
    message: 'Bookstore Management API',
    version: '1.0.0',
    endpoints: {
      books: {
        getAll: 'GET /books',
        getOne: 'GET /books/{id}',
        create: 'POST /books',
        update: 'PUT /books/{id}',
        delete: 'DELETE /books/{id}'
      },
      authors: {
        getAll: 'GET /authors',
        getOne: 'GET /authors/{id}',
        create: 'POST /authors',
        update: 'PUT /authors/{id}',
        delete: 'DELETE /authors/{id}'
      },
      categories: {
        getAll: 'GET /categories',
        getOne: 'GET /categories/{id}',
        create: 'POST /categories',
        update: 'PUT /categories/{id}',
        delete: 'DELETE /categories/{id}'
      }
    }
  });
});

// REMOVED: 404 handler (not in YAML)
// REMOVED: 500 error handler (not in YAML)

app.listen(PORT, () => {
  console.log(`Bookstore API running at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /books`);
  console.log(`  GET  /books/:id`);
  console.log(`  POST /books`);
  console.log(`  PUT  /books/:id`);
  console.log(`  DELETE /books/:id`);
  console.log(`  GET  /authors`);
  console.log(`  GET  /authors/:id`);
  console.log(`  POST /authors`);
  console.log(`  PUT  /authors/:id`);
  console.log(`  DELETE /authors/:id`);
  console.log(`  GET  /categories`);
  console.log(`  GET  /categories/:id`);
  console.log(`  POST /categories`);
  console.log(`  PUT  /categories/:id`);
  console.log(`  DELETE /categories/:id`);
});

module.exports = app;