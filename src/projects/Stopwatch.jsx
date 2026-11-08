import { useEffect, useRef, useState } from 'react'

function format(ms) {
  const hundredths = Math.floor(ms / 10) % 100
  const seconds = Math.floor(ms / 1000) % 60
  const minutes = Math.floor(ms / 60000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startTimeRef = useRef(0)
  const timerRef = useRef(null)

  function start() {
    startTimeRef.current = Date.now() - elapsed
    timerRef.current = setInterval(() => {
      // Elapsed time is always computed from the clock, never by
      // counting ticks, so pausing and tab switches don't drift it.
      setElapsed(Date.now() - startTimeRef.current)
    }, 30)
    setRunning(true)
  }

  function stop() {
    clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
  }

  function reset() {
    clearInterval(timerRef.current)
    timerRef.current = null
    setElapsed(0)
    setLaps([])
    setRunning(false)
  }

  function addLap() {
    if (!running) return
    setLaps([...laps, elapsed])
  }

  // If the component unmounts while the watch is running, the
  // interval must stop with it.
  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div>
      <div className="stopwatch-time" data-testid="time">
        {format(elapsed)}
      </div>
      <div className="row counter-controls">
        <button className="primary" onClick={running ? stop : start}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={addLap} disabled={!running}>
          Lap
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <ul className="laps">
        {laps.map((lap, index) => (
          <li key={index}>
            Lap {index + 1} — {format(lap)}
          </li>
        ))}
      </ul>
    </div>
  )
}
