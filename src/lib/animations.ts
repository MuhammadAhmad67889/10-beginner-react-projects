import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTrigger is registered once, here, so no component has to
// remember to do it. Every other file just imports these helpers.
gsap.registerPlugin(ScrollTrigger)

// Some people ask their system to reduce motion. When that setting
// is on, we skip the animations entirely and show the final state.
export function animationsEnabled(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Fade and slide a page in when it mounts. Used by every project
// page so they all feel the same.
export function pageEnter(element: Element | null): void {
  if (!element || !animationsEnabled()) return
  gsap.fromTo(
    element,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
  )
}

// A quick scale pop. Used for button presses and for values that
// change, like the counter number or the quiz result.
export function pop(element: Element | null): void {
  if (!element || !animationsEnabled()) return
  gsap.fromTo(
    element,
    { scale: 1.15 },
    { scale: 1, duration: 0.3, ease: 'power2.out' }
  )
}

// Fade a block out and back in. Used when content is replaced,
// like a new quote.
export function fadeSwap(element: Element | null): void {
  if (!element || !animationsEnabled()) return
  gsap.fromTo(
    element,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
  )
}

// Reveal the landing page cards as the user scrolls down to them.
// Returns a cleanup function that removes the triggers, so going
// back to the home page later does not stack up duplicate triggers.
export function setupCardReveals(): () => void {
  if (!animationsEnabled()) return () => {}

  const cards = gsap.utils.toArray<HTMLElement>('.project-card')
  const triggers = cards.map((card) =>
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: 'power2.out',
      // Hand the card back to plain CSS once it has revealed, so the
      // hover lift in the stylesheet works (an inline transform left
      // behind would override it).
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      },
    })
  )

  return () => {
    triggers.forEach((tween) => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill()
      tween.kill()
    })
  }
}
