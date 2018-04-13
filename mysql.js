//Définition des variables de connection
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'S3cr3t',
  database : 'quizDb'
});
// TODO: a adapter aux paramètres de la base de donnée du fournisseur en production


getQuiz = (id) => {
  // Définition des variables
  let callQuiz = {title: '', category: '', questions: []};
  let questionArr = [];
  let answerArr = [];
  // Initialisation de la connection
  connection.connect((err) => {
    if (err) {
      throw ('connection with the database failed '+err);
    } else {
      console.log('connection succesfull');
    //Requête SQL
    connection.query(
      `SELECT Quiz.category, Quiz.title, questions.question, answers.answer, answers.great FROM Quiz
    INNER JOIN questions ON Quiz.id = questions.id_quiz
    INNER JOIN answers On questions.id = answers.id_questions
    WHERE Quiz.id =${id};`, (err, rows, fields) => {
      //Traitement des erreurs ou des résultats
      if (err) {
        throw err;
      } else {
        // Injection des rangées de réponse dans l'objet callQuiz
          let newQuestion ='';
        for (let i in rows) {
          if (i==0) { // La première entrée dans le tableau me permet d'inscrire les données du quiz et de commencer à entrer mon tableau de réponses
            callQuiz.title = rows[i].title;
            callQuiz.category = rows[i].category;
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
      connection.end();
      console.log(JSON.stringify(callQuiz,0,4));
      return callQuiz; // TODO: rentre le tout asynchrone pour pouvoir récupérer mon quiz dans une variable !!!
      });
    }
  });
}


getQuiz(1);