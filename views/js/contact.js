var express = require('express');
var app = express();
let router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res){
  res.render('../pages/contact.ejs')
});

router.post('/', function(req, res) {
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
subject: "Mailing",
text: req.body.message,
html: '<b>' + req.body.message + '</b>'
}, (error, response) => {
if(error){
console.log(error);
}else{
console.log("Message sent");
}
});
});

module.exports = router;
