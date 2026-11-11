# HDT Dosier-Tool – Android-App als Hauptprodukt

## Strategie (November 2026)

**Die Android-App ist das künftige Hauptprodukt.** Die Website https://dosing.netlify.app/ bleibt vorerst unverändert und eigenständig. Neue App-Funktionen werden für die Android-Version entwickelt und getestet; sie müssen nicht automatisch auf der Website erscheinen.

- **GitHub:** Quellcode, gemeinsame Entwicklung, Tests, Erzeugung der signierten Release-Datei.
- **Google Play:** Offizielle Auslieferung der Android-App an Nutzer einschließlich regulärer App-Updates.
- **Netlify-Webseite:** Eigenständige, vorerst unveränderte Webversion. Kein automatisches Live-Nachladen ihres Codes in der Android-App.
- **Updateprinzip:** Änderungen am GitHub-Code aktualisieren nicht sofort die installierten Apps. Eine neue Version wird erst nach Test und Freigabe als signiertes AAB in der Play Console veröffentlicht. Google Play übernimmt die Verteilung (gegebenenfalls automatische Updates gemäß Einstellungen der Nutzer).
- **Später optional:** In-App-Update-Hinweise über die offizielle Google Play Core API. Keine eigene GitHub-APK-Updatefunktion und kein automatisches Web-Bundle-OTA.
- **iOS:** Nicht geplant.

## Rechte und Kennzeichen

