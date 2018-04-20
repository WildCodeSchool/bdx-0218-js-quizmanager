//Définition des variables de connection
const mysql      = require('mysql');
const connectionParameters = {
  host     : 'sql7.freemysqlhosting.net',
  user     : 'sql7233387',
  password : 'GmTzKQuY9j',
  database : 'sql7233387'
}
// TODO: a adapter aux paramètres de la base de donnée du fournisseur en production


getQuiz = (id, cb) => {
  try {
  const connection = mysql.createConnection(connectionParameters);
    // Définition des variables
    let callQuiz = {questions: []};
    let questionArr = [];
    let answerArr = [];
    // Initialisation de la connection
    connection.connect((err) => {
      try {
        if (err) {
          throw ('connection with the database failed '+err);
        } else {
          //Requête SQL
          connection.query(
            `SELECT questions.question, answers.answer, answers.great FROM questions
          INNER JOIN answers On questions.id = answers.id_questions
          WHERE id_quiz =${id};`, (err, rows, fields) => {
            //Traitement des erreurs ou des résultats
            if (err) {
              throw err;
            } else {
              // Injection des rangées de réponse dans l'objet callQuiz
                let newQuestion ='';
              for (let i in rows) {
                if (i==0) { // La première entrée dans le tableau me permet d'inscrire les données du quiz et de commencer à entrer mon tableau de réponses
                  newQuestion = rows[i].question;
                  answerArr.push({answer:rows[i].answer,great:rows[i].great});
                } else if (newQuestion === rows[i].question) { // tant que la question est la même je continue à inscrire mes réponses à la suite du tableau de réponses
                  answerArr.push({answer:rows[i].answer,great:rows[i].great});
                } else { // la question n'est plus la même, je rempli mon tableau d'objet questions et je réinitialise mes variables pour recommencer
                  callQuiz.questions.push({question:newQuestion,answers:answerArr});
                  answerArr = [];
                  newQuestion = rows[i].question;
                  answerArr.push({answer:rows[i].answer,great:rows[i].great}); // sans oublier de récupérer la première série de réponse
                }
              }
              callQuiz.questions.push({question:newQuestion,answers:answerArr}); // je rempli une dernière fois mon tableau question car le nom était le même pour la dernière série
            }
            cb(callQuiz);
            });
          }
      } catch (err) {
          throw ("An error occur : "+err);
      } finally {
        connection.end();
      }
    })
  }
  catch (err) {
    throw ("An error occur : "+err);
  }
}

getQuizInfos = (id,cb) => {
  try {
    let quizInfos = {id:'',title:'',category:''};
    const connection = mysql.createConnection(connectionParameters);
    connection.connect((err) => {
      try {
        if (err) {
          throw ('connection with the database failed '+err);
        } else {
        }
        connection.query(
          `SELECT id, title, category FROM Quiz WHERE id=${id};`, (err, rows) => {
              if (err) {
                throw err;
              } else {
                 quizInfos.id=rows[0].id;
                 quizInfos.title=rows[0].title;
                 quizInfos.category=rows[0].category;
              }
            cb(quizInfos);
        });
      } catch (err) {
        throw ('An error occur '+ err);
      } finally {
          connection.end();
      }
    });
  } catch (err) {
    throw ('An error occur: '+err);
  }
}

getLastQuiz = (cb) => {
  try {
    let lastQuiz = [];
    const connection = mysql.createConnection(connectionParameters);
    connection.connect((err) => {
      try {
        if (err) {
          throw ('connection with the database failed '+err);
        } else {
        }
        connection.query(
          `SELECT id, title, category FROM Quiz WHERE checked=1 ORDER BY date DESC LIMIT 4`, (err, rows) => {
              if (err) {
                throw err;
              } else {
                  for (var i = 0; i < rows.length; i++) {
                    lastQuiz.push({id:rows[i].id, title:rows[i].title, category: rows[i].category});
                  }
              }
            cb(lastQuiz);
        });
      } catch (err) {
        throw ('An error occur '+ err);
      } finally {
          connection.end();
      }
    });
  } catch (err) {
    throw ('An error occur: '+err);
  }
}

