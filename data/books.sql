
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description)
VALUES ('Billy', 'Ma Billy', '876542346', 'http://books.google.com/books/content?id=2WxktmTXrzwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Who cares');