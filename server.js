'use strict';

//-------------------*
//
// Application Dependencies
//
// ------------------*

const express = require('express');
const superagent = require('superagent');
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
// Error Message
// not sure we need this?
// ------------------*

let errorMessage = (error, response) => {
  console.error(error);
  if (response) response.status(500).send('Internal server error encountered');
};

//-------------------*
//
// Set the view engine for server-side templating
//
// ------------------*

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', newSearch);
app.get('/hello');
app.get('/error', errorPage);

app.post('/searches', performSearch);

//-------------------*
//
// Catch All
//
// ------------------*

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

//-------------------*
//
// Constructor Function
//
// ------------------*


function Book(info) {
  this.image_url = convertURL(info.imageLinks.thumbnail) || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title || 'No title available';
  this.authors = info.authors || 'No authors available';
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
  response.render('pages/index');
}

function performSearch(request, response){
  console.log(request.body);
  console.log('here', request.body.search);
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;



  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    // .then(apiResponse => console.log(apiResponse.body.items))
    // .then(apiResponse => console.log())

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
  let SQL = 'SELECT * FROM books_app;';

  return client.query(SQL)
    .then(results => response.render('index', {results: results.rows}))
    .catch(err => errorPage(err, response));
}

// function getOneBook(request, response){
//   let SQL = `SELECT * FROM books_app WHERE id=$1;`;
//   // let values = [request.params.];

//   return client.query(SQL, values)
//     .then(result => {
//       response.render('pages/index', {task: result.rows});
//     })
//     .catch(err => handleError(err, response));
// }
// function showBook(request, response){
//   request.render('pages/index');
// }


