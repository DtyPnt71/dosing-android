# US-/EU-Exportkontrolle – HDT Dosier-Tool Android

**Prüfstand:** 11. November 2026  
**App:** HDT Dosier-Tool Android · App-ID `de.hdt.dosiertool` · Ausgangsversion 3.3.1  
**Verantwortlicher Entwickler:** Timo Burian  
**Status:** Technische Erstprüfung dokumentiert. **Rechtliche Einstufung, Länderprüfung und abschließende Freigabe stehen noch aus.**  
**WICHTIG:** Dieses Dokument ist eine Prüfliste, **keine behördliche Exportgenehmigung, ECCN-Klassifizierung oder rechtsverbindliche Konformitätserklärung.**

## Hintergrund

Google Play erklärt, dass das Bereitstellen einer App auf Google-Servern und das Herunterladen im Ausland die US-Exportvorschriften berühren können – selbst bei nichtamerikanischen Entwicklern. Das gilt auch, wenn Verschlüsselungsfunktionen nur durch Betriebssystem oder Drittbibliotheken genutzt werden. Eine Bestätigung gegenüber Google Play darf deshalb **erst nach einer nachvollziehbaren Prüfung** abgegeben werden.

Amtliche Quellen:

- Google Play, *Export compliance*: https://support.google.com/googleplay/android-developer/answer/113770
- US Bureau of Industry and Security (BIS), *Encryption controls*: https://www.bis.gov/learn-support/encryption-controls
- BIS, *Mass market / § 740.17*: https://www.bis.gov/learn-support/encryption-controls/mass-market
- BIS, *EAR § 740.17*: https://www.bis.gov/regulations/ear/740
- BIS, *EAR § 742.15 und Supplement No. 8*: https://www.bis.gov/regulations/ear/742
- US Office of Foreign Assets Control (OFAC): https://ofac.treasury.gov/sanctions-programs-and-country-information
- Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA): https://www.bafa.de/DE/Aussenwirtschaft/Ausfuhrkontrolle/ausfuhrkontrolle_node.html

## 1. Technische Ersterfassung am App-Code

| Bestandteil | Feststellung | Bewertung |
| --- | --- | --- |
| Berechnungen für Dosier-/Mischungsverhältnis | Reine lokale Berechnung | Keine eigens implementierte Verschlüsselung gefunden |
| Messreihen und eigene Materialien | React-State und lokaler WebView-Speicher | Keine Dateiverschlüsselung durch eigenen App-Code gefunden |
| `crypto.randomUUID()` in `src/App.tsx` | Erzeugt eine ID für eine Messreihe | Kryptografische Zufallsquelle, **keine Datenverschlüsselung** |
| PDF-Berichte über `html2pdf.js` | Lokale PDF-Erstellung | Kein Passwort-/PDF-Verschlüsselungsmodus in dem aufrufenden App-Code |
| `@capacitor/filesystem` | PDF im App-Cache zwischenspeichern | Keine vom eigenen App-Code aktivierte Verschlüsselung |
| `@capacitor/share` | Übergabe an Android-Systemdialog/E-Mail-App | Die Android-App betreibt keinen eigenen Mailserver/Verschlüsselungsdienst |
| `fetch('./version.json')` | Abruf der gebündelten Versionsdatei im App-WebView | Keine eigene verschlüsselte Verbindung zu einem App-Backend |
| `capacitor.config.ts` / `androidScheme: 'https'` | WebView-Schema-Konfiguration | Nicht gleichbedeutend mit einer eigenen HTTPS-Server-Verbindung |
| Android WebView, Android-Systemdienste und Drittbibliotheken | Plattform kann Kryptografie, TLS, Signaturen oder gesicherte Speicherung bereitstellen | **Vor finaler Einstufung mit endgültiger APK/AAB prüfen** |
| App-Signierung für Google Play | Upload-/App-Signatur im Veröffentlichungsprozess | Nicht mit eigener Inhalts-/Dateiverschlüsselung verwechseln |

**Vorläufiger technischer Befund:** Die Anwendung ist in ihrer eigenen Funktion ein lokales Mess-/Dokumentationstool, kein Sicherheits-, Verschlüsselungs- oder Kryptografie-SDK. Es wurde im geprüften Anwendungscode kein selbst implementierter Verschlüsselungsalgorithmus gefunden. Diese Quellcodeprüfung beweist **nicht**, dass alle mit dem Android-Bundle ausgelieferten Abhängigkeiten keine Kryptografie enthalten.

## 2. US-Exportkontroll-Einstufung – vor Veröffentlichung offen

