'use strict';

//-------------------*
//
// Application Dependencies
//
// ------------------*

const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');



//-------------------*
//
// Application SetUp
//
// ------------------*

const app = express();
const PORT = process.env.PORT || 3000;


//-------------------*
//
// Application Middleware
//
// ------------------*

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//-------------------*
//
// DataBase Setup
//
// ------------------*

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//-------------------*
//
// Set the view engine for server-side templating
//
// ------------------*

app.set('view engine', 'ejs');

//-------------------*
//
// Error Message
//
// ------------------*

let errorMessage = (error, response) => {
  console.error(error);
  if (response) response.status(500).send('Internal server error encountered');
};

//-------------------*
//
// Routes
//
// ------------------*

app.get('/', getBooks);
// app.get('/hello');
app.get('/error', errorPage);
app.post('/searches/new', performSearch);
app.get('/searches/new', newSearch);
app.get('/books/:id', getOneBook);
app.get('/add', showBook);


app.post('/searches', newSearch);


//-------------------*
//
// Constructor Function
//
// ------------------*


function Book(info) {
  this.image_url = convertURL(info.imageLinks.thumbnail) || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title || 'No title available';
  this.authors = info.authors || 'No authors available';
  console.log(info.industryIdentifiers);
  this.isbn = info.industryIdentifiers[0].identifier || 'No ISBN available';
  this.description = info.description || 'No description found';
}

//-------------------*
//
// Helper functions
//
// ------------------*

const convertURL = (data) => {
  let urlRegEx = /^http?:/g;
  if (urlRegEx.test(data)){
    return data.replace('http', 'https');
  }
  return data;
};

//-------------------*
//
// Error functions
//
// ------------------*

function errorPage(error, response){
  response.render('pages/error', {error: 'There was an issue'});
}

//-------------------*
//
// Functions
//
// ------------------*

function newSearch(request, response){
  response.render('pages/searches/new');
  // response.render('pages/index');
}

function performSearch(request, response){
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;



  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))

    .then(books => response.render('pages/searches/show', {searchResults: books}))
    // .then(books => response.render('pages/searches/new', {searchResults: books}))
    .catch(console.error);
}


//-------------------*
//
// Retrieve from DataBase
//
// ------------------*
function getBooks(request, response){
  let SQL = 'SELECT * FROM books;';
  // let values = [request.params.book_id];

  return client.query(SQL)
    .then(results => {
      console.log(results.rows);
      response.render('pages/index', {savedBooks: results.rows, booksAmount: results.rows.length});
    })
    .catch(err => {
      console.log('oops');
      errorPage(err, response);
    });
}

function getOneBook(request, response){
  let SQL = `SELECT * FROM books WHERE id=$1;`;
  let values = [request.params.id];

  return client.query(SQL, values)
    .then(result => {
      response.render('pages/books/show', {book: result.rows[0]});
    })
    .catch(err => errorPage(err, response));
}

function showBook(request, response){
  request.render('pages/index');
}


//-------------------*
//
// Catch All
//
// ------------------*

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

