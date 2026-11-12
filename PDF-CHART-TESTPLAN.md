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
