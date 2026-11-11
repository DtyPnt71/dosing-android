# Google Play – Startklar-Checkliste (Stand: 11.11.2026)

**Projekt:** HDT Dosier-Tool · Paketkennung `de.hdt.dosiertool` · Copyright an eigenem Programmcode: Timo Burian.  
**Wichtig:** Das HDT-Logo und die HDT-Markenkennzeichen gehören der HDT GmbH; Nutzung mit Genehmigung.  
**Status:** Vorbereitungsphase. **Noch kein exportrechtlich freigegebenes und signiertes Release-AAB.**

## 1. Technische Mindestanforderungen

- [x] Unabhängiges Android-Repository vorhanden, von der Netlify-Website getrennt.
- [x] Debug-APK erfolgreich gebaut (Android GitHub Actions #42816984400).
- [x] In der tatsächlichen Debug-APK wurde `targetSdkVersion=36` bestätigt, passend zur Google-Play-Ziel-API-Anforderung ab 31.08.2026.
- [x] Dateifreigabe/PDF-Versand funktionierte im zuvor getesteten Android-Build; **nach Veröffentlichung erneut auf Play-Store-Testgerät testen**.
- [ ] Signiertes Release-AAB aus dem endgültigen Android-Quellstand erstellen und untersuchen (keine Debug-/Test-Konfigurationen).
- [ ] Installieren/Starten, PDF-Teilen, Offline-Nutzung und dauerhafte Speicherung auf echtem Android-Gerät testen.
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
- [ ] Privat auf **eigenem Rechner** einen langfristig gesicherten PKCS#12-Uploadschlüssel mit Java `keytool` erzeugen.
- [ ] Private Keystore-Datei und Passwörter **nicht** im Chat, in GitHub-Commits oder Issues teilen.
- [ ] Schlüsseldatei außerhalb des Repositories mehrfach sicher sichern, Passwörter separat verwahren.
- [ ] In `dosing-android → Settings → Secrets and variables → Actions` die vier benötigten Secrets hinterlegen: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
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

## 5. Store-Listing und Datenschutz

- [x] Offline lesbarer, trackersfreier **Entwurf** der App-Datenschutzerklärung unter `public/datenschutz.html` und Zugriff über App-Menü/Footer eingebaut.
- [x] Neue APK #42970018468 ohne `INTERNET`-/`AD_ID`-Berechtigung und mit deaktiviertem Android-Backup erfolgreich gebaut und im CI geprüft.
- [ ] **Echtes Android-Gerät testen:** App-Start, lokales Versions-Asset, PDF-Erstellung und Teilen per E-Mail ohne Internetberechtigung.
- [ ] Datenschutzkontakt-E-Mail, ladungsfähige Anschrift und korrekte Verantwortlichkeit (Timo Burian oder ggf. HDT GmbH) ergänzen.
- [ ] Öffentliche Datenschutzerklärung als HTML unter weltweit zugänglicher HTTPS-URL ohne Login hosten; Hostingprotokolle und Speicherfristen korrekt beschreiben.
- [ ] `mobile-release.json` – `privacyPolicyUrl` auf tatsächlich erreichbare Adresse und `privacyPolicyStatus` erst nach Prüfung auf `approved` setzen; CI blockiert signierte Release-Builds bis dahin.
- [ ] Datenschutzerklärung mit öffentlich erreichbarer URL in Play Console hinterlegen.
- [ ] Datenverarbeitung/Play-Console-Datensicherheit, lokale Speicherung, Android-App-Backup und freiwilliger PDF-/Mail-Versand korrekt erklären.
- [ ] Zielgruppe, App-Zugriff, Werbung, Altersfreigabe, Datenkategorien, Länder und Inhaltsangaben wahrheitsgemäß festlegen.
- [ ] Hochauflösendes App-Icon, Featuregrafik, Screenshots und deutsche Storebeschreibung vorbereiten.
- [ ] Falls persönliches Entwicklerkonto **nach dem 13.11.2023** eingerichtet: nach aktueller Google-Regel mindestens **12 Tester**, die **14 Tage durchgehend** am geschlossenen Test teilnehmen, bevor Produktionszugang beantragt werden kann. Interner Test ist bereits früher möglich.
- [ ] Vor echter Publikation neueste Play-Richtlinien und Konto-/App-spezifische Hinweise der Play Console prüfen.

Quelle: [Google Play – Testanforderungen](https://support.google.com/googleplay/android-developer/answer/14151465?hl=de).

## Nächste Entscheidung

**Vertriebsländer:** noch nicht bestätigt. Bis zur Prüfung **keine weltweite Produktion**. Ein kleiner interner Testkreis mit vertrauenswürdigen Personen in Deutschland ist ein praktikabler erster Vorschlag. Die US-Exportprüfung kann aufgrund der US-Server von Google trotzdem relevant sein.

**Freigabe:** Aktuell **NEIN** – wegen noch offener Export-Einstufung, signierter Release-AAB-Prüfung und Store-Erklärungen.
