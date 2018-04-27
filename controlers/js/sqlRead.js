const mysql = require('mysql');
const connectionParameters = require('./sqlParameters');

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
    });
  }
  catch (err) {
    throw ("An error occur : "+err);
  }
};

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

getListQuiz = (cb) => {
    try {
        let listQuiz = [];
        const connection = mysql.createConnection(connectionParameters);
        connection.connect((err) => {
            try {
            if (err) {
                throw ('connection with the database failed '+err);
            } else {
            }
            connection.query(
                `SELECT id, title, category FROM Quiz WHERE checked=1 ORDER BY date DESC LIMIT 12`, (err, rows) => {
                    if (err) {
                    throw err;
                    } else {
                        for (var i = 0; i < rows.length; i++) {
                        listQuiz.push({id:rows[i].id, title:rows[i].title, category: rows[i].category});
                        }
                    }
                    cb(listQuiz);
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





module.exports = {
  getQuizInfos,
  getLastQuiz,
  getQuiz,
  getListQuiz
};

// getLastQuiz(function(data) {
//    console.log(JSON.stringify(data,0,2));
//    });

getListQuiz(function(data) {
   console.log(JSON.stringify(data,0,2));
   });

// getQuiz(1,function(data) {
//   console.log(JSON.stringify(data,0,2));
//  });

// getQuizInfos(1,function(data) {
//    console.log(JSON.stringify(data,0,2));
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

*/