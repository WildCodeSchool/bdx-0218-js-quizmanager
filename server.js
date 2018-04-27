// server.js
// load the things we need

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var readQuiz = require('./controlers/js/sqlRead');
var createQuiz = require('./controlers/js/sqlCreate');
var varFloat = "";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();

app.use(express.json()) 
app.use('/views', express.static('views'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});


// about page
app.get('/admin', function(req, res) {
    res.render('pages/admin');
});


app.get('/jouer', function(req, res) {
    readQuiz.getListQuiz(function (data){
    res.render('pages/jouer',{titre:data});
})
});

// page question
app.get('/questionspage/:id(\\d+)',function(req,res){
    readQuiz.getQuiz(req.params.id, function(data) {
	   res.render('pages/questionspage', {quiz: data});
    });
});

// FAQ page
app.get('/faq', function(req, res) {
    res.render('pages/faq', {varFloat:"floatt"});
});

// acceuil page
app.get('/accueil', function(req, res) {
    readQuiz.getLastQuiz(function (data){
    res.render('pages/accueil',{titre:data});
})
});
// formulaire de contact
app.get('/contact', function(req, res) {
    res.render('pages/contact');
});

// search quiz page
app.get('/searchquiz', function(req, res) {
    res.render('pages/searchquiz');
});

// play quiz page
app.get('/:id(\\d+)',(req,res)=> {
    readQuiz.getQuizInfos(req.params.id, function(data) {
    res.render('pages/jouer',{id: data.id, title:data.title, category:data.category});  
  });
});

// create quiz page
app.get('/creationQuiz', function(req, res) {
    res.render('pages/creationQuiz', {varFloat:"floatt"});
});

app.post('/creationQuiz', function(req,res) {
    createQuiz.setQuiz(req.body, function(answer){
        res.send({answer: answer});
    });
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

//MODIFIER QUIZ

app.get('/modifierQuiz/:id(\\d+)',function(req,res){
    readQuiz.getQuiz(req.params.id, function(data) {
     res.render('pages/modifierQuiz', {quiz: data});
    });
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
