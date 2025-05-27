import React, { useState } from 'react';


//! default questions
//import { questions } from './repository/questions';

//! simulado prova
import { questions } from "./repository/prova_p2_circuitosDigitais"

import {
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon
} from '@ionic/react';
import {
  arrowForward,
  checkmarkCircle,
  closeCircle,
  refresh
} from 'ionicons/icons';

const QuestionHeader = ({ currentQuestion, totalQuestions, correctAnswers, difficulty }) => {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Fácil': return 'success';
      case 'Médio': return 'warning';
      case 'Difícil': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <div className="ion-padding-bottom">
      <div className="ion-justify-content-between ion-align-items-center" style={{ display: 'block' }}>
        <IonText>
          <h2>Questão {currentQuestion + 1} de {totalQuestions}</h2>
        </IonText>
        <IonText color={getDifficultyColor(difficulty)}>
          <h2>{difficulty}</h2>
        </IonText>
        <IonText color="primary">
          <h2>Corretas: {correctAnswers}</h2>
        </IonText>
      </div>
    </div>
  );
};



const QuestionCard = ({ question, options, handleAnswer, isAnswered, selectedAnswer, correctAnswer }) => (
  <IonCard style={{ backgroundColor: 'rgb(192,192,192)' }}>
    <IonCardContent>
      <IonText color="light">
        <h1 className="ion-padding-bottom">{question}</h1>
      </IonText>
      <div className="ion-padding-top">
        {Object.entries(options).map(([key, value]) => (
          <IonButton
            key={key}
            expand="block"
            color={
              isAnswered
                ? key === correctAnswer
                  ? 'success'
                  : key === selectedAnswer
                    ? 'danger'
                    : 'medium'
                : 'medium'
            }
            disabled={isAnswered}
            onClick={() => handleAnswer(key)}
            className="ion-margin-bottom"
          >
            <strong className="ion-padding-end" style={{ color: 'black' }}>{key.toUpperCase()})</strong>
            <span style={{ color: 'black' }}>{value}</span>
            {isAnswered && key === correctAnswer && (
              <IonIcon icon={checkmarkCircle} slot="end" />
            )}
            {isAnswered && key === selectedAnswer && key !== correctAnswer && (
              <IonIcon icon={closeCircle} slot="end" />
            )}
          </IonButton>
        ))}
      </div>
    </IonCardContent>
  </IonCard>
);

const QuizGamePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <IonContent>
        <div className="ion-padding ion-text-center">
          <IonCard>
            <IonCardContent>
              <IonText>
                <h1>Resultado Final</h1>
              </IonText>
              <IonText color="primary">
                <h2 className="ion-padding-vertical">
                  {correctAnswers}/{questions.length}
                </h2>
              </IonText>
              <IonText color="medium">
                <p>Respostas corretas</p>
              </IonText>
              <IonButton
                expand="block"
                onClick={resetQuiz}
                className="ion-margin-top"
              >
                <IonIcon icon={refresh} slot="start" />
                Tentar Novamente
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    );
  }

  return (
    <IonContent>
      <div className="ion-padding">
        <QuestionHeader
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          correctAnswers={correctAnswers}
          difficulty={questions[currentQuestion].difficulty}
        />
        <QuestionCard
          question={questions[currentQuestion].question}
          options={questions[currentQuestion].options}
          handleAnswer={handleAnswer}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          correctAnswer={questions[currentQuestion].correctAnswer}
        />
        {isAnswered && (
          <IonButton
            expand="block"
            onClick={nextQuestion}
            className="ion-margin-top"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Próxima Questão
                <IonIcon icon={arrowForward} slot="end" />
              </>
            ) : (
              'Ver Resultado'
            )}
          </IonButton>
        )}
      </div>
    </IonContent>
  );
};

export default QuizGamePage;