import { useEffect, useRef, useState } from 'react'
import { pop } from '../lib/animations'

const CHOICES = ['rock', 'paper', 'scissors']
// Each key beats the value next to it: rock beats scissors, and so on.
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' }
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' }

export default function RockPaperScissors() {
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [result, setResult] = useState('Pick one to start.')
  const resultRef = useRef(null)
  const firstRender = useRef(true)

  // The result pops in after every round so the outcome is easy to spot.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    pop(resultRef.current)
  }, [result])

  function play(playerChoice) {
    const computerChoice =
      CHOICES[Math.floor(Math.random() * CHOICES.length)]

    if (playerChoice === computerChoice) {
      setResult(`Both picked ${playerChoice}. It's a draw.`)
    } else if (BEATS[playerChoice] === computerChoice) {
      setPlayerScore(playerScore + 1)
      setResult(`${playerChoice} beats ${computerChoice}. You win this round!`)
    } else {
      setComputerScore(computerScore + 1)
      setResult(`${computerChoice} beats ${playerChoice}. Computer wins this round.`)
    }
  }

  function reset() {
    setPlayerScore(0)
    setComputerScore(0)
    setResult('Pick one to start.')
  }

  return (
    <div>
      <div className="choices">
        {CHOICES.map((choice) => (
          <button key={choice} onClick={() => play(choice)}>
            {EMOJI[choice]} {choice[0].toUpperCase() + choice.slice(1)}
          </button>
        ))}
      </div>
      <p className="score-line" data-testid="score">
        You {playerScore} — {computerScore} Computer
      </p>
      <p className="rps-result result-line" ref={resultRef} data-testid="result">
        {result}
      </p>
      <div className="row counter-controls" style={{ marginTop: '1rem' }}>
        <button onClick={reset}>Reset score</button>
      </div>
    </div>
  )
}