setQuiz = (obj) => {
   try {
    let lastQuiz = [];
    const connection = mysql.createConnection(connectionParameters);
    connection.connect((err) => {
      try {
        if (err) {
          throw ('connection with the database failed '+err);
        } else {
          connection.query(
          `INSERT INTO Quiz(title, category) VALUES ('${obj.title}','${obj.category}');`, (err, rows) => {
              if (err) {
                throw err;
              } else {
                let idQuiz = rows.insertId;
                for (var i = 0; i < 10; i++) {
                  const numQuestion = i;
                  connection.query(
                    `INSERT INTO questions(question, id_quiz) VALUES ('${obj.questions[i].question}','${idQuiz}');`, (err, rows) => {
                      if (err) {
                        console.log(err);
                        throw err;
                      } else {
                        let idQuestion = rows.insertId;
                        for (var j = 0; j < 4; j++) {
                          console.log(`INSERT INTO answers(answer, great, id_questions) VALUES ('${obj.questions[numQuestion].answers[j].answer}', '${obj.questions[numQuestion].answers[j].great}' ,'${idQuestion}');`);
                             connection.query(
                            `INSERT INTO answers(answer, great, id_questions) VALUES ('${obj.questions[numQuestion].answers[j].answer}', '${obj.questions[numQuestion].answers[j].great}' ,'${idQuestion}');`, (err, rows) => {
                              if (err) {
                                throw err;
                              }
                            })
                        }
                      }
                    })
                }
            }
          })
        }
      } catch (err) {
        throw ('An error occur '+ err);
      } finally {
        connection.end;
      }
    })
  } catch (err) {
    throw ('An error occur '+ err);
  }
}


module.exports = getQuizInfos;
module.exports = getLastQuiz;
module.exports = getQuiz;

// getLastQuiz(function(data) {
//       console.log(JSON.stringify(data,0,2));
//   });

// getQuiz(1,function(data) {
//         console.log(JSON.stringify(data,0,2));
//   });

// getQuizInfos(1,function(data) {
//         console.log(JSON.stringify(data,0,2));
//   });


let newQuiz =

  {title: "France",category:"Histoire", questions:[

  {question: "Apparition de l'homme", answers: [
    {answer:"10M avt JC", great:"0"},
    {answer:"5M avt JC", great:"0"},
    {answer:"3M avt JC", great:"1"},
    {answer:"2M avt JC", great:"0"}
  ]},

 {question: "La préhistoire débute", answers: [
    {answer:"A l'apparition de l'homme", great:"0"},
    {answer:"A l'invention de l'écriture", great:"1"},
    {answer:"A l'âge de fer", great:"0"},
    {answer:"A l'âge de pierre", great:"0"}
  ]},

   {question: "En 1500 avt JC, la France est conquise par", answers: [
    {answer:"Les celtes", great:"0"},
    {answer:"Les tribus belges", great:"0"},
    {answer:"Les Arvernes", great:"1"},
    {answer:"Les Wisigoth", great:"0"}
  ]},

   {question: "L'age de fer débute", answers: [
    {answer:"1500 avt JC", great:"0"},
    {answer:"700 avt JC", great:"1"},
    {answer:"300 avt JC", great:"0"},
    {answer:"300 apres JC", great:"0"}
  ]},

   {question: "Début de l'Antiquité", answers: [
    {answer:"10000 avt JC", great:"0"},
    {answer:"3000 avt JC", great:"1"},
    {answer:"En 476", great:"0"},
    {answer:"A votre inscription à la Wild", great:"0"}
  ]},

   {question: "Défaite de Vercigétorix à Alésia par", answers: [
    {answer:"Le commandant Coustau", great:"0"},
    {answer:"Charlemagne", great:"0"},
    {answer:"Les vikings", great:"0"},
    {answer:"Jules César", great:"1"}
  ]},

   {question: "Clovis 1er est le premier des", answers: [
    {answer:"Carolingiens", great:"1"},
    {answer:"Mérovingiens", great:"0"},
    {answer:"Capéciens", great:"0"},
    {answer:"SorsLeChien", great:"0"}
  ]},

   {question: "Quel est le surnom des rois Mérovingiens", answers: [
    {answer:"Les chevelus", great:"1"},
    {answer:"Les barbus", great:"0"},
    {answer:"Les Moustachus", great:"0"},
    {answer:"Les Bitniks", great:"0"}
  ]},

   {question: 'Charlemagne signifie', answers: [
    {answer:'Charles le prompt', great:'0'},
    {answer:'Charles le grand', great:'0'},
    {answer:'Charles le magnifique', great:'1'},
    {answer:'Charles,....magnes', great:'0'}
  ]},

   {question: "Quel Capitale Charlemagne c'est choisie", answers: [
    {answer:"Paris", great:"0"},
    {answer:"Lyon", great:"0"},
    {answer:"Aix la Chapelle", great:"1"},
    {answer:"Reims", great:"0"}
  ]}

]};

// getQuiz(1,function(data) {
//         setQuiz(data);
//   });

/* Pour appeler la fonction getQuiz, il faut mettre un callback qui retournera l'objet voulu comme dans l'exemple ci dessous

Le 1 correspond à l'Id du quiz que vous voulez charger
La fonction en exemple affichera le résultat dans la console de manière "lisible"


La solution en dessous nous permettra de prévoir des routes passant en paramètre l'objet correspondant

router.get("/:id",(req,res)=>{

  getQuiz(1, function(err,data){
    res.render("mavue",{quiz});

  });
}

 TOTO: Début du travail pour l'insertion de données en récupérant l'Id de l'insertion
connection.query('INSERT INTO posts SET ?', {title: 'test'}, function (error, results, fields) {
  if (error) throw error;
  console.log(results.insertId);
});
*/
