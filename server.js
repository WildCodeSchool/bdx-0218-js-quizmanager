// server.js
// load the things we need

var express = require('express');
var router = express.Router();
var app = express();
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var path = require('path');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var readQuiz = require('./controlers/js/sqlRead');
var createQuiz = require('./controlers/js/sqlCreate');
var updateQuiz = require('./controlers/js/sqlUpdate')
var checkAdmin = require('./controlers/js/sqlAdmin')
var varFloat = "";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.json()) 
app.use('/views', express.static('views'));
app.use(session ({
	store: new fileStore ({
		path: path.join(__dirname, '/tmp'),
		encrypt: true
	}),
	secret: 'Sp3c1@lW0rd',
	resave: false,
	saveUninitialized: true,
	name: 'sessionId'
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});


// about page
app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.post('/checkAdmin',function(req,res) {
    checkAdmin.checkLogin(req.body.username,function(data){
        if (data === undefined) {
            console.log("Ce nom d'utilisateur est inconnu !");
            res.redirect ('/login')
        }
        else if (req.body.password === data.password) {
            console.log("super !");
            req.session.name = data.username;
            console.log(req.session.name);
            res.redirect ('/admin')
        } else {
            console.log("votre mot de passe est erroné !");
            res.redirect ('/login')
        }
    });
});

app.get('/admin', function(req,res) {
    if(!req.session.name) {
        res.redirect('/login');
    }
    res.render('pages/admin');
})

app.get('/jouer', function(req, res) {
    readQuiz.getListQuiz(function (data){
    res.render('pages/jouer',{titre:data});
    });
});

// page question
app.get('/questionspage/:id(\\d+)',function(req,res){
    readQuiz.getQuiz(req.params.id, function(data) {
	   res.render('pages/questionspage', {quiz: data});
    });
});

// FAQ page
app.get('/faq', function(req, res) {
    readQuiz.getFaq(function (data) {
        res.render('pages/faq', {varFloat:"floatt", faq: data});
    });
});

app.get('/adminFaq', function(req, res) {
    if(!req.session.name) {
        res.redirect('/login');
    }
    readQuiz.getFaq(function (data) {
        res.render('pages/adminFaq', {varFloat:"floatt", faq: data});
    })
});

app.post('/faqModify', function(req, res) {
    updateQuiz.updateFaq(req.body.question, req.body.reponse, req.body.id, (answer) => {
        readQuiz.getFaq(function (data) {
        res.render('pages/adminFaq', {varFloat:"floatt", update: answer, faq: data});
        });
    });
});

// acceuil page
app.get('/accueil', function(req, res) {
    readQuiz.getLastQuiz(function (dataQuiz){
        readQuiz.getAccueil(function (dataText){
        res.render('pages/accueil', {titre:dataQuiz, text: dataText});
        })
    })
});

app.get('/adminAccueil', function(req, res) {
    if(!req.session.name) {
        res.redirect('/login');
    }
    readQuiz.getAccueil(function (dataText) {
        res.render('pages/adminAccueil', {varFloat:"floatt", text: dataText});
    })
});

app.post('/accueilModify', function(req, res) {
    updateQuiz.updateAccueil(req.body.text1, req.body.text2, req.body.id, (answer) => {
        readQuiz.getAccueil(function (dataText) {
            res.render('pages/adminAccueil', {varFloat:"floatt", update: answer, text: dataText});
        });
    });
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
