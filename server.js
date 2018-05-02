// server.js
// load the things we need

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var readQuiz = require('./controlers/js/sqlRead');
var createQuiz = require('./controlers/js/sqlCreate');
var app = module.exports = express();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const FileStore = require('session-file-store')(Session);
var logger = require('morgan');


// var bcrypt = require('bcrypt');
var varFloat = "";
var cookie = require('cookie');
var mysql = require('mysql');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();
app.use(cookieParser());


app.use(Session({
    store: new FileStore({
        path: path.join(__dirname, '/tmp'),
        encrypt: true
    }),
    secret: 'Super Secret !',
    resave: true,
    saveUninitialized: true,
    name : 'sessionId'
}));


router.get('/session-in', (req, res, next) => {
req.session //initialisation de la variable
res.end();//stop la requête et stock la variable
});

router.get('/session-out', (req, res, next) => {
res.send(req.session.song)//receptionne la requête et affiche
});

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
//page login

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res) {
    res.render('pages/login',{title:'Login'});
});

app.get('/profile', function(req,res){
  res.render('pages/profile',{username:'marion'});
})

app.post('/login',
passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/login'
}));


passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username);
    console.log(password);
    const db = require('./db');

    db.query('SELECT password FROM users WHERE username= ?',[username], function(err,results,fields){
      if (err){
        throw (err);

        } else {
          if (results.length === 0){
            return done(null,false);
          } else if (results[0].password!=password){
            return done(null,false);
          }
            return done(null,true);
        }

      })
      db.query('SELECT username FROM users as userName', function(error,results,fields){
              if (error) {
                throw error;
              };

              let userName =results[0].username;
      });
  }

));

passport.serializeUser(function(userName, done) {
  done(null, userName);
});

passport.deserializeUser(function(user, done) {
  done(null, userName);
});


//page liste des quizs

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


//PAGE DE VERIFICATION//

app.get('/test/', function(req,res) {

    readQuiz.getUncheckedQuiz(function(data){

        res.render('pages/test',{

          plop : data

        })})

});

app.get('/testcheckquizz/:id(\\d+)',function(req,res){

    readQuiz.getQuiz(req.params.id, function(data) {

     res.render('pages/testcheckquizz', {quiz: data});

    });

});

//FIN PAGE DE VERIFICATION//
app.listen(3000);
console.log('3000 have to be changed in 80 for prod');
