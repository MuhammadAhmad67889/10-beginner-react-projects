import { useState } from 'react'
import Trophy3D from '../components/Trophy3D'

const QUESTIONS = [
  {
    question: 'Which keyword declares a variable that cannot be reassigned?',
    answers: ['let', 'var', 'const', 'static'],
    correct: 2,
  },
  {
    question: 'What does JSON stand for?',
    answers: [
      'JavaScript Object Notation',
      'Java Standard Output Network',
      'JavaScript Oriented Nodes',
      'Joined Script Object Names',
    ],
    correct: 0,
  },
  {
    question: 'Which method adds an item to the end of an array?',
    answers: ['shift()', 'push()', 'pop()', 'slice()'],
    correct: 1,
  },
  {
    question: 'What is the result of typeof [] in JavaScript?',
    answers: ['array', 'list', 'object', 'undefined'],
    correct: 2,
  },
  {
    question: 'Which of these is NOT a JavaScript data type?',
    answers: ['string', 'boolean', 'float', 'symbol'],
    correct: 2,
  },
]

function resultMessage(score: number, total: number): string {
  if (score === total) return 'Perfect score. You know your stuff!'
  if (score >= total - 1) return 'Great job — nearly perfect.'
  if (score >= Math.ceil(total / 2)) return 'Good start. Try again to beat it.'
  return 'Keep practising — the answers are worth a second look.'
}

export default function QuizApp() {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const question = QUESTIONS[current]

  function answerQuestion(index: number) {
    // One answer per question: once picked, the buttons lock so
    // the score can only count once.
    if (picked !== null) return
    setPicked(index)
    if (index === question.correct) setScore(score + 1)
  }

  function nextQuestion() {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
      setPicked(null)
    }
  }

  function restart() {
    setCurrent(0)
    setScore(0)
    setPicked(null)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="quiz-results">
        <div className="trophy-wrap">
          <Trophy3D />
        </div>
        <h2>Quiz finished!</h2>
        <div className="big-number" data-testid="final-score">
          {score} / {QUESTIONS.length}
        </div>
        <p>{resultMessage(score, QUESTIONS.length)}</p>
        <div className="row counter-controls">
          <button className="primary" onClick={restart}>
            Play again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="quiz-progress" data-testid="progress">
        Question {current + 1} of {QUESTIONS.length}
      </p>
      <p className="quiz-question" data-testid="question">
        {question.question}
      </p>
      <div className="quiz-answers">
        {question.answers.map((answer, index) => {
          let className = ''
          if (picked !== null) {
            if (index === question.correct) className = 'correct'
            else if (index === picked) className = 'wrong'
          }
          return (
            <button
              key={answer}
              className={className}
              disabled={picked !== null}
              onClick={() => answerQuestion(index)}
            >
              {answer}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="primary" onClick={nextQuestion}>
            {current + 1 === QUESTIONS.length ? 'See results' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  )
}
