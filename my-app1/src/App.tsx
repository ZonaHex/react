import React, {useState} from 'react';
//components
import QuestionCard  from './components/QuestionCard'
//types
import {Difficulty, fetchQuizQuestions, QuestionState} from "./API";

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
}


const TOTAL_QUESTIONS = 3;

const App = () => {

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    console.log(questions);
    const startTrivia = async  () => {
        setLoading(true);
        setGameOver(false);

        const newQuestions = await fetchQuizQuestions(
            TOTAL_QUESTIONS,
            Difficulty.EASY
        );

        setQuestions(newQuestions);
        setScore(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);

    };

    
    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(!gameOver) {
            //users answer
            const answer = e.currentTarget.value;
            //check if answer is right
            const correct = questions[number].correct_answer === answer;
            //答对就加分
            if(correct) setScore(prev => prev + 1);
            //save answer in the array of user answers
            const answerObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer,
            };
            setUserAnswers(prev => [...prev, answerObject])
        }
    };
    
    const nextQuestion = () => {
        //下一个问题的序号
        const nextQuestion = number + 1;

        if(nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true);
        } else {
            setNumber(nextQuestion);
        }
    };
    
  return (
    <div className="App">
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ?

        <button className="start" onClick={startTrivia}>
            Start
        </button>

            : null}
        {/*检查是否可以start 如果游戏结束或者问题全答完，那么可以重新开始*/}

        {!gameOver ?
            <p className="score">
            Score: {score}
        </p>
            : null}
        {loading &&
        <p>Loading Questions...</p>}
        {/*如果在loading就显示正在loading*/}
        {!loading && !gameOver &&
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers = {questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        /> }
        {/*如果没在loading而且游戏没结束那就显示问题卡*/}

        {!gameOver &&
        !loading &&
        userAnswers.length === number +1 &&
        number !== TOTAL_QUESTIONS - 1 ?

        <button className="next" onClick={nextQuestion}>
            Next Question
        </button>
            :null}
        {/*下一个问题的条件*/}

    </div>
  );
}

export default App;

