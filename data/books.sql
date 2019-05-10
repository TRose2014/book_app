DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  ISBN VARCHAR(255),
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
);
