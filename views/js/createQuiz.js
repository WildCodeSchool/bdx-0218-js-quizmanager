let newQuiz = {
    title:'',
    category:'',
    questions: []
};

let questions = {
    question:'',
    answers: []
};

let answers = {
    answer:'',
    great:''
};

let index = 0;

const quizAnswers = document.getElementById('quizAnswers');
const past = document.getElementById('past');
const next = document.getElementById('next');
const begin = document.getElementById('textOui');
const question = document.getElementById('question');
const reponse1 = document.getElementById('reponse1');
const reponse2 = document.getElementById('reponse2');
const reponse3 = document.getElementById('reponse3');
const reponse4 = document.getElementById('reponse4');
const numero = document.getElementById('numeroQuestion');
const quizyTalk = document.getElementById('quizyTalk');
const great1 = document.getElementById('great1');
const great2 = document.getElementById('great2');
const great3 = document.getElementById('great3');
const great4 = document.getElementById('great4');

begin.addEventListener('click', function(e) {
    e.preventDefault();
    quizAnswers.style.display = 'block';
    next.style.display = 'block'; 
    
    begin.style.display = "none";
    document.getElementsByClassName('cadreQuestion')[0].style.display = "none";
    newQuiz.title = document.getElementById('titre').value;
    newQuiz.category = document.getElementById('category').value;
    quizyTalk.textContent = 'Pensez à cocher la bonne réponse';
    getQuestions(index);
});

past.addEventListener('click', function(e){
    e.preventDefault();
    if ((index>0) && (index<10)) {
        addQuestion(index);
        index --;
        getQuestions(index);
        checkIndex(index);
    } else if (index===10) {
        quizAnswers.style.display = "block";
        index --;
        getQuestions(index);
        checkIndex(index);
        quizyTalk.textContent = 'Pensez à cocher la bonne réponse';
        next.textContent = "NEXT";
    }
})

next.addEventListener('click', function(e){
    e.preventDefault();
    if (index<9) {
        addQuestion(index);
        index ++;
        getQuestions(index);
        checkIndex(index);
    } else if (index ===9) {
        addQuestion(index);
        index ++;
        endOfCreation();
    } else if (index>9) {
        // setQuiz(quiz, function(data){
//     console.log('job done, new quiz id :'+ data);
// });
    }
})

const endOfCreation = () => {
    next.textContent = "ENREGISTRER";
    quizyTalk.textContent = "Prenez le temps de bien vérifier votre Quiz";
    quizAnswers.style.display = "none";
    numero.textContent = "Vous avez complété votre quiz, vous pouvez l'enregister";
}

const checkIndex = (index) => {
    if (index===0) {
        past.style.display = 'none';
    } else if (index ===1) {
        past.style.display = 'block';
    }    
}

const addQuestion = (index) => {
    let answer1 = {answer:reponse1.value, great: great1.checked};
    let answer2 = {answer:reponse2.value, great: great2.checked};
    let answer3 = {answer:reponse3.value, great: great3.checked};
    let answer4 = {answer:reponse4.value, great: great4.checked};
    questions.answers.push(answer1, answer2, answer3, answer4);
    questions.question = question.value;
    newQuiz.questions[index] = questions;
    console.log(JSON.stringify(newQuiz,0,2))
    questions = {
        question:'',
        answers: []
    };
    
    answers = {
        answer:'',
        great:''
    };
}

const getQuestions = (index) => {
    numero.textContent ='Question N°'+(index+1);
}

