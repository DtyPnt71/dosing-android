# PDF-Diagramm – Qualitätstest

## Umsetzung

- Der **Dosierbericht** zeigt nach dem **Mittelwert** automatisch den Probenverlauf mit bis zu fünf Messpunkten.
- Gleiche Skalenberechnung wie im optionalen Diagramm auf der Startseite: Messwerte, Sollwert, untere und obere Toleranzgrenzen.
- Außerhalb der hinterlegten Toleranz liegende Werte erscheinen als orangefarbene Rauten.
- Keine Abhängigkeit vom aufgeklappten Zustand des Diagramms auf der Startseite.
- PDF-Diagramm wird lokal hochauflösend über ein Canvas erzeugt, ohne Netzwerk oder zusätzliche Android-Berechtigungen.
- Die bestehende Berichtsstruktur, Material-/Maschinendaten, PDF-Export und der Android-Teilen-Dialog bleiben erhalten.
- Diagrammbereich ist bewusst kompakt, sodass ein normaler fünfprobeniger Bericht ohne Zusatzfelder auf **eine A4-Seite** passt.
- Bei sehr langen Kommentaren kann der PDF-Bericht weiterhin mehrere Seiten beanspruchen.

## Verifiziert (12.11.2026)

- [x] Vite/TypeScript-Build erfolgreich – GitHub Actions Build [#43174061124](https://github.com/DtyPnt71/dosing-android/actions/runs/43174061124)
- [x] Android Debug-APK erstellt und Datenschutz-/Manifestprüfungen erfolgreich
- [x] Browserseitige PDF-Erzeugung anhand aus der APK extrahierter Web-App geprüft
- [x] Fünf Proben mit unterschiedlichen Werten und einer Überschreitung (11,40 % bei einer Vorgabe von 9,50–11,00 %)
- [x] Diagramm einschließlich Skala, Toleranzfläche, orangefarbener Raute und Legende gerendert
- [x] Mit Logo und allen fünf Proben **einseitiges A4-PDF** (PDF mit Playwright/Chromium erzeugt, anschließend gerendert und visuell geprüft)
- [x] Diagramm war auf der Startseite eingeklappt und wurde dennoch exportiert

## Noch auf echtem Android-Gerät prüfen

- [ ] Android-PDF-Vorschau und Teilen aus dem Systemdialog heraus
- [ ] E-Mail mit PDF-Anhang
- [ ] Eine einzige Probe und fünf Proben im PDF
- [ ] Eigene Materialtypen ohne Sollwert und mit festen/variablen Grenzen
- [ ] Längere Kommentare / Material-Chargen und mehrseitige Berichte
- [ ] Deutsch und Englisch

## Testdaten (keine echten Produktionswerte)

PS · Kömmerling GD116 · Vorgabe 9,50–11,00 % · Proben: 9,60 / 10,10 / 9,80 / 11,40 / 10,50 % · Mittelwert 10,28 % · Maschine HDT-TEST · Kunde Demokunde

Die demo-PDF enthält synthetische Werte und darf **nicht** als Produktionsmessprotokoll verwendet werden.

## Android-Smartphone-Layout (14.11.2026)

Beobachtung auf einem Android-37-Emulator (schmaler Bildschirm): Das Einstellungsmenü wirkte zu hoch; beim Öffnen des PDF-Berichts war nur die Kopfzeile des Dialogs sichtbar. Tablet-Darstellung war in Ordnung.

Anpassung auf dem Branch:
- Unter 640 px: Begrenzung der Menühöhe auf tatsächlich freien Platz, Scrollbarkeit und kompaktere Abstände
- PDF-Erfassungsdialog als nahezu vollhohes mobiles Sheet, festes Kopf-/Fußteil, im Inneren scrollbare Felder
- Kein automatisches Öffnen der Android-Bildschirmtastatur beim Dialogstart
- Größere Ansichten (Tablet/Desktop) nicht verändert; keine Änderung der PDF-Diagrammberechnung

### Manuell im Emulator nachprüfen
- [ ] Medium Phone API 37: Menü öffnen, bis unten zu Datenschutz/Hilfe scrollen, alle Einträge antippbar
- [ ] PDF-Bericht öffnen: PIN-Feld und Weiter-Button ohne Scroll-Trick sichtbar
- [ ] Nach PIN-Eingabe: alle Formularfelder scrollen, PDF/E-Mail-Buttons am unteren Rand sichtbar
- [ ] Eingabefeld antippen: Tastatur darf nicht die Buttons/Formularfelder dauerhaft verdecken
- [ ] Dialog schließen und erneut öffnen; keine Werte unbeabsichtigt übernommen
- [ ] Tablet: vorheriges Aussehen und PDF-Bericht weiterhin unverändert nutzbar

Hinweis: GitHub-CI validiert TypeScript, Android-APK und Berechtigungen, nicht die visuelle Wirkung auf dem Emulator. Nutzerseitiger Screenshot-Test ist noch offen.


## Side-Drawer & adaptive Einführung (14.11.2026)

- Altes Popup-Menü durch einen über die gesamte Bildschirmhöhe scrollbaren **seitlichen Drawer** ersetzt, ohne doppeltes Branding, mit dunkler und weichgezeichneter Hintergrundüberlagerung.
- Kontext-Tour mit sechs Schritten: beweglicher Spotlight-Rahmen, animierter Fortschrittsindikator, dynamisch oberhalb/unterhalb/neben dem Ziel platzierte Hinweiskarten.
- Diagrammschritt öffnet das Diagramm automatisch und scrollt erneut nach der Erweiterung; beim Menüschritt wird die Seitenleiste fest eingeblendet und der Hintergrund nach oben gescrollt.
- Kleine Displays werden zusätzlich neu positioniert, falls das Tooltip sonst sein Ziel überdecken würde. Nutzer mit reduzierten Animationen erhalten weitgehend statische Übergänge.

### Durchgeführt: automatisierter Browser-Sichttest

Die aus der **fertig gebauten Android-Debug-APK** entnommenen Web-Assets wurden lokal in Headless-Chromium mit simuliertem LocalStorage getestet. Ergebnisse:

- [x] Alle sechs Tour-Schritte bei **390 × 844** geprüft
- [x] Alle sechs Tour-Schritte bei **320 × 640** geprüft
- [x] Gemessene Überschneidungsfläche zwischen Tooltip und Spotlight: **0 px²** in sämtlichen zwölf Schritten
- [x] Diagramm im Schritt 5 automatisch aufgeklappt und mit SVG-Plot im sichtbaren Bereich
- [x] Menü in Schritt 6 trotz vorherigem Scrollen sichtbar; Hintergrund kehrt an Seitenanfang zurück
- [x] Manuelle Menüöffnung nach der Tour, Scrollbarkeit und sämtliche Optionen vorhanden
- [x] Keine Javascript-Laufzeitfehler in den geprüften Screens
- [x] TypeScript-/Vite-Build, Android-Debug-APK und Datenschutz-Manifestprüfung: [GitHub Actions #43593106276](https://github.com/DtyPnt71/dosing-android/actions/runs/43593106276)

### Noch auf dem Android-Emulator manuell kontrollieren

- [ ] Drawer öffnen/schließen per Menüschaltfläche, X, Tap außerhalb, Zurücktaste
- [ ] Drawer-Scrollen und Dialoge aus Material-/Info-Menü öffnen
- [ ] GuidedTour auf Android 37, Schwerpunkt Diagramm und Menü
- [ ] Nach Eingabe einer Messreihe PDF erzeugen, teilen/speichern
- [ ] Spracheinstellung auf Englisch und erneuter Tourstart

Der Headless-Chromium-Test ist keine vollständige native Android-WebView-/Touch-/Tastaturprüfung. Zum Veröffentlichen daher einen Android-Emulatortest durchführen.
