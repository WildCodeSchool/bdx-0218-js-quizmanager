// server.js
// load the things we need
var express = require('express');
var app = express();
var getQuizInfos = require('./controlers/js/mysql')

app.use('/views', express.static('views'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page
app.get('/admin', function(req, res) {
    res.render('pages/admin');
});

// play page
app.get('/jouer', function(req, res) {
    res.render('pages/jouer');
});

// FAQ page
app.get('/faq', function(req, res) {
    res.render('pages/faq');
});

// acceuil page

app.get('/accueil', function(req, res) {
    res.render('pages/accueil');
  
});

// formulaire de contact
app.get('/contact', function(req, res) {
    res.render('pages/contact');
});

// search quiz page
app.get('/searchquiz', function(req, res) {
    res.render('pages/searchquiz');
});

app.get('/:id(\\d+)',(req,res)=> {
  getQuizInfos(req.params.id, function(data) {
    res.render('pages/jouer',{id: data.id, title:data.title, category:data.category});  
  });
});

app.listen(3000);
console.log('3000 have to be changed in 80 for prod');
