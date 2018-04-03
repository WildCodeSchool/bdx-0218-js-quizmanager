const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'S3cr3t',
  database : 'quizDb'
});

connection.connect((err) => {
  if (err) {
  	throw ('connetion with the database failed '+err);
  } else {
  	console.log('connection succesfull');
  }
});

let questionArr = [];

connection.query('SELECT id_questions, question FROM `questions` WHERE id_quiz=1', (err, rows, fields) => {
	if (err) {
		throw err;
	} else {
		for (var i in rows) {
        questionArr.push(rows[i].question);
    	}
	}
});

let answerArr = [];

connection.query('SELECT answer FROM `answers`', (err, rows, fields) => {
	if (err) {
		throw err;
	} else {
		for (var i in rows) {
        answerArr.push(rows[i].question);
    	}
	}
});

connection.end();

console.log(questionArr);
console.log(answerArr);