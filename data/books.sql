DROP IF EXISTS books_app;

CREATE TABLE books_app;(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  ISBN TINYINT,
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
)