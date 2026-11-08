import { useState } from 'react'

const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{};:,.<>?',
}

// Pick a random character from the pool without modulo bias:
// values that would skew the odds are thrown away and redrawn.
function randomCharFrom(pool) {
  const max = Math.floor(4294967296 / pool.length) * pool.length
  const random = new Uint32Array(1)
  let value
  do {
    crypto.getRandomValues(random)
    value = random[0]
  } while (value >= max)
  return pool[value % pool.length]
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    const chosen = []
    if (useUppercase) chosen.push(SETS.uppercase)
    if (useLowercase) chosen.push(SETS.lowercase)
    if (useNumbers) chosen.push(SETS.numbers)
    if (useSymbols) chosen.push(SETS.symbols)

    if (chosen.length === 0) {
      setPassword('')
      setMessage('Tick at least one character set.')
      setCopied(false)
      return
    }

    // crypto.getRandomValues, not Math.random: passwords deserve
    // real randomness, and it never leaves the browser.
    const pool = chosen.join('')
    let result = ''
    for (let i = 0; i < length; i++) {
      result += randomCharFrom(pool)
    }
    setPassword(result)
    setMessage('')
    setCopied(false)
  }

  async function copyPassword() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
  }

  return (
    <div>
      <div className="password-output">
        <input
          type="text"
          readOnly
          value={password}
          placeholder="Your password will appear here"
          aria-label="Generated password"
          data-testid="password"
        />
        <button onClick={copyPassword} disabled={!password}>
          Copy
        </button>
      </div>
      {message && <p className="hint">{message}</p>}
      {copied && <p className="hint success">Copied to clipboard.</p>}

      <div className="options">
        <label>
          Length: {length} characters
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            aria-label="Password length"
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={useUppercase}
            onChange={(event) => setUseUppercase(event.target.checked)}
          />
          Uppercase (A–Z)
        </label>
        <label>
          <input
            type="checkbox"
            checked={useLowercase}
            onChange={(event) => setUseLowercase(event.target.checked)}
          />
          Lowercase (a–z)
        </label>
        <label>
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(event) => setUseNumbers(event.target.checked)}
          />
          Numbers (0–9)
        </label>
        <label>
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(event) => setUseSymbols(event.target.checked)}
          />
          Symbols (!@#$…)
        </label>
      </div>

      <div className="row" style={{ marginTop: '1.25rem' }}>
        <button className="primary" onClick={generate}>
          Generate password
        </button>
      </div>
    </div>
  )
}
