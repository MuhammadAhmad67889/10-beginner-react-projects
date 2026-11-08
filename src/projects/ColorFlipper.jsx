import { useState } from 'react'
import ColorCube from '../components/ColorCube'

const HEX_DIGITS = '0123456789ABCDEF'

function randomHex() {
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += HEX_DIGITS[Math.floor(Math.random() * 16)]
  }
  return color
}

export default function ColorFlipper() {
  const [color, setColor] = useState('#0D9488')
  const [copied, setCopied] = useState(false)

  function flip() {
    setColor(randomHex())
    setCopied(false)
  }

  async function copyColor() {
    await navigator.clipboard.writeText(color)
    setCopied(true)
  }

  return (
    <div>
      <div className="color-swatch" style={{ backgroundColor: color }}>
        <span className="color-code" data-testid="color-code">
          {color}
        </span>
      </div>
      <div className="row counter-controls" style={{ marginTop: '1rem' }}>
        <button className="primary" onClick={flip}>
          Flip color
        </button>
        <button onClick={copyColor}>Copy hex code</button>
      </div>
      {copied && <p className="hint success">Copied to clipboard.</p>}
      <div className="cube-wrap">
        <ColorCube color={color} />
      </div>
      <p className="hint" style={{ textAlign: 'center' }}>
        The 3D cube above is the same color as the swatch.
      </p>
    </div>
  )
}
