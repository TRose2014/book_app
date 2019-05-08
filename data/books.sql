DROP TABLE IF EXISTS books_app;

CREATE TABLE books_app(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  ISBN VARCHAR(255),
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books_app (author, title, ISBN, image_url, description, bookshelf)
VALUES('Dan Brown', 'Origin', '9780385542692', 'http://danbrown.com/wp-content/themes/danbrown/../../uploads/2017/06/US_Big.jpg“>', 'The #1 New York Times Bestseller (October 2017) from the author of The Da Vinci Code. Robert Langdon, Harvard professor of symbology, arrives at the ultramodern Guggenheim Museum Bilbao to attend the unveiling of a discovery that “will change the face of science forever.” The evening’s host is Edmond Kirsch, a forty-year-old billionaire and futurist, and one of Langdon’s first students. But the meticulously orchestrated evening suddenly erupts into chaos, and Kirsch’s precious discovery teeters on the brink of being lost forever. Facing an imminent threat, Langdon is forced to flee. With him is Ambra Vidal, the elegant museum director who worked with Kirsch. They travel to Barcelona on a perilous quest to locate a cryptic password that will unlock Kirsch’s secret. Navigating the dark corridors of hidden history and extreme re­ligion, Langdon and Vidal must evade an enemy whose all-knowing power seems to emanate from Spain’s Royal Palace. They uncover clues that ultimately bring them face-to-face with Kirsch’s shocking discovery…and the breathtaking truth that has long eluded us.','Mystery/Action');
