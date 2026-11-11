# US-/EU-Exportkontrolle – HDT Dosier-Tool Android

**Prüfstand:** 11. November 2026  
**App:** HDT Dosier-Tool Android · aktuelle App-ID `de.hdt.dosing` · Ausgangsversion 3.3.1  
**Verantwortlicher Entwickler:** Timo Burian  
**Status:** Eigener App-Code und vorhandene **Debug-APK vom 10.11.2026** technisch geprüft. **Signiertes Release-AAB, rechtliche US-/EU-Einstufung, konkrete Länderprüfung und abschließende Freigabe stehen noch aus.**  
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

## 1a. Prüfung der vorhandenen APK – tatsächlicher Binärbefund

Die **historische Debug-APK mit der alten Paketkennung `de.hdt.dosiertool`** aus [GitHub Actions #42816984400](https://github.com/DtyPnt71/dosing-android/actions/runs/42816984400) wurde am **11.11.2026** direkt untersucht:

- SHA-256: `8eecca48ea1a721570463df42c4a7700a5e73bb83dd7d81c5096cc63b954c4f7` (8 188 726 Bytes).
- Android-Zielversion: **API 36**; Android-Minimum: **API 24**.
- Berechtigungen: `android.permission.INTERNET` und eine appinterne, nicht exportierte Receiver-Berechtigung. **Keine** Standort-, Kamera-, Mikrofon- oder Kontaktdaten-Berechtigung gefunden.
- Native Plugin-Registrierung: **Filesystem** und **Share**.
- **Keine `lib/*.so`-Dateien** oder separat benannte native Kryptobibliotheken im APK-Archiv. Acht DEX-Dateien und WebView-/JavaScript-Bestandteile sind enthalten. Das schließt Android-Systemkryptografie oder Java-/JavaScript-Funktionen nicht grundsätzlich aus.
- Die aktuelle Debug-APK hat `android:debuggable=true` und `android:allowBackup=true`. Dies ist keine Release-Prüfung; Backup und Datensicherheitsangaben vor Store-Veröffentlichung kontrollieren.

Vollständiger reproduzierbarer Befund mit Hash und Grenzen der Prüfung: [AUDITS/2026-11-11-android-binary.md](AUDITS/2026-11-11-android-binary.md).

## 2. US-Exportkontroll-Einstufung – vor Veröffentlichung offen

- [x] App-Verwendungszweck und kryptografische Aufrufe im eigenen Code vorläufig geprüft
- [x] Bereits erstellte **Debug-APK** auf Manifest, eingebettete Dateien, native Plugins und erkennbare Kryptobibliotheken untersucht (Auditbericht verlinkt). Dies ist **kein** Audit des späteren Release-AAB.
- [ ] Endgültiges, **signiertes** AAB/APK und enthaltene Android-/Java-/WebView-Abhängigkeiten erfassen
- [ ] Klären, ob das Produkt überhaupt den US EAR unterliegt, und rechtliche Güterklassifizierung dokumentieren (z. B. EAR99, 5D992.c oder 5D002 – **keine Einstufung vorgegeben**)
- [ ] Etwaige Ausnahmen für allgemein verfügbare/„mass market“-Software gemäß BIS und **aktueller** EAR prüfen
- [ ] Falls `5D992.c` / `5D002` relevant: konkreten Pfad nach § 740.17 und ggf. CCATS, ENC, Melde-/Selbstklassifizierungspflichten prüfen; Ausnahmen nach Regeländerungen beachten
- [x] Zuständige amtliche US-Quellen für Sanktionsprogramme und Prüflisten identifiziert (OFAC, BIS/US CSL). Eine generische Länder-Sanktionsliste ersetzt keine Einzelfallprüfung.
- [ ] Aktuelle US-Sanktionsregeln, Endnutzer, Endverwendung und **tatsächlich gewählte** Google-Play-Vertriebsländer kontrollieren; Google-Sperren ersetzen keine eigene Prüfung. Bis jetzt ist **kein Vertriebsland vom Entwickler bestätigt**.
- [ ] Ergebnis, Fundstellen, Prüfer, Datum, genehmigten Vertriebskreis und etwaige Nachweise für die Release-Version dokumentieren
- [ ] Bei offenen Fragen qualifizierte Exportkontrollberatung bzw. BIS/BAFA einholen

**Wichtig:** Die BIS-Regeln enthalten Ausnahmen von jährlichen Selbstklassifizierungsberichten für *bestimmte* gewöhnliche Mass-Market-Artikel. Andererseits können je nach Güterklasse/Produktfunktion durchaus Melde- oder Genehmigungspflichten gelten. Weder eine pauschale Meldepflicht noch pauschale Meldefreiheit darf ohne Einstufung behauptet werden.

## 2a. Vorläufige Einordnung – ohne amtlichen ECCN-Bescheid

- **Produktzweck:** Gewerbliche Dosierberechnung, Messungsdokumentation und PDF-Teilen; keine vom eigenen Anwendungscode angebotene Datenverschlüsselungs-, Kryptanalyse-, Kryptomodul-, Sicherheits- oder VPN-Funktion.
- **Festgestellt:** `crypto.randomUUID()` dient der UUID-Erzeugung. Androids App-Signatur dient der Programmintegrität; BIS behandelt reine Authentifizierungs- und Digital-Signaturfunktionen gesondert von Kryptografie zur Datenvertraulichkeit.
- **Unklar:** Ob und wie mitgelieferte Plattform-/Drittkomponenten eine eigenschaftsrelevante Kryptografiefunktion bereitstellen und ob die fertige Software als `EAR99`, `5D992.c`, `5D002` oder anders einzuordnen ist. Eine dieser Kategorien zu **behaupten wäre derzeit unbelegt**.
- **Nächste rechtliche Entscheidung:** Prüfen, ob US-EAR-Anwendbarkeit besteht, und gegebenenfalls die Klassifizierung fundiert dokumentieren. Erst bei entsprechender Einstufung die jeweiligen Regeln zu ENC, CCATS, Klassifizierungsbericht oder Ausnahmen anwenden. Zuständige Primärquellen: [BIS: Cryptography for Data Confidentiality](https://www.bis.gov/learn-support/encryption-controls/cryptography-for-data-confidentiality), [BIS: Classify Your Item](https://www.bis.gov/licensing/classify-your-item), [BIS: § 740.17](https://www.bis.gov/regulations/ear/740).
- **Beachte:** Ein kostenloser Download oder ein proprietäres Repository begründet für sich **keine** pauschale Befreiung. Nach BIS können für massenhaft vertriebene Verschlüsselungs-Apps vor dem `publicly available`-Status Klassifizierung/Meldungen erforderlich sein.

## 2b. Aktuelle Embargos und Prüflisten – Quellennachweis

- [OFAC: Sanktionsprogramme und Länder](https://ofac.treasury.gov/sanctions-programs-and-country-information)
- [US International Trade Administration: Consolidated Screening List](https://www.trade.gov/data)
- [BIS EAR § 740.17: Beschränkte Länder-/Endnutzergruppen](https://www.bis.gov/regulations/ear/740)

**Ergebnis:** Maßgebliche Quellen ermittelt, **keine** vollständige Liste der möglichen Store-Vertriebsländer und Endnutzer überprüft. Vorschlag: zunächst nur eng begrenzter interner Test; kein weltweiter Produktions-Release ohne gesonderte Zielmarktprüfung.

## 3. Deutschland / EU

- [x] Offizielle EU-/deutsche Rechtsquellen für die Erstprüfung und die 2025 aktualisierte Güterliste ermittelt ([EU 2021/821](https://eur-lex.europa.eu/eli/reg/2021/821), [EU 2025/2003](https://eur-lex.europa.eu/eli/reg_del/2025/2003/oj), [BAFA](https://www.bafa.de/DE/Aussenwirtschaft/Ausfuhrkontrolle/ausfuhrkontrolle_node.html)).
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

**Status am 11.11.2026: Technischer Debug-Binärbefund und amtliche Quellen dokumentiert; US-/EU-Rechtsklassifizierung, Sanktions-/Länderprüfung und signierter Release-Build noch nicht abgeschlossen. Keine Play-Console-Bestätigung vor Abschluss der offenen Punkte.**
