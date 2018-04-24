// server.js
// load the things we need

var express = require('express');
var app = express();
var getQuizInfos = require('./controlers/js/mysql')
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var varFloat = "";
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();


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

app.get('/questionspage/:id(\\d+)',function(req,res){
    getQuizInfos(req.params.id, function(data) {
	   res.render('pages/questionspage', {quiz: data});
    });
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

app.get('/:id(\\d+)',(req,res)=> {
  getQuizInfos(req.params.id, function(data) {
    res.render('pages/jouer',{id: data.id, title:data.title, category:data.category});
  });
});

// CREER page
app.get('/creationQuizz', function(req, res) {
    res.render('pages/creationQuizz', {varFloat:"floatt"});
});

app.get('/creation', function(req, res) {
    res.render('pages/creer', {varFloat:"floatt"});
});

app.get('/finquizz', function(req, res) {
    res.render('pages/FinQuizz', {varFloat:"floatt"});
});

app.get('/bravo', function(req, res) {
    res.render('pages/FinQuizz', {varFloat:"floatt"});
});


//ENVOI EMAIL//
app.post('/sendMail', function (req, res) {
  let smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
  user: "wildtrashmailing@gmail.com",
  pass: "Ploppyplop01"
  }
  });

  smtpTransport.sendMail({
  from: req.body.email,
  to: "wildtrashmailing@gmail.com",
  subject: 'Vous avez reçu un message de ' + req.body.last_name + ' ' + req.body.first_name,
  text: req.body.message,
  html: '<b>' + req.body.message + '</b>'
  }, (error, response) => {
  if(error){
  console.log(error);
  }else{
  console.log("Message sent");
  }
  });
  res.redirect('/contact')
});
// FIN ENVOI EMAIL//

app.listen(3000);
console.log('3000 have to be changed in 80 for prod');