- **Rechteinhaber der eigenen Android-App:** Timo Burian. An eigenständig entwickeltem App-Code und eigenen Projektdateien gelten, soweit Rechte Dritter nicht entgegenstehen, **alle Rechte vorbehalten**. Siehe [LICENSE](LICENSE).
- **HDT-Logo und HDT-Markenkennzeichen:** Eigentum der **HDT Hochdruck-Dosier-Technik GmbH (HDT GmbH)**. Timo Burian hat die Nutzung nach eigener Angabe genehmigt bekommen. Diese Verwendung begründet keine Übertragung der Logo- oder Markenrechte. Diese Zuordnung steht auch im **Über-Dialog** der App.
- **Bibliotheken und Assets Dritter:** Rechte verbleiben bei den jeweiligen Inhabern; eigene Lizenzen und Hinweise beachten, siehe [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
- **Vor der Store-Freigabe:** Zustimmung zur Nutzung von HDT-Name/Logo nach Möglichkeit schriftlich dokumentieren, falls Google Play einen Berechtigungsnachweis verlangt. App-Name und Paket-ID `de.hdt.dosiertool` verbindlich festlegen.
- **Programmrechte bei Tätigkeit für HDT:** Falls die App in Wahrnehmung arbeitsvertraglicher Aufgaben oder nach Arbeitgeberanweisungen entstanden ist, ist die Zuordnung der vermögensrechtlichen Rechte gesondert zu klären (§ 69b UrhG). Die Erlaubnis zur Nutzung von Logo/Name regelt nicht automatisch die Nutzungsrechte am Quellcode. Eine eindeutige schriftliche Vereinbarung zur eigenständigen Veröffentlichung kann sinnvoll sein.
- **Bestehende Website unverändert lassen:** Alle bisherigen Änderungen befinden sich im separaten Branch `main`. Kein Merge nach `main` ohne gesonderte Entscheidung.
- Bei der aktuellen React-/Capacitor-Struktur ist später eine bewusste Aufteilung von Web- und App-Quellcode sinnvoll. Das darf aber weder die vorhandene Website noch den PDF-Versand verändern.

## Android – dauerhafte Signierung vorbereiten

**Wichtig:** Der Uploadschlüssel wird ausschließlich auf einem eigenen, sicheren PC erstellt, **nie** hier in den Chat kopiert und **niemals** ins Repository eingecheckt. Für Google Play einen Google-verwalteten App-Signaturschlüssel und den lokalen Uploadschlüssel verwenden.

Java/JDK `keytool` muss verfügbar sein. Beispiel in Terminal/PowerShell (Passwörter interaktiv eingeben):

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore hdt-upload-key.p12 -alias timo-burian-upload -keyalg RSA -keysize 3072 -validity 10000 -dname "CN=Timo Burian, O=Timo Burian, C=DE"
```

Anschließend den privaten Schlüssel sorgfältig **außerhalb GitHub** sichern. Passwort und Schlüssel getrennt und sicher verwahren. Die hier genannte Zertifikatskennung ist keine behördliche Identitätsbestätigung.

Repository → **Settings → Secrets and variables → Actions** → vier **Repository secrets** hinzufügen:

| Secret | Inhalt |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Base64-codierter Inhalt der binären `hdt-upload-key.p12` |
| `ANDROID_KEYSTORE_PASSWORD` | Beim Generieren eingegebenes Keystore-Passwort |
| `ANDROID_KEY_ALIAS` | `timo-burian-upload` |
| `ANDROID_KEY_PASSWORD` | Passwort des privaten Schlüssels (bei PKCS12 in der Regel gleich dem Keystore-Passwort) |

Base64 auf Windows PowerShell erzeugen, lokal in die Zwischenablage kopieren:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path '.\hdt-upload-key.p12'))) | Set-Clipboard
```

Auf Linux:

```bash
base64 -w0 hdt-upload-key.p12
```

**Den Base64-Wert wie einen privaten Schlüssel behandeln – nicht im Chat, in Issues oder Commits teilen.**

Nach Einrichtung der Secrets unter **Actions → HDT Dosier-Tool Android → Run workflow** den Branch `main` auswählen und manuell starten. GitHub Actions erzeugt dann:

- `HDT-Dosier-Tool-Signed-Release-AAB`: signierte `.aab` für die Play Console.
- `HDT-Dosier-Tool-Signed-Release-APK`: signierte `.apk` für Testinstallationen außerhalb Google Play.
- Zusätzlich eine normale Debug-APK zum Testen.

Solange die vier Secrets fehlen, erstellt der Workflow **nur die Debug-APK**. Der signierte Release-Build wurde noch nicht auf einem Endgerät verifiziert. Ein Web-Bundle-OTA-Updater wird in dieser Android-Strategie nicht verwendet.

`mobile-release.json` definiert `androidVersionCode` und `androidVersionName`; bei jedem neuen Store-Release **versionCode erhöhen**. Vor einer Play-Store-Einreichung das `targetSdkVersion` auf aktuelle Google-Play-Anforderungen prüfen; seit 31. August 2026 gilt für neue Smartphone-Apps Android 16 / API 36 oder höher.

**Achtung beim Wechsel von Debug auf Release:** Android akzeptiert kein direktes Update mit einem anderen Signaturschlüssel. Vor dem Deinstallieren der jetzigen Debug-App individuelle Materialien und Berichte sichern. Spätere Updates der signierten Release-App bleiben bei konsistenter Signierung erhalten. Updates aus Google Play und extern installierte APKs können unter Umständen unterschiedliche App-Signaturschlüssel haben – dieses Migrationskonzept vor Publikation festlegen.


## Release-Ablauf (Google Play)

1. Neue Funktionen ausschließlich in der Android-App entwickeln und offline testen.
2. Versionscode in `mobile-release.json` erhöhen (bei jedem Release), Versionsnamen sinnvoll fortführen.
3. Über GitHub Actions **manuell** ein signiertes Android App Bundle (`.aab`) erstellen; so entstehen nicht bei jeder Codeänderung neue gespeicherte Build-Artefakte.
4. In der Play Console zuerst als internen oder geschlossenen Test veröffentlichen, Funktionen einschließlich PDF/Share testen.
5. Nach Freigabe über Google Play verteilen. Store-Nutzer mit aktivierten automatischen App-Updates erhalten veröffentlichte neue Versionen normalerweise automatisch.
6. Falls wir später einen Update-Hinweis direkt in der App einbauen, verwendet er ausschließlich die Google Play In-App Updates API; kein Herunterladen und Installieren privater APKs über GitHub.

**Wichtig:** Google Play App Signing verwaltet den Signaturschlüssel für Store-Nutzer; unser Upload-Key signiert das hochgeladene AAB. Die jetzige Debug-APK verwendet einen anderen Signaturschlüssel und kann nicht einfach als Release überschrieben werden: vor einer Neuinstallation individuelle Materialien und Berichte sichern. Auch ein manuell installiertes Release-APK ist nicht automatisch mit der Store-Signatur kompatibel.

## Store-Freigabe – noch offen

- Signierschlüssel lokal erstellen und als GitHub Actions Secrets hinterlegen; keine Schlüssel/Passwörter im Chat oder Repository teilen
- Nutzungserlaubnis für HDT-Logo/-Name für etwaige Play-Store-Rückfragen schriftlich dokumentieren; gewünschte Entwickleridentität und endgültige Paket-ID prüfen
- Datenschutzerklärung, Datenverarbeitungsangaben, Store-Grafiken/Beschreibung vorbereiten
- Release-Build, Offline-Betrieb, Datenpersistenz und PDF-Teilen auf echten Android-Geräten testen
- Aktuelle Google-Play-Richtlinien (inklusive Target API) prüfen
