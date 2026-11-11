# HDT Dosier-Tool – Android

**Eigenständige Android-App** · Rechteinhaber der eigenen App-Bestandteile: **Timo Burian** · **Alle Rechte vorbehalten**

Dieses Repository enthält die Android-Version des HDT Dosier-Tools. Die App basiert auf React, TypeScript, Vite und Capacitor. PDF-Berichte können über das native Android-Teilen-Menü direkt per E-Mail verschickt werden.

- **App:** Android (Capacitor 8), offline nutzbar
- **Version:** 3.3.1 (Entwicklungsstand)
- **Updateweg:** Google Play (nach Einrichtung des Entwicklerkontos und signiertem Release)
- **Build:** GitHub Actions, manuell; Test-APK und nach Hinterlegen der Signing-Secrets signiertes AAB
- **Inhaber:** Timo Burian

Die bestehende Webversion unter https://dosing.netlify.app/ wird **separat** im bisherigen Repository `DtyPnt71/dosing` betrieben und durch dieses Repository nicht verändert.

Siehe [ANDROID-APK.md](ANDROID-APK.md) für die Testversion und [MOBILE-RELEASE.md](MOBILE-RELEASE.md) für Signierung, Google Play und Veröffentlichungen.

## Urheberrecht, Markenrechte und Lizenz

- **Eigener App-Code, selbst entwickelte Funktionen, eigene UI und eigene Projektdateien:** Copyright © 2026 **Timo Burian**. Alle Rechte vorbehalten, soweit keine Rechte Dritter bestehen. Das Projekt wird **proprietär** entwickelt.
- **HDT-Logo und HDT-Markenkennzeichen:** Eigentum der **HDT Hochdruck-Dosier-Technik GmbH (HDT GmbH)**. Nutzung durch Timo Burian mit Genehmigung der HDT GmbH; keine Lizenz für die Wiederverwendung durch Dritte.
- **Eingesetzte Bibliotheken/Frameworks:** Bleiben Eigentum ihrer jeweiligen Rechteinhaber und unterliegen den jeweiligen Drittanbieter-Lizenzen. Es wird kein Eigentum daran beansprucht.
- **Google Play:** Die endgültige Paket-ID `de.hdt.dosing` und die erforderlichen Store-Unterlagen vor Veröffentlichung prüfen.

Siehe [LICENSE](LICENSE) für den proprietären Rechtevorbehalt und [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) für Drittanbieterhinweise. Das Repository ist derzeit privat. Vor einer möglichen Veröffentlichung auf GitHub sind die vollständige Offenlegung des Quellcodes, frühere Git-Versionen, interne Projektdaten und proprietäre Firmenkennzeichen bewusst zu prüfen.

## Datenschutz & Werbe-ID

- **Keine Werbung und keine Werbe-ID:** Der eigene Anwendungscode und die bisherige APK verwenden kein Advertising-ID-SDK.
- **Privacy-Hardening für Android:** Der Android-Build entfernt die Berechtigungen `AD_ID` und `INTERNET`, deaktiviert Cloud-/Gerätetransfer-Backups und prüft das zusammengeführte Manifest in CI. Der neue Build und PDF-/Mail-Teilen müssen anschließend auf Android getestet werden.
- **Datenschutzerklärung (Entwurf):** [`public/datenschutz.html`](public/datenschutz.html) – in der Android-App lokal über **Datenschutz** erreichbar; Kontakt- und Hostingangaben vor Veröffentlichung noch ergänzen.
- **Play-Console-Datensicherheit:** [PLAY-DATA-SAFETY.md](PLAY-DATA-SAFETY.md). Die finale Erklärung wird auf den tatsächlich geprüften Release-Build abgestimmt.
- **Öffentliche Datenschutz-URL:** Vorgesehen ist [GitHub Pages dieses Repositories](https://dtypnt71.github.io/dosing-android/) mit der Datei `docs/index.html`. Die Seite ist erst verfügbar, wenn GitHub Pages aktiviert und eine passende Repository-Sichtbarkeit vorhanden ist. Bei einem öffentlichen Repository ist auch der gesamte Quellcode sichtbar; eine private Quelle mit öffentlicher Pages-Seite setzt einen geeigneten GitHub-Plan voraus.

## Google Play und Exportkontrolle

Die **US-Exportbestimmungen (EAR), Verschlüsselungsregeln, Sanktionsvorgaben und ggf. EU-/BAFA-Pflichten** werden vor der Veröffentlichung überprüft. Der technische Erstbefund und die **noch offenen** rechtlichen Prüfpunkte sind in [EXPORT-COMPLIANCE.md](EXPORT-COMPLIANCE.md) dokumentiert.

**Kein signiertes Release-AAB ohne ausdrückliche, eigenverantwortliche Bestätigung der abgeschlossenen Exportkontrollprüfung.** Der GitHub-Actions-Workflow enthält dafür eine separate manuelle Freigabeoption. Die Erklärung in der Google Play Console bleibt zusätzlich erforderlich, wenn Google sie abfragt.

**Aktueller Fortschritt:** Die tatsächliche Debug-APK wurde am 11.11.2026 auf Android-Manifest, Berechtigungen, native Bibliotheken und Paketfunktionen untersucht. Siehe [Binärprüfbericht](AUDITS/2026-11-11-android-binary.md) und die [Play-Store-Startklar-Checkliste](PLAY-STORE-CHECKLIST.md). Die abschließende Rechtsklassifizierung und signierte Release-Prüfung stehen noch aus.
