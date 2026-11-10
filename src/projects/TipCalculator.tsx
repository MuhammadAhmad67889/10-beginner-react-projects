import { useState } from 'react'

function money(value: number): string {
  return '$' + value.toFixed(2)
}

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPercent, setTipPercent] = useState(0.15)
  const [people, setPeople] = useState('1')

  // Empty or invalid input counts as zero, never NaN on screen.
  const billAmount = Math.max(0, Number(bill) || 0)
  const peopleCount = Math.max(1, Math.floor(Number(people)) || 1)
  const tip = billAmount * tipPercent
  const total = billAmount + tip

  return (
    <div>
      <div className="row">
        <div className="field">
          <label htmlFor="bill">Bill amount ($)</label>
          <input
            id="bill"
            type="number"
            min="0"
            step="0.01"
            value={bill}
            onChange={(event) => setBill(event.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="field">
          <label htmlFor="tip-percent">Tip</label>
          <select
            id="tip-percent"
            value={tipPercent}
            onChange={(event) => setTipPercent(Number(event.target.value))}
          >
            <option value={0.1}>10%</option>
            <option value={0.15}>15%</option>
            <option value={0.18}>18%</option>
            <option value={0.2}>20%</option>
            <option value={0.25}>25%</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="people">People</label>
          <input
            id="people"
            type="number"
            min="1"
            step="1"
            value={people}
            onChange={(event) => setPeople(event.target.value)}
          />
        </div>
      </div>

      <div className="results">
        <div className="stat">
          <span>Tip amount</span>
          <strong data-testid="tip-amount">{money(tip)}</strong>
        </div>
        <div className="stat">
          <span>Total</span>
          <strong data-testid="total">{money(total)}</strong>
        </div>
        <div className="stat">
          <span>Per person</span>
          <strong data-testid="per-person">{money(total / peopleCount)}</strong>
        </div>
      </div>
    </div>
  )
}
