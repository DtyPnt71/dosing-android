# Erststart-Einführung – Android-Testplan

## Funktion

1. Beim **ersten Start ohne gespeicherte Sprachwahl** fragt die App nach **Deutsch** oder **English**.
2. Die Entscheidung wird lokal unter `hdt-language-v3` gespeichert. Keine Konto- oder Netzwerkübertragung.
3. Danach startet die geführte Einführung mit fünf Stationen:
   1. Material auswählen
   2. Gewichte eingeben – inklusive Hinweis „nur Gewichte, keine Volumen“
   3. Aktuelle Probe
   4. Messreihe und Mittelwert
   5. Optionales Diagramm
4. Jede Station hebt den realen Bereich der Oberfläche hervor; auf kleinen Displays scrollt die App zum Ziel.
5. Zurück, Weiter, Fertig und Überspringen sind vorgesehen.
6. Beim Abschluss bzw. Überspringen wird `hdt-first-introduction-v1=done` lokal gesetzt. Die Tour erscheint beim nächsten Start nicht mehr.
7. Falls die Tour übersprungen wird, wird der bisherige einmalige Hinweis zur gewichtsbasierten Berechnung angezeigt, sofern noch nicht bestätigt.
8. Über **Menü → Hilfe → Einführung erneut starten** lässt sich die Tour jederzeit erneut abspielen.
9. Das bisherige Umschalten unter **Menü → Sprache** bleibt erhalten und speichert die neue Wahl.
10. Der **PDF-Export** und seine PIN-geschützten Felder sind ausdrücklich **nicht Teil** der Einführung. Die PDF-Funktion selbst bleibt unverändert.

## Zu prüfen auf Android

- [ ] Frische Installation: Erststart-Dialog, Deutsch, 5 Stationen, fertig.
- [ ] App beenden und neu starten: keine erneute Sprachwahl und keine automatische Tour.
- [ ] Frische Installation: Englisch, korrekte Texte und Schaltflächen.
- [ ] In Station 2 zurückgehen, später „Überspringen“, einmaligen Gewichtshinweis bestätigen.
- [ ] Menu → Hilfe → Einführung erneut starten.
- [ ] Menu → Sprache: Nach Umschalten und App-Neustart Sprache bleibt erhalten.
- [ ] Scrollposition und Spotlight auf kleinem Smartphone, großem Smartphone und Tablet.
- [ ] Materialauswahl, Live-Ergebnis, maximal 5 Proben, optionales Diagramm unverändert.
- [ ] PDF erzeugen, in Android teilen und über eine E-Mail-App versenden.
- [ ] Offline-Modus ohne Internetberechtigung.
- [ ] Im zusammengeführten Android-Manifest: **keine AD_ID-/INTERNET-/Speicherberechtigungen**; Backup weiterhin deaktiviert.

## Entwicklertest zurücksetzen (löscht lokale App-Daten!)

Um den absolut ersten Start erneut zu simulieren, die **App-Daten in Android-Einstellungen löschen**. Dadurch werden auch eigene Materialien gelöscht. Diese Option nur auf einem Testgerät beziehungsweise nach Datensicherung verwenden.

Bei einer neuen **Debug-APK** kann der bei GitHub Actions generierte Debug-Signaturschlüssel wechseln. Dann ist unter Umständen vor Installation ein Deinstallieren nötig; zuvor lokale Daten sichern.

## Technischer Stand

Der Code liegt zunächst auf `feature/first-run-onboarding`. Ein Merge in `main` erfolgt erst nach Funktionsprüfung. Website `https://dosing.netlify.app/` ist ein separates Projekt und bleibt unverändert.
