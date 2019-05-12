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
const methodOverride = require('method-override');



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

//dev out methodoverride: look at urlencoded POST bodies and delete them



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

app.get('/', loadHome);
app.get('/searches/new', newSearch);
app.post('/searches', performSearch);
app.post('/book', saveBook);
app.get('/books/:id', getOneBook);
app.put('/books/:id', updateBook);
app.get('/error', errorPage);

// need a delete route
// something like app.delete('/books/:id, deleteBook);

//-------------------*
//
// Constructor Function
//
// ------------------*

function Book(info) {

  //add logic to handle getting multiple authors back
  //maybe just list first one?

  let image = convertURL(info.imageLinks.thumbnail);

  this.title = info.title || 'No title available';
  this.author = info.authors || 'No authors available';
  this.isbn = info.industryIdentifiers[0].identifier || 'No ISBN available';
  this.image_url = image || 'https://i.imgur.com/J5LVHEL.jpg';
  this.description = info.description || 'No description found';
  this.bookshelf = 'select category';

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
  response.render('pages/error', {error: 'There was an issue. Stop breaking things!'});
}

//-------------------*
//
// Functions
//
// ------------------*

function newSearch(request, response){
  response.render('pages/searches/new');
}

function performSearch(request, response){
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(books => response.render('pages/searches/show', {searchResults: books}))
    .catch(console.error);
}

//-------------------*
//
// Retrieve from DataBase
//
// ------------------*


function loadHome(request, response){
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(results => {
      response.render('pages/index', {result: results.rows, booksAmount: results.rows.length});
    })
    .catch(err => {
      console.log('get books function issue');
      errorPage(err, response);
    });
}

function getOneBook(request, response){
  let SQL = `SELECT * FROM books WHERE id=$1;`;
  let values = [request.params.id];

  return client.query(SQL, values)
    .then(result => {
      response.render('pages/books/show', {results: result.rows[0]});
    })
    .catch(err => errorPage(err, response));
}

//save

function saveBook(request, response){
  let { title, author, isbn, image_url, description, bookshelf } = request.body;

  let SQL = 'INSERT INTO books(title, author, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';

  let values = [title, author, isbn, image_url, description, bookshelf];


  console.log('in save book');
  console.log('saveBook function', request.body);

  return client.query(SQL, values)
    .then(results => response.redirect(`/books/${results.rows[0].id}`))
    .catch(err => errorPage(err, response));

}


//update

function updateBook(request, response){
  let { title, author, isbn, image_url, description, bookshelf } = request.body;

  let SQL = 'UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6, WHERE id=$7;';
  console.log(request.params.id);
  let values = [title, author, isbn, image_url, description, bookshelf, request.params.id];

  return client.query(SQL, values)
    .then(response.redirect(`/books/${request.params.id}`))
    .catch(err => errorPage(err, response));

}


//delete
// function deleteBook(request, response){

// }


//-------------------*
//
// Catch All Route
//
// ------------------*

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

//-------------------*
//
// Entry Point/ Power On
//
// ------------------*

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

