import { useId, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentType } from 'react'
import {
  BookOpen, Calculator, ChevronRight, CircleHelp, FileDown, Info, Languages,
  Menu, Plus, RefreshCw, Settings2, ShieldCheck, X,
} from 'lucide-react'
import { Button } from './ui/button'
import type { Language } from '../lib/types'

type MenuAction = {
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
  title: string
  description: string
  onSelect: () => void
  disabled?: boolean
  emphasized?: boolean
  trailing?: string
}

type Props = {
  language: Language
  open: boolean
  onOpenChange: (open: boolean) => void
  tourActive: boolean
  hasSamples: boolean
  onExport: () => void
  onAddMaterial: () => void
  onManageMaterials: () => void
  onChangeLanguage: () => void
  onTutorial: () => void
  onCalculation: () => void
  onCheckUpdates: () => void
  onHelp: () => void
  onAbout: () => void
  onPrivacy: () => void
}

function Action({ action, close }: { action: MenuAction; close: () => void }) {
  const Icon = action.icon
  return (
    <button
      type="button"
      className={'app-drawer-action' + (action.emphasized ? ' app-drawer-featured' : '')}
      disabled={action.disabled}
      onClick={() => { close(); action.onSelect() }}
    >
      <span className="app-drawer-icon" aria-hidden="true"><Icon size={19} /></span>
      <span className="app-drawer-action-text">
        <strong>{action.title}</strong>
        <small>{action.description}</small>
      </span>
      {action.trailing
        ? <span className="app-drawer-trailing">{action.trailing}</span>
        : <ChevronRight size={17} className="app-drawer-chevron" aria-hidden="true" />}
    </button>
  )
}

export function AppMenu({
  language, open, onOpenChange, tourActive, hasSamples,
  onExport, onAddMaterial, onManageMaterials, onChangeLanguage, onTutorial,
  onCalculation, onCheckUpdates, onHelp, onAbout, onPrivacy,
}: Props) {
  const de = language === 'de'
  const headingId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const close = () => { if (!tourActive) onOpenChange(false) }
  const group = (title: string, actions: MenuAction[]) => (
    <section className="app-drawer-group" aria-label={title}>
      <h3>{title}</h3>
      {actions.map((action) => <Action key={action.title} action={action} close={close} />)}
    </section>
  )

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!tourActive) onOpenChange(next) }} modal={!tourActive}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="secondary" size="icon" aria-label={de ? 'Menü öffnen' : 'Open menu'} aria-expanded={open}>
          <Menu className="size-5" />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="app-drawer-overlay" />
        <DialogPrimitive.Content
          ref={contentRef}
          className="app-drawer"
          aria-labelledby={headingId}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            if (!tourActive) contentRef.current?.focus({ preventScroll: true })
          }}
          onCloseAutoFocus={(event) => { if (tourActive) event.preventDefault() }}
          onEscapeKeyDown={(event) => { if (tourActive) event.preventDefault() }}
          onPointerDownOutside={(event) => { if (tourActive) event.preventDefault() }}
          tabIndex={-1}
        >
          <div className="app-drawer-header" data-tour="menu">
            <div className="app-drawer-heading">
              <DialogPrimitive.Title id={headingId}>{de ? 'Menü' : 'Menu'}</DialogPrimitive.Title>
              <DialogPrimitive.Description>
                {de ? 'Einstellungen & Funktionen' : 'Settings & features'}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <button type="button" className="app-drawer-close" aria-label={de ? 'Menü schließen' : 'Close menu'} disabled={tourActive}>
                <X size={21} aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div className="app-drawer-scroll">
            {group(de ? 'Materialien' : 'Materials', [
              { icon: Plus, title: de ? 'Material hinzufügen' : 'Add material', description: de ? 'Eigenen Materialtyp anlegen' : 'Create a custom material', onSelect: onAddMaterial },
              { icon: Settings2, title: de ? 'Materialien verwalten' : 'Manage materials', description: de ? 'Eigene Materialien bearbeiten' : 'Edit custom materials', onSelect: onManageMaterials },
            ])}
            {group('App', [
              { icon: Languages, title: de ? 'Sprache ändern' : 'Change language', description: de ? 'Deutsch / Englisch' : 'English / German', trailing: language.toUpperCase(), onSelect: onChangeLanguage },
              { icon: BookOpen, title: de ? 'Tutorial starten' : 'Start tutorial', description: de ? 'Geführte Einführung' : 'Guided introduction', emphasized: true, onSelect: onTutorial },
            ])}
            {group(de ? 'Funktionen' : 'Functions', [
              { icon: FileDown, title: de ? 'PDF-Bericht' : 'PDF report', description: de ? 'Messreihe dokumentieren' : 'Document your measurements', disabled: !hasSamples, onSelect: onExport },
              { icon: Calculator, title: de ? 'Berechnung & Gewicht' : 'Calculation & weight', description: de ? 'Berechnungsgrundlage' : 'Calculation details', onSelect: onCalculation },
              { icon: RefreshCw, title: de ? 'Nach Updates suchen' : 'Check for updates', description: de ? 'Versionsstand überprüfen' : 'Check app version', onSelect: onCheckUpdates },
            ])}
            {group(de ? 'Informationen' : 'Information', [
              { icon: CircleHelp, title: de ? 'Hilfe' : 'Help', description: de ? 'Bedienung und Hinweise' : 'Instructions and tips', onSelect: onHelp },
              { icon: Info, title: de ? 'Über dieses Tool' : 'About this tool', description: de ? 'Version & rechtliche Angaben' : 'Version & legal details', onSelect: onAbout },
              { icon: ShieldCheck, title: de ? 'Datenschutzerklärung' : 'Privacy policy', description: de ? 'Datenschutzinformationen' : 'Data privacy information', onSelect: onPrivacy },
            ])}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
