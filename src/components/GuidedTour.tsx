import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Globe2 } from 'lucide-react'
import { Dialog, DialogContent } from './ui/dialog'
import type { Language } from '../lib/types'

type Localized = Record<Language, string>
type Step = { id: string; title: Localized; text: Localized }

const steps: Step[] = [
  {
    id: 'material',
    title: { de: 'Material auswählen', en: 'Select a material' },
    text: {
      de: 'Wähle zuerst die Materialsorte und anschließend den Materialtyp. Eigene Materialien kannst du später über das Menü ergänzen.',
      en: 'Choose a material family, then select a material type. You can add your own materials later through the menu.',
    },
  },
  {
    id: 'weights',
    title: { de: 'Gewichte eingeben', en: 'Enter the weights' },
    text: {
      de: 'Trage die gewogenen Mengen von Komponente A und B ein. Die Dosierung wird sofort berechnet. Wichtig: Nur Gewichte verwenden, keine Volumenangaben.',
      en: 'Enter the measured weights of components A and B. The dosing ratio is calculated instantly. Important: Use weights, not volumes.',
    },
  },
  {
    id: 'sample',
    title: { de: 'Aktuelle Probe', en: 'Current sample' },
    text: {
      de: 'Hier siehst du das Ergebnis und, falls hinterlegt, die Herstellervorgabe. Mit „Probe übernehmen“ fügst du den Wert zur Messreihe hinzu.',
      en: 'See the result here and, when available, the manufacturer specification. Use “Add sample” to add the value to the series.',
    },
  },
  {
    id: 'series',
    title: { de: 'Messreihe und Mittelwert', en: 'Measurement series and average' },
    text: {
      de: 'Erfasse bis zu fünf Proben. Alle Ergebnisse werden übersichtlich angezeigt und der Mittelwert automatisch berechnet.',
      en: 'Record up to five samples. All results are displayed together and the average is calculated automatically.',
    },
  },
  {
    id: 'chart',
    title: { de: 'Optionales Diagramm', en: 'Optional chart' },
    text: {
      de: 'Klappe das Diagramm bei Bedarf auf. Es zeigt den Verlauf deiner Proben sowie Sollwert und Toleranzgrenzen, sofern vorhanden.',
      en: 'Expand the chart whenever you need it. It shows your sample trend, target value and tolerance limits when available.',
    },
  },
]

type TourProps = {
  language: Language
  stepIndex: number | null
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

type Highlight = { top: number; left: number; width: number; height: number }

export function LanguageWelcome({
  open, onSelect,
}: {
  open: boolean
  onSelect: (language: Language) => void
}) {
  return (
    <Dialog open={open}>
      <DialogContent dismissible={false} title="Sprache auswählen / Choose a language">
        <div className="intro-language">
          <Globe2 className="intro-language-icon" aria-hidden="true" />
          <p>Bitte wähle die Sprache für das Dosier-Tool.</p>
          <p lang="en">Please choose your preferred language.</p>
          <div className="intro-language-options">
            <button type="button" lang="de" onClick={() => onSelect('de')}>
              <strong>Deutsch</strong><small>App auf Deutsch starten</small>
            </button>
            <button type="button" lang="en" onClick={() => onSelect('en')}>
              <strong>English</strong><small>Start in English</small>
            </button>
          </div>
          <p className="intro-language-hint">
            Du kannst die Sprache später im Menü ändern.
            <span lang="en">You can change the language later in the menu.</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const ONBOARDING_STEPS = steps.length

export function GuidedTour({ language, stepIndex, onBack, onNext, onSkip }: TourProps) {
  const [highlight, setHighlight] = useState<Highlight | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const enabled = stepIndex !== null
  const step = enabled ? steps[stepIndex] : null
  const de = language === 'de'

  useEffect(() => {
    if (!step) return
    const element = document.querySelector<HTMLElement>(`[data-tour="${step.id}"]`)
    if (!element) { setHighlight(null); return }

    const updatePosition = () => {
      const bounds = element.getBoundingClientRect()
      const padding = 6
      const left = Math.max(8, bounds.left - padding)
      const top = Math.max(8, bounds.top - padding)
      const right = Math.min(window.innerWidth - 8, bounds.right + padding)
      const bottom = Math.min(window.innerHeight - 8, bounds.bottom + padding)
      setHighlight(right > left && bottom > top ? {
        top, left, width: right - left, height: bottom - top,
      } : null)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center', inline: 'nearest' })
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    const observer = new ResizeObserver(updatePosition)
    observer.observe(element)
    const timer = window.setTimeout(updatePosition, reducedMotion ? 0 : 500)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      observer.disconnect()
    }
  }, [step?.id])

  useEffect(() => {
    if (!enabled) return
    panel.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onSkip() }
      if (event.key !== 'Tab' || !panel.current) return
      const buttons = Array.from(panel.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
      if (!buttons.length) return
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [enabled, stepIndex, onSkip])

  if (!step) return null

  const last = stepIndex === steps.length - 1
  return (
    <div className="intro-tour-layer" role="dialog" aria-modal="true" aria-label={de ? 'Einführung in das Dosier-Tool' : 'Dosing tool introduction'}>
      {highlight
        ? <div className="intro-tour-highlight" style={highlight} aria-hidden="true" />
        : <div className="intro-tour-dim" aria-hidden="true" />}
      <div ref={panel} className="intro-tour-panel" tabIndex={-1} aria-live="polite">
        <div className="intro-tour-topline">
          <span>{de ? 'Kurze Einführung' : 'Quick introduction'}</span>
          <span>{stepIndex + 1} / {steps.length}</span>
        </div>
        <div className="intro-tour-progress" aria-hidden="true">
          {steps.map((item, i) => <span key={item.id} className={i <= stepIndex ? 'is-active' : ''} />)}
        </div>
        <h2>{step.title[language]}</h2>
        <p>{step.text[language]}</p>
        <div className="intro-tour-actions">
          <button type="button" className="intro-tour-skip" onClick={onSkip}>
            {de ? 'Überspringen' : 'Skip tour'}
          </button>
          <div>
            {stepIndex > 0
              ? <button type="button" className="intro-tour-back" onClick={onBack}>
                  <ArrowLeft size={16} aria-hidden="true" />{de ? 'Zurück' : 'Back'}
                </button>
              : null}
            <button type="button" className="intro-tour-next" onClick={onNext}>
              {last ? (de ? 'Fertig' : 'Finish') : (de ? 'Weiter' : 'Next')}
              {last ? <Check size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
