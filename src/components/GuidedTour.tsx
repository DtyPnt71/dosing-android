import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Globe2, Sparkles, X } from 'lucide-react'
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
  {
    id: 'menu',
    title: { de: 'Menü und Einstellungen', en: 'Menu and settings' },
    text: {
      de: 'Hier kannst du eigene Materialien anlegen und verwalten oder die Sprache ändern. Mit „Tutorial starten“ kannst du die Einführung jederzeit erneut ansehen.',
      en: 'Create and manage custom materials or change the language here. Choose “Start tutorial” whenever you want to revisit this introduction.',
    },
  },
]

type TourProps = {
  language: Language
  stepIndex: number | null
  menuVisible: boolean
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

type Placement = { top: number; left: number; width: number; side: 'above' | 'below' | 'left' | 'right' }
type Highlight = { top: number; left: number; width: number; height: number }

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function GuidedTour({ language, stepIndex, menuVisible, onBack, onNext, onSkip }: TourProps) {
  const [highlight, setHighlight] = useState<Highlight | null>(null)
  const [placement, setPlacement] = useState<Placement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const enabled = stepIndex !== null
  const step = enabled ? steps[stepIndex] : null
  const de = language === 'de'

  useEffect(() => {
    if (!step) { setHighlight(null); setPlacement(null); return }
    let cancelled = false
    let observer: ResizeObserver | null = null
    let target: HTMLElement | null = null
    const timeouts: number[] = []
    const viewport = () => {
      const visual = window.visualViewport
      return {
        top: visual?.offsetTop ?? 0,
        height: visual?.height ?? window.innerHeight,
        width: visual?.width ?? window.innerWidth,
      }
    }
    const updatePosition = () => {
      if (cancelled || !target) return
      const view = viewport()
      const rect = target.getBoundingClientRect()
      const margin = 12
      const gap = 14
      const visibleTop = Math.max(view.top + 8, rect.top - 5)
      const visibleBottom = Math.min(view.top + view.height - 8, rect.bottom + 5)
      const visibleLeft = Math.max(8, rect.left - 5)
      const visibleRight = Math.min(view.width - 8, rect.right + 5)
      if (visibleBottom <= visibleTop || visibleRight <= visibleLeft) {
        setHighlight(null)
        return
      }
      setHighlight({
        top: visibleTop, left: visibleLeft,
        width: visibleRight - visibleLeft, height: visibleBottom - visibleTop,
      })

      const cardWidth = Math.min(374, view.width - margin * 2)
      const cardHeight = panel.current?.getBoundingClientRect().height || 238
      const bottomSpace = view.top + view.height - (visibleBottom + gap + margin)
      const topSpace = visibleTop - view.top - gap - margin
      const rightSpace = view.width - visibleRight - gap - margin
      const leftSpace = visibleLeft - gap - margin
      const preferredSide = step.id === 'chart' ? 'above' : 'below'
      let side: Placement['side'] = preferredSide

      // Wide layouts can position the coachmark beside the feature. The menu
      // drawer is on the right, so its coachmark favors the free left side.
      if (step.id === 'menu' && leftSpace >= cardWidth + 4) side = 'left'
      else if (rightSpace >= cardWidth + 4) side = 'right'
      else if (preferredSide === 'above' && topSpace >= cardHeight) side = 'above'
      else if (bottomSpace >= cardHeight) side = 'below'
      else if (topSpace >= cardHeight) side = 'above'
      else side = bottomSpace > topSpace ? 'below' : 'above'

      let left = margin
      let top = view.top + margin
      if (side === 'left') {
        left = visibleLeft - cardWidth - gap
        top = visibleTop + (visibleBottom - visibleTop - cardHeight) / 2
      } else if (side === 'right') {
        left = visibleRight + gap
        top = visibleTop + (visibleBottom - visibleTop - cardHeight) / 2
      } else {
        left = visibleLeft + (visibleRight - visibleLeft - cardWidth) / 2
        top = side === 'above' ? visibleTop - cardHeight - gap : visibleBottom + gap
      }
      left = Math.min(Math.max(left, margin), view.width - cardWidth - margin)
      top = Math.min(Math.max(top, view.top + margin), view.top + view.height - cardHeight - margin)
      setPlacement({ top, left, width: cardWidth, side })
    }

    const locate = (attempt = 0) => {
      if (cancelled) return
      target = document.querySelector<HTMLElement>('[data-tour="' + step.id + '"]')
      if (!target) {
        if (attempt < 24) timeouts.push(window.setTimeout(() => locate(attempt + 1), 60))
        else { setHighlight(null); setPlacement(null) }
        return
      }

      if (step.id === 'menu') {
        // The drawer is fixed, but the app header should be visible when
        // finishing the tour, regardless of previous scrolling.
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'instant' : 'smooth' })
        document.querySelector<HTMLElement>('.app-drawer-scroll')?.scrollTo({ top: 0 })
      } else {
        target.scrollIntoView({
          behavior: reducedMotion() ? 'instant' : 'smooth',
          block: 'center', inline: 'nearest',
        })
      }
      updatePosition()
      observer = new ResizeObserver(updatePosition)
      observer.observe(target)
      if (panel.current) observer.observe(panel.current)
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      window.visualViewport?.addEventListener('resize', updatePosition)
      window.visualViewport?.addEventListener('scroll', updatePosition)
      timeouts.push(window.setTimeout(updatePosition, 120))
      timeouts.push(window.setTimeout(updatePosition, 360))
      timeouts.push(window.setTimeout(updatePosition, 650))
    }
    setPlacement(null)
    locate()
    return () => {
      cancelled = true
      timeouts.forEach(window.clearTimeout)
      observer?.disconnect()
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      window.visualViewport?.removeEventListener('resize', updatePosition)
      window.visualViewport?.removeEventListener('scroll', updatePosition)
    }
  }, [step?.id, menuVisible])

  useEffect(() => {
    if (!enabled) return
    panel.current?.focus({ preventScroll: true })
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
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [enabled, stepIndex, onSkip])

  if (!step) return null
  const activeIndex = stepIndex ?? 0
  const last = activeIndex === steps.length - 1

  return (
    <div className="intro-tour-layer" role="dialog" aria-modal="true" aria-label={de ? 'Einführung in das Dosier-Tool' : 'Dosing tool introduction'}>
      {highlight
        ? <div className="intro-tour-highlight" style={highlight} aria-hidden="true" />
        : <div className="intro-tour-dim" aria-hidden="true" />}
      <div
        ref={panel}
        className="intro-tour-panel"
        data-positioned={placement ? 'true' : 'false'}
        data-side={placement?.side ?? 'below'}
        style={placement ? { top: placement.top, left: placement.left, width: placement.width } : undefined}
        tabIndex={-1}
        aria-live="polite"
      >
        <div className="intro-tour-topline">
          <span className="intro-tour-eyebrow"><Sparkles size={14} aria-hidden="true" />{de ? 'Entdecke das Tool' : 'Discover the tool'}</span>
          <button type="button" className="intro-tour-close" onClick={onSkip} aria-label={de ? 'Einführung beenden' : 'End introduction'}>
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="intro-tour-progress" aria-label={(de ? 'Schritt ' : 'Step ') + (activeIndex + 1) + ' / ' + steps.length}>
          {steps.map((item, index) => (
            <span key={item.id} className={index <= activeIndex ? 'is-active' : ''} aria-hidden="true">
              <i />
            </span>
          ))}
        </div>
        <div key={step.id} className="intro-tour-content">
          <span className="intro-tour-step-label">{de ? 'SCHRITT' : 'STEP'} {activeIndex + 1} / {steps.length}</span>
          <h2>{step.title[language]}</h2>
          <p>{step.text[language]}</p>
        </div>
        <div className="intro-tour-actions">
          <button type="button" className="intro-tour-skip" onClick={onSkip}>
            {de ? 'Überspringen' : 'Skip'}
          </button>
          <div>
            {activeIndex > 0 ? (
              <button type="button" className="intro-tour-back" onClick={onBack}>
                <ArrowLeft size={16} aria-hidden="true" />{de ? 'Zurück' : 'Back'}
              </button>
            ) : null}
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
