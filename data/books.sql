DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description) VALUES ('James Brown', 'This River', '9781582438740', 'http://books.google.com/books/content?id=gp1aW4T-FsgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Description: I work.');

INSERT INTO books (author, title, isbn, image_url, description) VALUES ('Justin Kaplan', 'Mr. Clemens and Mark Twain', '9781439129319', 'http://books.google.com/books/content?id=lj1Rc68iZ0YC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Description: Floating down a river.');
