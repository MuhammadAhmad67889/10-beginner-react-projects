import { useEffect, useRef, useState } from 'react'
import { fadeSwap } from '../lib/animations'

const QUOTES = [
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  {
    text: 'It is not the language that makes a program good, it is the thinking behind it.',
    author: 'Unknown',
  },
  {
    text: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs',
  },
  {
    text: 'Code is read more often than it is written. Write for the reader.',
    author: 'Unknown',
  },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  {
    text: 'A bug is just a feature you have not understood yet.',
    author: 'Unknown',
  },
  { text: 'The only way to go fast is to go well.', author: 'Robert C. Martin' },
]

function randomIndexExcept(lastIndex: number): number {
  // Never show the same quote twice in a row.
  let index
  do {
    index = Math.floor(Math.random() * QUOTES.length)
  } while (index === lastIndex)
  return index
}

export default function QuoteGenerator() {
  const [index, setIndex] = useState<number>(() =>
    Math.floor(Math.random() * QUOTES.length)
  )
  const [copied, setCopied] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    fadeSwap(quoteRef.current)
  }, [index])

  const quote = QUOTES[index]

  async function copyQuote() {
    await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`)
    setCopied(true)
  }

  function nextQuote() {
    setCopied(false)
    setIndex(randomIndexExcept(index))
  }

  return (
    <div className="quote-box" ref={quoteRef}>
      <blockquote data-testid="quote">&ldquo;{quote.text}&rdquo;</blockquote>
      <p className="author">— {quote.author}</p>
      <div className="row counter-controls" style={{ marginTop: '1.25rem' }}>
        <button className="primary" onClick={nextQuote}>
          New quote
        </button>
        <button onClick={copyQuote}>Copy quote</button>
      </div>
      {copied && <p className="hint success">Copied to clipboard.</p>}
    </div>
  )
}
