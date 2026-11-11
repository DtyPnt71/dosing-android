# Google Play – Werbe-ID, Datenschutz und Berechtigungen

**Stand:** 11.11.2026 | **App:** HDT Dosier-Tool Android | **Verantwortlicher (geplant):** Timo Burian

> Technischer Arbeitsstand, **keine endgültige Play-Console-Einreichung**.
> Die Aussagen sind auf den nach Datenschutz-Härtung erzeugten Android-Release
> und einen zusätzlichen Geräte-/SDK-Test abzustimmen.

## 1. Werbe-ID (Advertising ID)

**Vorgesehene Play-Console-Antwort: NEIN.**

- Im bisher gebauten Debug-APK vom 10.11.2026 fehlt die Berechtigung
  `com.google.android.gms.permission.AD_ID`.
- In `package.json` / `package-lock.json` sind keine AdMob-/Google-Mobile-Ads-,
  Firebase-Analytics-, Werbe- oder Tracking-SDKs ersichtlich.
- Der eigene App-Code ruft keine Advertising-ID-API auf.
- Für künftige Builds wird die Berechtigung ausdrücklich aus dem
  **zusammengeführten AndroidManifest** entfernt und der CI-Build prüft dies.

## 2. Android-Berechtigungen und Nutzeraktionen

| Zweck | App-Berechtigung für geplanten Release | Tatsächliche Funktion |
| --- | --- | --- |
| Werbe-ID | **Keine** | Keine Werbung / Personalisierung |
| Internet | **Keine** nach Privacy-Hardening | Lokale, paketierte WebView-Dateien; kein Analytics-/Backend-Dienst |
| Kamera, Standort, Mikrofon, Kontakte | **Keine** | Werden nicht verwendet |
| Speicher: Dateien allgemein | **Keine** | PDF wird im privaten App-Cache erstellt |
| PDF teilen | **Keine** allgemeine Berechtigung | Android `FileProvider` / `Share` gibt gezielt nur die ausgewählte Datei temporär an Ziel-App frei |
| E-Mail versenden | **Keine** Konto- oder E-Mail-Berechtigung | Benutzer wählt in Androids Teilen-Menü eine E-Mail-App; diese versendet selbst |
| Android-Backup | **Deaktiviert**, ergänzt durch Cloud-/Gerätetransfer-Ausschlussregeln | Benutzerdaten sollen nicht automatisch über Android-Backup übertragen werden |

