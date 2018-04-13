// server.js
// load the things we need
var express = require('express');
var app = express();
var varFloat = "";

app.use('/views', express.static('views'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page

app.get('/', function(req, res) {
    res.render('pages/index');
});

// play page
app.get('/jouer', function(req, res) {
    res.render('pages/jouer');
});

// about page
app.get('/admin', function(req, res) {
    res.render('pages/admin');
});

// play page
app.get('/jouer', function(req, res) {
    res.render('pages/jouer');
});

// page question

app.get('/questionspage',function(req,res){
	res.render('pages/questionspage');	
});

// FAQ page
app.get('/faq', function(req, res) {
    res.render('pages/faq', {varFloat:"floatt"});
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

// CREER page
app.get('/creer', function(req, res) {
    res.render('pages/creer', {varFloat:"floatt"});
});

app.get('/creation', function(req, res) {
    res.render('pages/creationQuizz', {varFloat:"floatt"});
});

app.get('/finquizz', function(req, res) {
    res.render('pages/FinQuizz', {varFloat:"floatt"});
});

app.get('/bravo', function(req, res) {
    res.render('pages/FinQuizz', {varFloat:"floatt"});
});

app.listen(3000);

console.log('3000 have to be changed in 80 for prod');
