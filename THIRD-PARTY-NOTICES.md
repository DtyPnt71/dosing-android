# Hinweise zu Softwarebestandteilen Dritter

**HDT Dosier-Tool Android – Copyright © 2026 Timo Burian**
**HDT-Logo und HDT-Kennzeichen: Eigentum der HDT Hochdruck-Dosier-Technik GmbH (HDT GmbH). Nutzung nach Genehmigung.**

Dieses Projekt enthält oder verwendet Komponenten, deren Urheberrechte und
Lizenzbedingungen bei ihren jeweiligen Rechteinhabern verbleiben. Die
proprietäre Lizenz in [LICENSE](LICENSE) beansprucht daran **kein** Eigentum.

## Verwendete Bibliotheken (Auswahl)

| Bestandteil | Hauptzweck | Lizenz / Hinweis |
| --- | --- | --- |
| React / React DOM | Benutzeroberfläche | MIT |
| Capacitor (Core, Android, Filesystem, Share) | Android-Laufzeit und native Funktionen | Projekt-/Paketlizenzen beachten |
| Radix UI | UI-Komponenten | MIT |
| lucide-react | Symbole | ISC |
| class-variance-authority | Styling-Unterstützung | Apache-2.0 |
| clsx / tailwind-merge | Styling-Unterstützung | MIT |
| html2pdf.js (eingebettete Datei `public/html2pdf.bundle.js`) | PDF-Ausgabe | MIT, mit mitgelieferten Bibliotheks- und Lizenzhinweisen |
| Lightning CSS und weitere Build-Abhängigkeiten | Erstellung des Programms | Eigene Lizenzen, u. a. MPL-2.0 |

Diese Übersicht ist **nicht vollständig**. Weitere direkte/transitive
Abhängigkeiten und ihre jeweils gültigen Versionen finden sich in
`package.json`, `package-lock.json` und den Android/Gradle-Abhängigkeiten.

Bei jeder Store-Veröffentlichung müssen die tatsächlich mit der App
ausgelieferten Bestandteile, Copyright-Hinweise und Lizenztexte
versionsbezogen geprüft und erforderliche Hinweise beigelegt werden.
Einträge in der Lockdatei können auch reine Entwicklungswerkzeuge
betreffen, die nicht Bestandteil der veröffentlichten APK/AAB sind.

## Schutz des HDT-Logos

Das HDT-Logo (einschließlich `public/logo.png` und gegebenenfalls
abgeleiteter Icons/Grafiken) ist **kein frei lizenziertes Open-Source-Asset**.
Die Rechte daran liegen bei der HDT GmbH. Dritte erhalten keine
Wiederverwendungserlaubnis durch dieses Repository.

## Abgrenzung

**Eigene Programmbestandteile:** Alle Rechte vorbehalten – Timo Burian.

**HDT-Logo und HDT-Markenkennzeichen:** Rechte der HDT GmbH, mit Erlaubnis
verwendet.

**Drittanbieter-Code/-Assets:** Rechte der jeweils angegebenen Rechteinhaber;
deren Lizenzen gelten weiter.
