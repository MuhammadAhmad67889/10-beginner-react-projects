import { useEffect, useState } from 'react'

// The calculator only ever holds two numbers and one operator,
// so there is no eval and no string parsing to go wrong.
function calculate(a: number, b: number, op: string): number {
  if (op === '+') return a + b
  if (op === '-') return a - b
  if (op === '*') return a * b
  if (op === '/') return b === 0 ? NaN : a / b
  return b
}

type KeyKind = 'operator' | 'equals'

type CalcKey = {
  label: string
  value: string
  kind?: KeyKind
}

const KEYS: CalcKey[] = [
  { label: 'C', value: 'clear' },
  { label: '⌫', value: 'backspace' },
  { label: '%', value: '%' },
  { label: '÷', value: '/', kind: 'operator' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '×', value: '*', kind: 'operator' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '−', value: '-', kind: 'operator' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '+', value: '+', kind: 'operator' },
  { label: '±', value: 'negate' },
  { label: '0', value: '0' },
  { label: '.', value: '.' },
  { label: '=', value: '=', kind: 'equals' },
]

export default function Calculator() {
  const [current, setCurrent] = useState('0')
  const [previous, setPrevious] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [freshEntry, setFreshEntry] = useState(true)

  function enterDigit(digit: string) {
    if (freshEntry) {
      setCurrent(digit)
      setFreshEntry(false)
    } else if (current.replace('-', '').length < 12) {
      setCurrent(current === '0' ? digit : current + digit)
    }
  }

  function enterDot() {
    if (freshEntry) {
      setCurrent('0.')
      setFreshEntry(false)
    } else if (!current.includes('.')) {
      setCurrent(current + '.')
    }
  }

  function applyOperator(op: string) {
    // Chaining: 7 + 3 + runs the first sum before storing the new operator.
    if (operator !== null && previous !== null && !freshEntry) {
      setCurrent(String(calculate(previous, Number(current), operator)))
    }
    setPrevious(Number(current))
    setOperator(op)
    setFreshEntry(true)
  }

  function press(key: string) {
    if (key >= '0' && key <= '9') return enterDigit(key)
    if (key === '.') return enterDot()
    if (key === 'clear') {
      setCurrent('0')
      setPrevious(null)
      setOperator(null)
      setFreshEntry(true)
    } else if (key === 'backspace') {
      setCurrent(current.length > 1 ? current.slice(0, -1) : '0')
    } else if (key === 'negate') {
      setCurrent(current.startsWith('-') ? current.slice(1) : '-' + current)
    } else if (key === '%') {
      setCurrent(String(Number(current) / 100))
    } else if (key === '=') {
      if (operator !== null && previous !== null) {
        setCurrent(String(calculate(previous, Number(current), operator)))
        setOperator(null)
        setPrevious(null)
        setFreshEntry(true)
      }
    } else {
      applyOperator(key)
    }
  }

  // The physical keyboard works too: digits, + - * /, Enter for
  // equals, Backspace to delete, Escape to clear.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key >= '0' && event.key <= '9') press(event.key)
      else if (event.key === '.') press('.')
      else if (event.key === '+' || event.key === '-' || event.key === '*') {
        press(event.key)
      } else if (event.key === '/') {
        event.preventDefault()
        press('/')
      } else if (event.key === 'Enter' || event.key === '=') press('=')
      else if (event.key === 'Backspace') press('backspace')
      else if (event.key === 'Escape') press('clear')
      else if (event.key === '%') press('%')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // The handler reads the latest state through `press`, which is
    // recreated every render, so it must be re-attached each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  return (
    <div>
      <div className="calc-display" data-testid="display">
        {current}
      </div>
      <div className="calc-keys">
        {KEYS.map((key) => (
          <button
            key={key.value + key.label}
            className={key.kind || ''}
            onClick={() => press(key.value)}
            aria-label={key.label === '⌫' ? 'Backspace' : key.label}
          >
            {key.label}
          </button>
        ))}
      </div>
      <p className="hint" style={{ marginTop: '0.75rem' }}>
        Your keyboard works too: type digits, + − × ÷, Enter for =, Esc to clear.
      </p>
    </div>
  )
}
