'use strict';

//-------------------*
//
// Application Dependencies
//
// ------------------*

const express = require('express');
const superagent = require('superagent');


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

app.get('/', newSearch);
app.get('/hello');

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
  this.image_url = info.image_url || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title || 'No title available';

  // add more things here

}

function newSearch(request, response){
  response.render('pages/index');
}

function performSearch(request, response){
  console.log(request.body);
  console.log(request.body.search);
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;


  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(books => response.render('pages/searches/show', {searchResults: books}))
    .catch(console.error);
}
