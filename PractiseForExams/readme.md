Testing commands!
# Get all books
curl http://localhost:3000/books

# Get a specific book
curl http://localhost:3000/books/1

# Create a new book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "New Book", "author_id": 1, "category_id": 1, "published_year": 2023}'

# Update a book
curl -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# Delete a book
curl -X DELETE http://localhost:3000/books/1


More commands

# Test all endpoints
echo "=== Testing Books API ==="
curl http://localhost:3000/books
echo -e "\n"

echo "=== Creating a new book ==="
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "1984", "author_id": 1, "category_id": 1, "published_year": 1949}'
echo -e "\n"

echo "=== Creating a new author ==="
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "George Orwell"}'
echo -e "\n"

echo "=== Creating a new category ==="
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Dystopian"}'
echo -e "\n"

echo "=== All data ==="
echo "Books:"; curl -s http://localhost:3000/books | python -m json.tool
echo -e "\nAuthors:"; curl -s http://localhost:3000/authors | python -m json.tool
echo -e "\nCategories:"; curl -s http://localhost:3000/categories | python -m json.tool



echo "How to install the appropriate testing library"
echo "# Step 1: Initialize npm project
npm init -y

# Step 2: Install dependencies
npm install express cors

# Step 3: Install nodemon as dev dependency
npm install --save-dev nodemon

# Step 4: Make sure your package.json is the same as here
# Edit package.json and add the "scripts" section shown above

# Step 5: Create server.js with the code I provided

# Step 6: Run the server
npm run dev "
