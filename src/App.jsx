import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { animationsEnabled, pageEnter, setupCardReveals } from './lib/animations'
import Counter from './projects/Counter'
import TodoList from './projects/TodoList'
import Calculator from './projects/Calculator'
import Stopwatch from './projects/Stopwatch'
import QuoteGenerator from './projects/QuoteGenerator'
import ColorFlipper from './projects/ColorFlipper'
import TipCalculator from './projects/TipCalculator'
import PasswordGenerator from './projects/PasswordGenerator'
import RockPaperScissors from './projects/RockPaperScissors'
import QuizApp from './projects/QuizApp'

// One list drives both the landing page and the page switcher,
// so a project can never exist on one and not the other.
const PROJECTS = [
  {
    id: 'counter',
    title: 'Counter',
    subtitle: 'Tap Increase to count up, Decrease to count down.',
    accent: '#2563eb',
    Component: Counter,
  },
  {
    id: 'todo',
    title: 'Todo List',
    subtitle: 'Saved in this browser — a refresh keeps your list.',
    accent: '#16a34a',
    Component: TodoList,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    subtitle: 'Buttons and your keyboard. No eval, just plain math.',
    accent: '#2563eb',
    Component: Calculator,
  },
  {
    id: 'stopwatch',
    title: 'Stopwatch',
    subtitle: 'Start the watch, record laps, reset when you’re done.',
    accent: '#7c3aed',
    Component: Stopwatch,
  },
  {
    id: 'quote',
    title: 'Quote Generator',
    subtitle: 'Short quotes about code, one click at a time.',
    accent: '#be123c',
    Component: QuoteGenerator,
  },
  {
    id: 'color',
    title: 'Color Flipper',
    subtitle: 'Tap Flip for a random background colour — and a 3D cube.',
    accent: '#0d9488',
    Component: ColorFlipper,
  },
  {
    id: 'tip',
    title: 'Tip Calculator',
    subtitle: 'Enter the bill and the tip — the split updates as you type.',
    accent: '#059669',
    Component: TipCalculator,
  },
  {
    id: 'password',
    title: 'Password Generator',
    subtitle: 'Made on your device with random values — nothing is sent anywhere.',
    accent: '#4f46e5',
    Component: PasswordGenerator,
  },
  {
    id: 'rps',
    title: 'Rock Paper Scissors',
    subtitle: 'Pick rock, paper, or scissors. The score keeps count.',
    accent: '#ea580c',
    Component: RockPaperScissors,
  },
  {
    id: 'quiz',
    title: 'Quiz App',
    subtitle: 'Five questions. Pick an answer to move on.',
    accent: '#9333ea',
    Component: QuizApp,
  },
]

export default function App() {
  const [page, setPage] = useState('home')
  const projectRef = useRef(null)

  const active = PROJECTS.find((project) => project.id === page)
  const activeIndex = PROJECTS.findIndex((project) => project.id === page)

  // ScrollTrigger reveals only exist on the landing page. When the
  // user comes back home, they are set up again from scratch.
  useEffect(() => {
    if (page !== 'home') return undefined
    const cleanup = setupCardReveals()
    return cleanup
  }, [page])

  // Every project page slides in when it mounts.
  useEffect(() => {
    if (active) pageEnter(projectRef.current)
  }, [active])

  // Button press feedback for every button on a project page,
  // handled in one place instead of in each component.
  useEffect(() => {
    if (!active || !animationsEnabled()) return undefined
    const root = projectRef.current
    function onClick(event) {
      const button = event.target.closest('button')
      if (button) {
        gsap.fromTo(
          button,
          { scale: 0.94 },
          { scale: 1, duration: 0.25, ease: 'power2.out' }
        )
      }
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [active])

  function goHome(event) {
    event.preventDefault()
    setPage('home')
    window.scrollTo(0, 0)
  }

  function openProject(event, id) {
    event.preventDefault()
    setPage(id)
    window.scrollTo(0, 0)
  }

  if (active) {
    const { Component } = active
    return (
      <div className="page project-page" style={{ '--accent': active.accent }}>
        <a className="back" href="#/" onClick={goHome}>
          &larr; All projects
        </a>
        <div ref={projectRef}>
          <p className="eyebrow">
            Project {String(activeIndex + 1).padStart(2, '0')} of 10
          </p>
          <h1>{active.title}</h1>
          <p className="subtitle">{active.subtitle}</p>
          <div className="card">
            <Component />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">React · Vite · GSAP · Three.js</p>
        <h1>10 Beginner React Projects</h1>
        <p className="hero-sub">
          The same ten small apps from my vanilla JavaScript repo, rebuilt in
          React — with GSAP animations and a little Three.js on top. Pick one
          and play with it.
        </p>
      </header>

      <main className="project-grid">
        {PROJECTS.map((project, index) => (
          <button
            key={project.id}
            className="project-card"
            style={{ '--accent': project.accent }}
            onClick={(event) => openProject(event, project.id)}
          >
            <span className="number">{String(index + 1).padStart(2, '0')}</span>
            <h2>{project.title}</h2>
            <p>{project.subtitle}</p>
          </button>
        ))}
      </main>

      <p className="footer-note">
        Built with React, Vite, GSAP and Three.js. No router, no backend, no
        data leaves your browser.
        <br />
        <a href="https://github.com/MuhammadAhmad67889/10-beginner-react-projects">
          View the code on GitHub
        </a>
        {' · '}
        <a href="https://github.com/MuhammadAhmad67889/10-beginner-javascript-projects">
          Vanilla JS version
        </a>
      </p>
    </div>
  )
}