- [x] App-Verwendungszweck und kryptografische Aufrufe im eigenen Code vorläufig geprüft
- [ ] Endgültiges, **signiertes** AAB/APK und enthaltene Android-/Java-/WebView-Abhängigkeiten erfassen
- [ ] Klären, ob das Produkt überhaupt den US EAR unterliegt, und rechtliche Güterklassifizierung dokumentieren (z. B. EAR99, 5D992.c oder 5D002 – **keine Einstufung vorgegeben**)
- [ ] Etwaige Ausnahmen für allgemein verfügbare/„mass market“-Software gemäß BIS und **aktueller** EAR prüfen
- [ ] Falls `5D992.c` / `5D002` relevant: konkreten Pfad nach § 740.17 und ggf. CCATS, ENC, Melde-/Selbstklassifizierungspflichten prüfen; Ausnahmen nach Regeländerungen beachten
- [ ] Aktuelle US-Sanktionsregeln, Endnutzer, Endverwendung und Google-Play-Vertriebsländer kontrollieren; Google-Sperren ersetzen keine eigene Prüfung
- [ ] Ergebnis, Fundstellen, Prüfer, Datum, genehmigten Vertriebskreis und etwaige Nachweise für die Release-Version dokumentieren
- [ ] Bei offenen Fragen qualifizierte Exportkontrollberatung bzw. BIS/BAFA einholen

**Wichtig:** Die BIS-Regeln enthalten Ausnahmen von jährlichen Selbstklassifizierungsberichten für *bestimmte* gewöhnliche Mass-Market-Artikel. Andererseits können je nach Güterklasse/Produktfunktion durchaus Melde- oder Genehmigungspflichten gelten. Weder eine pauschale Meldepflicht noch pauschale Meldefreiheit darf ohne Einstufung behauptet werden.

## 3. Deutschland / EU

- [ ] Prüfen, ob die konkrete App, enthaltene Kryptografie oder ihre Bereitstellung nach Verordnung (EU) 2021/821 / nationalen Vorschriften relevant sind
- [ ] Ggf. Güterlisten-/Dual-Use-Klassifizierung, allgemeine Genehmigungen, Embargos, Zielländer und Endverwendungen prüfen
- [ ] Etwaige BAFA-Auskünfte, Lizenzfreigaben oder begründete Negativprüfungen dokumentieren

Die US-Ausfuhrfreigabe ersetzt keine etwaig einschlägigen EU-/deutschen Ausfuhrkontrollpflichten.

## 4. Ablauf pro Play-Store-Release

1. Quellcode und Drittbibliotheken gegen die technische Liste oben abgleichen; alle neu eingeführten Authentifizierungs-, Verschlüsselungs-, Cloud- oder Netzwerkfunktionen gesondert bewerten.
2. Das **fertige Release-AAB** mit aktualisierten Abhängigkeiten/Konfigurationen prüfen.
3. Rechtliche Einstufung und ggf. notwendige Meldungen/Genehmigungen vor Vertrieb bestätigen.
4. Zielländer und Sanktionsvorgaben vor Play-Console-Freigabe prüfen; bei Unklarheit begrenzen, nicht automatisch weltweit veröffentlichen.
5. Vermerke für den Release aufbewahren (Versionscode, Datum, prüfende Person, Ergebnis, Nachweise).
6. Erst dann in der **Google Play Console** die eigenverantwortliche Exportkontroll-Erklärung akzeptieren.
7. Für nachfolgende Releases Bewertung aktualisieren.

**Manueller Schutz im GitHub-Build:** Der signierte Release-Build erfordert künftig zusätzlich die Bestätigung „Exportkontrollprüfung für diesen Release abgeschlossen“ im Startdialog von GitHub Actions. Sie ist eine *eigenverantwortliche Freigabe* und ersetzt weder die juristische Prüfung noch die separate Erklärung in der Play Console. Debug-APKs können ohne diese Freigabe erstellt werden.

## 5. Release-Freigabevermerk (noch NICHT ausgefüllt)

- Release-Version / Build-Hash: **offen**
- Tatsächliche ECCN / rechtliche Begründung: **offen**
- EAR-Anwendbarkeit / Meldepflicht / evtl. Genehmigung: **offen**
- EU-/BAFA-Prüfung: **offen**
- Zielländer-/Sanktionsprüfung: **offen**
- Prüfung und Genehmigung durch Timo Burian / ggf. Fachberatung: **offen**
- Datum und Dokumente: **offen**

**Status: nicht als exportrechtlich freigegeben zertifiziert. Keine Play-Console-Bestätigung vor Abschluss der offenen Punkte.**
