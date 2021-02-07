const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const questionCounterText = document.getElementById('questionCounter');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionTracker= 0;
let availableQuesions = [];

let questions = [];

function displayapiquestions() {
    fetch(
        'https://opentdb.com/api.php?amount=10&category=19&difficulty=hard&type=multiple'
    )
        .then((res) => {
            return res.json();
        })
        .then((loadedQuestions) => {
            questions = loadedQuestions.results.map((loadedQuestion) => {
                const formattedQuestion = {
                    question: loadedQuestion.question,
                };
    
                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
                answerChoices.splice(
                    formattedQuestion.answer - 1,
                    0,
                    loadedQuestion.correct_answer
                );
    
                answerChoices.forEach((choice, index) => {
                    formattedQuestion['choice' + (index + 1)] = choice;
                });
    
                return formattedQuestion;
            });
            startGame();
        })
        .catch((err) => {
            console.error(err);
        });
}
displayapiquestions()

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

function getNewQuestion(){
    if (availableQuestions.length === 0 || questionTracker >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        checkforscore();
        return window.location.assign('Ending.html');
        
    }
    questionTracker++;
    questionCounterText.innerText = `Question ${questionTracker}/${MAX_QUESTIONS}`;
    
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const checkforcorrect =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if (checkforcorrect === 'correct') {
            incrementScore(CORRECT_BONUS);
            rightalert();
        }
        else{
            wrongalert();
            alert("The correct option is, Option: " + currentQuestion.answer);
        }
        selectedChoice.parentElement.classList.add(checkforcorrect);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(checkforcorrect);
            getNewQuestion();
        }, 1000);
    });
});

function startGame() {
    questionTracker = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};
incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
function wrongalert() {
    alert("That is the wrong answer");
}
  function rightalert() {
    alert("Good job. That is the correct answer");
}
function checkforscore(){
    if (countscore === 100){
        alert("Superb Job!, you have answered all the answers correctly!");
    }
    if(countscore >= 70 && countscore > 50 ){
        alert("Not bad!, you man managed answer some of the questions correctly");
    }
      
    if(countscore > 70 && countscore < 100){
       
     alert("Well done!, you man managed answer majority of the questions correctly");
    }
    else{
        alert("Try better next time!");
    }
    
}   