Die alte Debug-APK (10.11.2026) verlangte `android.permission.INTERNET`
und hatte `android:allowBackup=true`. Der neue Datenschutz-Testbuild
[GitHub Actions #42970018468](https://github.com/DtyPnt71/dosing-android/actions/runs/42970018468)
wurde am 11.11.2026 **erfolgreich gebaut**. Der CI-Prüfschritt
`scripts/verify_android_privacy.py` bestätigte, dass das zusammengeführte
Manifest **keine** `INTERNET`-, `AD_ID`-, allgemeine Speicher-,
Standort-, Kamera- oder Mikrofonberechtigungen enthält, Android-Backup
explizit deaktiviert und Backup-Ausschlussregeln gesetzt sind.

Das APK-Archiv wurde zusätzlich unabhängig auf Berechtigungsstrings und
die mitgelieferte Datenschutzseite geprüft; SHA-256:
`a57713e1d35084244d43d7fe8dc052b0cacf88f54a3b1c95f0125e4d2d189d8a`.

**Auf realen Geräten muss noch bestätigt werden, dass App-Start, PDF
und E-Mail-Teilen ohne INTERNET-Berechtigung funktionieren.** Das
erfolgreiche CI-Build ist kein Laufzeittest.

## 3. Datensicherheit – geplante Angaben (vorläufig)

Für den streng offline betriebenen App-Build, sofern der finale Gerätetest
und ein SDK-/Netzwerk-Review die Prüfung bestätigen:

- **Erhebt deine App Nutzerdaten?** **Nein**. Keine App-eigene Übermittlung von
  Messwerten, Namen, Standorten, Kennungen, Nutzungsdaten oder Diagnosedaten
  an einen Server des Entwicklers oder Analytics-SDKs.
- **Gibt deine App Nutzerdaten weiter?** **Nein**, sofern es ausschließlich
  um die ausdrücklich durch den Benutzer gewählte Dateiübergabe per
  Android-Teilen geht. Google stellt für solche konkreten
  nutzerinitiierten Übertragungen eine Ausnahme von der Deklaration als
  Datenweitergabe bereit; das Verhalten wird in der Datenschutzerklärung
  dennoch transparent erläutert.
- **Konten:** keine Anmeldung, keine Registrierung und keine Nutzerprofile.
- **Lokale Daten:** Material-Voreinstellungen, Gewichtswerte, Messungen
  und selbst eingegebene Berichtsdetails werden nur lokal verarbeitet.
- **Löschung:** Nutzer können lokale App-Daten in den Android-Einstellungen
  entfernen bzw. die App deinstallieren. Freiwillig außerhalb der App
  gespeicherte/versandte PDFs werden dadurch nicht gelöscht.
- **Einbindung von Google Play:** Datenerhebungen durch Google Play bei
  Download, Installation und Store-Updates sind **nicht** Teil eines
  eigenen Datenerhebungsdienstes der App, aber in der Datenschutzerklärung
  separat angesprochen.

Achtung: Berechtigungsfreiheit alleine beweist nicht, dass nicht über
andere Android-/SDK-APIs Nutzerdaten erhoben werden. Vor Einreichung den
finalen AAB auf Bibliotheken, Netzwerkanfragen und App-Backups prüfen.

## 4. Datenschutzerklärung – online und in der App

- Lokaler, offline lesbarer HTML-Entwurf:
  [`public/datenschutz.html`](public/datenschutz.html).
- App-Menü und Footer können den lokal eingebetteten HTML-Text öffnen,
  **ohne Internetverbindung**.
- Die aktuelle Datei enthält **Entwurfsmarkierung und Platzhalter** für:
  verantwortliche ladungsfähige Anschrift, Datenschutz-E-Mail und
  technischen Betreiber der später öffentlich aufrufbaren Seite.
- **Vor Google Play:** Platzhalter ersetzen, Verantwortlichkeit klären,
  externe SDK-/Netzwerkprüfung abschließen, öffentliche HTTPS-Seite
  aufrufen/testen und Link in Play Console hinterlegen.

**Empfohlenes Hosting:** Separates öffentliches GitHub-Pages-Repository nur
für die fertige statische HTML-Datenschutzerklärung. Das Android-Repository
selbst bleibt privat. Keine Third-Party-Analytik, Fonts, externen Skripte
oder Cookies einsetzen. GitHub Pages protokolliert gemäß eigenem Hinweis
beim Seitenaufruf die IP-Adresse für Sicherheitszwecke: diesen
Hosting-Sachverhalt im öffentlichen Datenschutztext korrekt benennen.
GitHub Pages verlangt eine weltweit erreichbare HTTPS-Webseite, keine
Markdown-Datei hinter einem privaten Login.

Alternativ: eigene, separat gehostete Netlify-Seite; auch deren Hosting-
Zugriffsprotokolle müssten entsprechend offengelegt werden.

## 5. Quellen

- Google – [Werbe-ID](https://support.google.com/googleplay/android-developer/answer/6048248?hl=de)
- Google – [Nutzerdatenrichtlinie](https://support.google.com/googleplay/android-developer/answer/10144311?hl=de)
- Google – [Datensicherheitsangaben und Ausnahme für nutzerinitiierte Weitergaben](https://support.google.com/googleplay/android-developer/answer/10787469?hl=de)
- Google – [Datenschutzerklärung für App-Review](https://support.google.com/googleplay/android-developer/answer/9859455?hl=de)
- Android – [Dateien sicher über FileProvider teilen](https://developer.android.com/training/secure-file-sharing/share-file)
- Android – [Android-Backup abschalten und Extraktionsregeln](https://developer.android.com/identity/data/autobackup)
- GitHub – [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

**Noch offen:** endgültige Datenschutzerklärung/Verantwortlichenangaben,
öffentliche URL, Geräte-Test, finaler Release-AAB/Datensicherheitsaudit.
