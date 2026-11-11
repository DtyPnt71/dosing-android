import type { ComponentType } from 'react'
import {
  BookOpen, Calculator, ChevronRight, CircleHelp, FileDown, Info, Languages,
  Menu, Plus, RefreshCw, Settings2, ShieldCheck,
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu'
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

function Action({ action }: { action: MenuAction }) {
  const Icon = action.icon
  return (
    <DropdownMenuItem
      disabled={action.disabled}
      className={`app-menu-action${action.emphasized ? ' app-menu-action-featured' : ''}`}
      onSelect={action.onSelect}
    >
      <span className="app-menu-icon" aria-hidden="true"><Icon size={19} /></span>
      <span className="app-menu-action-text">
        <strong>{action.title}</strong>
        <small>{action.description}</small>
      </span>
      {action.trailing
        ? <span className="app-menu-trailing">{action.trailing}</span>
        : <ChevronRight size={17} className="app-menu-chevron" aria-hidden="true" />}
    </DropdownMenuItem>
  )
}

export function AppMenu({
  language, open, onOpenChange, tourActive, hasSamples,
  onExport, onAddMaterial, onManageMaterials, onChangeLanguage, onTutorial,
  onCalculation, onCheckUpdates, onHelp, onAbout, onPrivacy,
}: Props) {
  const de = language === 'de'
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" aria-label={de ? 'Menü öffnen' : 'Open menu'} aria-expanded={open}>
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`app-action-menu${tourActive ? ' app-action-menu-tour' : ''}`}
        data-tour="menu"
        onCloseAutoFocus={tourActive ? (event) => event.preventDefault() : undefined}
        onInteractOutside={tourActive ? (event) => event.preventDefault() : undefined}
        onEscapeKeyDown={tourActive ? (event) => event.preventDefault() : undefined}
      >
        <div className="app-menu-heading">
          <span className="app-menu-brand">HDT <span>Dosier-Tool</span></span>
          <p>{de ? 'Menü & Einstellungen' : 'Menu & settings'}</p>
        </div>
        <div className="app-menu-group">
          <DropdownMenuLabel>{de ? 'Materialien' : 'Materials'}</DropdownMenuLabel>
          <Action action={{ icon: Plus, title: de ? 'Material hinzufügen' : 'Add material', description: de ? 'Eigenen Materialtyp anlegen' : 'Create a custom material', onSelect: onAddMaterial }} />
          <Action action={{ icon: Settings2, title: de ? 'Materialien verwalten' : 'Manage materials', description: de ? 'Eigene Materialien bearbeiten' : 'Edit your custom materials', onSelect: onManageMaterials }} />
        </div>
        <DropdownMenuSeparator />
        <div className="app-menu-group">
          <DropdownMenuLabel>{de ? 'App' : 'App'}</DropdownMenuLabel>
          <Action action={{ icon: Languages, title: de ? 'Sprache ändern' : 'Change language', description: de ? 'Zwischen Deutsch und Englisch wechseln' : 'Switch between English and German', trailing: language.toUpperCase(), onSelect: onChangeLanguage }} />
          <Action action={{ icon: BookOpen, title: de ? 'Tutorial starten' : 'Start tutorial', description: de ? 'Einführung Schritt für Schritt' : 'Step-by-step introduction', emphasized: true, onSelect: onTutorial }} />
        </div>
        <DropdownMenuSeparator />
        <div className="app-menu-group">
          <DropdownMenuLabel>{de ? 'Weitere Funktionen' : 'More features'}</DropdownMenuLabel>
          <Action action={{ icon: FileDown, title: de ? 'PDF-Bericht' : 'PDF report', description: de ? 'Messreihe dokumentieren' : 'Document your measurements', disabled: !hasSamples, onSelect: onExport }} />
          <Action action={{ icon: Calculator, title: de ? 'Berechnung & Gewicht' : 'Calculation & weight', description: de ? 'Berechnungsgrundlage ansehen' : 'How the calculation works', onSelect: onCalculation }} />
          <Action action={{ icon: RefreshCw, title: de ? 'Nach Updates suchen' : 'Check for updates', description: de ? 'Versionsstand überprüfen' : 'Check version status', onSelect: onCheckUpdates }} />
        </div>
        <DropdownMenuSeparator />
        <div className="app-menu-group">
          <DropdownMenuLabel>{de ? 'Informationen' : 'Information'}</DropdownMenuLabel>
          <Action action={{ icon: CircleHelp, title: de ? 'Hilfe' : 'Help', description: de ? 'Bedienung und Hinweise' : 'Instructions and tips', onSelect: onHelp }} />
          <Action action={{ icon: Info, title: de ? 'Über dieses Tool' : 'About this tool', description: de ? 'Version und rechtliche Angaben' : 'Version and legal details', onSelect: onAbout }} />
          <Action action={{ icon: ShieldCheck, title: de ? 'Datenschutzerklärung' : 'Privacy policy', description: de ? 'Datenschutzinformationen' : 'Privacy information', onSelect: onPrivacy }} />
        </div>
        <div className="app-menu-bottom">HDT Dosier-Tool</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
