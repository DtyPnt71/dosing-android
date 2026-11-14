# Google Play – Startklar-Checkliste (aktualisiert am 14.11.2026)

**Projekt:** HDT Dosier-Tool · Paketkennung `de.hdt.dosing` · Copyright an eigenem Programmcode: Timo Burian.  
**Wichtig:** Das HDT-Logo und die HDT-Markenkennzeichen gehören der HDT GmbH; Nutzung mit Genehmigung.  
**Status:** Finaler App-Code vom Entwickler für die Veröffentlichung bestätigt und PR #2 in `main` zusammengeführt; Schlüssel-/Secret-Funktion mit GitHub Actions erfolgreich geprüft. Finales **unsigniertes** AAB aus dem Stand nach dem Merge gebaut und technisch validiert (GitHub Actions #43602923423). **Noch kein exportrechtlich freigegebenes und signiertes Release-AAB.**

## 1. Technische Mindestanforderungen

- [x] Unabhängiges Android-Repository vorhanden, von der Netlify-Website getrennt.
- [x] Debug-APK erfolgreich gebaut (Android GitHub Actions #42816984400).
- [x] In der tatsächlichen Debug-APK wurde `targetSdkVersion=36` bestätigt, passend zur Google-Play-Ziel-API-Anforderung ab 31.08.2026.
- [x] Dateifreigabe/PDF-Versand funktionierte im zuvor getesteten Android-Build; **nach Veröffentlichung erneut auf Play-Store-Testgerät testen**.
- [ ] Signiertes Release-AAB aus dem endgültigen Android-Quellstand erstellen und untersuchen (keine Debug-/Test-Konfigurationen).
- [ ] Installieren/Starten, PDF-Teilen, Offline-Nutzung und dauerhafte Speicherung auf echtem Android-Gerät bzw. über einen ausreichend realistischen Testablauf kontrollieren. Neue UI und PDF-Diagramm wurden im Android-Emulator vom Entwickler visuell freigegeben.
- [ ] Vor Store-Veröffentlichung `android:allowBackup=true` bewerten; wenn erforderlich Cloud-Backups ausschließen oder Daten-Backup-/Privacy-Policy entsprechend ausgestalten.

## 2. Exportkontrolle (muss vor Freigabe geprüft werden)

- [x] Technische erste kryptografische Funktionen des App-Codes und das vorhandene Debug-APK dokumentiert.
- [x] Maßgebliche Google-/BIS-/EU-/BAFA-/OFAC-Quellen ermittelt.
- [ ] EAR-Anwendbarkeit und US-Klassifizierung mit begründeter Entscheidung dokumentieren; `EAR99`, `5D992.c` oder `5D002` **nicht ohne Nachweis voraussetzen**.
- [ ] Eventuelle BIS-Melde-, Klassifizierungs- oder Genehmigungspflichten klären.
- [ ] EU-Dual-Use-/BAFA-/AWV-Einstufung dokumentieren.
- [ ] Tatsächliche Vertriebsländer sowie einschlägige Sanktionen, Endnutzer und Endverwendungen prüfen.
- [ ] Rechts-/Exportkontrollprüfung mit Datum/Verantwortlichem abschließen und in [EXPORT-COMPLIANCE.md](EXPORT-COMPLIANCE.md) vermerken.
- [ ] **Erst danach** die Google-Play-Exportkontrollerklärung akzeptieren und eine signierte Version freigeben.

Dokumentation: [AUDITS/2026-11-11-android-binary.md](AUDITS/2026-11-11-android-binary.md) und [EXPORT-COMPLIANCE.md](EXPORT-COMPLIANCE.md).

## 3. Eigentum, Rechte und Drittbibliotheken

- [x] Proprietärer Rechtevorbehalt für eigenen App-Code unter `LICENSE`.
- [x] HDT-Logo/-Markenkennzeichen ausdrücklich der HDT GmbH zugeschrieben.
- [x] HDT-Nutzung mit Genehmigung im About-Dialog dokumentiert.
- [ ] Vor Store-Einreichung die Logo-/Namensgenehmigung nach Möglichkeit schriftlich sichern.
- [ ] Tatsächlich im fertigen AAB enthaltene Drittanbieter-Bibliotheken und Lizenzhinweise vollständig prüfen; `THIRD-PARTY-NOTICES.md` ist derzeit eine **vorläufige** Übersicht.
- [ ] Falls die App innerhalb eines Arbeitsverhältnisses entstanden ist: Nutzungsrechte am Anwendungscode unabhängig von den Markennutzungsrechten klären (u. a. § 69b UrhG).

## 4. Google Play – Schlüsselschutz und Veröffentlichung

- [ ] Neues Google-Play-App-Projekt anlegen, Anzeigenamen und endgültige Paketkennung festlegen.
- [x] Auf privatem CachyOS-Linux-Rechner einen langfristigen PKCS12-Uploadschlüssel mit `keytool` erzeugt.
- [ ] Private Keystore-Datei und Passwörter **nicht** im Chat, in GitHub-Commits oder Issues teilen.
- [ ] Schlüsseldatei außerhalb des Repositories mehrfach sicher sichern, Passwörter separat verwahren.
- [x] Vier benötigte Secrets in GitHub Actions eingerichtet und durch einen erfolgreichen [geschützten Prüfbuild #43586709753](https://github.com/DtyPnt71/dosing-android/actions/runs/43586709753) validiert (keine geheimen Werte ausgegeben).
- [ ] Nach Abschluss der Exportkontrollprüfung bei **Actions → HDT Dosier-Tool Android → Run workflow** die Freigabe `export_compliance_confirmed` bewusst bestätigen und signiertes AAB erstellen.
- [ ] In Google Play **Play App Signing** nutzen (Google schützt den App-Signaturschlüssel; du schützt deinen separaten Uploadschlüssel).
- [ ] In der Play Console den internen Testrelease mit AAB starten, nach Fertigstellung als Installationsquelle auf echtem Gerät testen.
- [ ] Vor jedem weiteren Release `androidVersionCode` in `mobile-release.json` erhöhen.

**Wichtig:** Die bisher verteilte Debug-APK kann nicht mit einem anderen Signierschlüssel überinstalliert werden. Lokal gespeicherte eigene Materialien/Protokolle vor Umstieg sichern. Die Google-Play-Version kann wiederum ein anderes App-Signaturzertifikat als die außerhalb des Stores signierte APK haben.

### Schlüssel sicher auf Windows erstellen

**Voraussetzung:** `keytool` aus einem installierten Java Development Kit (JDK), auf dem eigenen Windows-Rechner. In PowerShell in einen sicheren Ordner **außerhalb** des GitHub-Repositories wechseln und eingeben:

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore hdt-upload-key.p12 -alias timo-burian-upload -keyalg RSA -keysize 3072 -validity 10000 -dname "CN=Timo Burian, C=DE"
```

Das Kennwort wird lokal interaktiv festgelegt. Anschließend kann der Base64-Wert **nur lokal für das GitHub-Repository-Secret** in die Zwischenablage gelegt werden:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path '.\hdt-upload-key.p12'))) | Set-Clipboard
```

Den Clipboard-Inhalt nur ins Secret `ANDROID_KEYSTORE_BASE64` im **privaten** Repository einfügen, niemals hier in den Chat. `ANDROID_KEY_ALIAS` ist `timo-burian-upload`, die übrigen Secrets enthalten die lokal festgelegten Passwörter. Für PKCS12 sind Store-/Key-Passwörter gewöhnlich identisch.

Für den **öffentlichen**, nicht geheimen Fingerabdruck des Upload-Zertifikats:

```powershell
keytool -list -v -keystore .\hdt-upload-key.p12 -alias timo-burian-upload
```

Google-Anleitung: [Signieren von Apps](https://developer.android.com/studio/publish/app-signing) und [Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?hl=de).

## 4a. App-Zugang für Google-Play-Prüfer

- [ ] In Google Play Console unter **App-Zugriff** angeben, dass die PDF-Berichtsfunktion per PIN geschützt ist, und Google-Prüfern eine funktionierende Anleitung geben. Die App-Oberfläche selbst benötigt kein Konto.
- [ ] Prüfen, ob der statische PDF-PIN für eine öffentlich veröffentlichte App aus fachlicher Sicht weiterhin sinnvoll ist. Er ist **keine sichere Zugriffssperre** gegen technisch versierte Nutzer.

## 5. Store-Listing und Datenschutz

- [x] Offline lesbarer, trackersfreier **Entwurf** der App-Datenschutzerklärung unter `public/datenschutz.html` und Zugriff über App-Menü/Footer eingebaut.
- [x] Neue APK #42970018468 ohne `INTERNET`-/`AD_ID`-Berechtigung und mit deaktiviertem Android-Backup erfolgreich gebaut und im CI geprüft.
- [ ] **Echtes Android-Gerät testen:** App-Start, lokales Versions-Asset, PDF-Erstellung und Teilen per E-Mail ohne Internetberechtigung.
- [x] Datenschutzkontakt und Anschrift in der Erklärung eingetragen: **Timo Burian, c/o HDT GmbH, Müllerstraße 7, 46242 Bottrop; timo.burian@h-d-tec.de**. Die tatsächlich datenschutzrechtliche Verantwortlichkeit vor Store-Einreichung bestätigen.
- [x] HTML-Seite für GitHub Pages im selben Repository unter `docs/index.html` vorbereitet; GitHub Pages als Host in der Erklärung benannt.
- [ ] GitHub Pages unter Settings → Pages → `main`/`docs` aktivieren und öffentliche URL ohne Login weltweit testen (auf GitHub Free nur bei öffentlichem Repository, was den gesamten Quellcode offenlegt).
- [x] Geplante URL `https://dtypnt71.github.io/dosing-android/` und Paket-ID `de.hdt.dosing` in `mobile-release.json` hinterlegt.
- [ ] `privacyPolicyStatus` erst nach öffentlichem Abruf, Abgleich beider HTML-Dateien und Rechtsprüfung auf `approved` setzen; CI blockiert signierte Release-Builds bis dahin.
- [ ] Datenschutzerklärung mit öffentlich erreichbarer URL in Play Console hinterlegen.
- [ ] Datenverarbeitung/Play-Console-Datensicherheit, lokale Speicherung, Android-App-Backup und freiwilliger PDF-/Mail-Versand korrekt erklären.
- [ ] Zielgruppe, App-Zugriff, Werbung, Altersfreigabe, Datenkategorien, Länder und Inhaltsangaben wahrheitsgemäß festlegen.
- [ ] Finales App-Icon, Featuregrafik, Screenshots und deutsche Storebeschreibung auf Google-Play-Vorgaben und tatsächlichen App-Stand abgleichen.
- [ ] Falls persönliches Entwicklerkonto **nach dem 13.11.2023** eingerichtet: nach aktueller Google-Regel mindestens **12 Tester**, die **14 Tage durchgehend** am geschlossenen Test teilnehmen, bevor Produktionszugang beantragt werden kann. Interner Test ist bereits früher möglich.
- [ ] Vor echter Publikation neueste Play-Richtlinien und Konto-/App-spezifische Hinweise der Play Console prüfen.

Quelle: [Google Play – Testanforderungen](https://support.google.com/googleplay/android-developer/answer/14151465?hl=de).

## Technischer finaler AAB-Pakettest

- [x] GitHub PR #2 in `main` zusammengeführt: https://github.com/DtyPnt71/dosing-android/pull/2
- [x] Unsigned Release-AAB von `main` in gesondertem technischen Prüfbau erstellt: https://github.com/DtyPnt71/dosing-android/actions/runs/43602923423
- [x] AAB-Archiv strukturell geprüft und ausdrücklich als **unsigniert** bestätigt.
- [ ] Signiertes AAB erstellen **erst nach** dokumentierter Datenschutz- und Exportkontrollfreigabe.
- [ ] Signiertes AAB prüfen (Paketkennung, Release-Signatur, Berechtigungen, Bibliotheken) und für den internen Play-Test freigeben.

## Nächste Entscheidung

**Vertriebsländer:** noch nicht bestätigt. Bis zur Prüfung **keine weltweite Produktion**. Ein kleiner interner Testkreis mit vertrauenswürdigen Personen in Deutschland ist ein praktikabler erster Vorschlag. Die US-Exportprüfung kann aufgrund der US-Server von Google trotzdem relevant sein.

**Freigabe:** Aktuell **NEIN** – wegen noch offener Export-Einstufung, signierter Release-AAB-Prüfung und Store-Erklärungen.
