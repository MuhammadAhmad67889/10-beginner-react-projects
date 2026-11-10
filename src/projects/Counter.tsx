import { useEffect, useRef, useState } from 'react'
import { pop } from '../lib/animations'

export default function Counter() {
  const [count, setCount] = useState(0)
  const numberRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  // The number pops every time it changes, but not on the very
  // first render — there is nothing to celebrate yet.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    pop(numberRef.current)
  }, [count])

  return (
    <div>
      <div className="big-number" ref={numberRef} data-testid="count">
        {count}
      </div>
      <div className="row counter-controls">
        <button onClick={() => setCount(count - 1)}>Decrease</button>
        <button className="primary" onClick={() => setCount(count + 1)}>
          Increase
        </button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  )
}
