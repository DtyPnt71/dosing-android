# Android-Binärprüfung – 11.11.2026

**Projekt:** HDT Dosier-Tool Android · Copyright an eigenem Anwendungscode: Timo Burian  
**Zweck:** Nachvollziehbare technische Vorprüfung für US-/EU-Exportkontrolle und Play-Store-Bereitschaft.  
**Achtung:** Kein Rechtsgutachten, keine abschließende ECCN-/EU-Güterlisten-Klassifizierung, keine Exportgenehmigung.

## Untersuchtes Artefakt

- Repository: `DtyPnt71/dosing-android`
- Erfolgreicher GitHub-Actions-Lauf: https://github.com/DtyPnt71/dosing-android/actions/runs/42816984400
- Code-Revision des Builds: `327c4d495efacb216da3a3a1ac35f8ddd696ffba` (10.11.2026)
- GitHub-Artifact: `HDT-Dosier-Tool-Android-Debug-APK` (`app-debug.apk`)
- Dateigröße: **8 188 726 Bytes**
- SHA-256 der untersuchten APK: `8eecca48ea1a721570463df42c4a7700a5e73bb83dd7d81c5096cc63b954c4f7`
- **Nur Debug-Build**, kein endgültiges, mit Upload-Schlüssel signiertes Release-AAB. Die inzwischen geänderten rechtlichen Dokumente der App sind noch nicht in diesem Build enthalten.

## Aus dem binären AndroidManifest.xml abgelesen

| Feld | Tatsächlicher Wert |
| --- | --- |
| Paketname | `de.hdt.dosiertool` |
| `versionCode` | `1` |
| `versionName` | `3.3.1` |
| `minSdkVersion` | `24` |
| `targetSdkVersion` | `36` |
| `compileSdkVersion` | `36` |
| Android-Berechtigung | `android.permission.INTERNET` |
| Zusätzlich generierte App-Berechtigung | `de.hdt.dosiertool.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` |
| Standort/Kamera/Mikrofon/SMS/Kontakte | Keine entsprechenden Berechtigungen im Manifest |
| `android:debuggable` | `true` (**nur Debug-Build**, Release muss `false` sein) |
| `android:allowBackup` | `true` (**Datenschutz-/Backup-Einstellung vor Store-Reife prüfen**) |
| FileProvider | `androidx.core.content.FileProvider`, `exported=false` |

Die App erfüllt mit `targetSdkVersion=36` die seit 31.08.2026 geltende Ziel-API-Anforderung für neue Android-Smartphone-Apps im Google Play Store (siehe [Android Developers](https://developer.android.com/google/play/requirements/target-sdk)).

## Mit der APK gelieferte Programmbestandteile

- Java/Dalvik-Bytecode: **8 DEX-Dateien**.
- **0** APK-Einträge unter `lib/` (keine eingebetteten nativen `.so`-Bibliotheken).
- Zwei registrierte native Capacitor-Plugins: `@capacitor/filesystem` und `@capacitor/share`.
- Eigene Web-App und eingebettete `html2pdf.bundle.js`, JavaScript-Bundles, Icons und Dateien unter `assets/public/`.
- Keine als solche erkennbaren kryptografischen nativen Bibliotheksdateien im APK-Archiv.

**Grenzen der Prüfung:** Die reinen ZIP-Dateinamen, Manifest-Einträge und die statische Codeübersicht sind keine vollständige kryptografische Bytecode-Analyse. Android-Systemdienste, WebView/Java-Klassen und Fremdbibliotheken können Kryptografie anbieten. Eine Abwesenheit von `lib/*.so` beweist nicht, dass keinerlei Verschlüsselungsaufrufe möglich sind.

## Zweck und Datenwege (statische Codeprüfung)

- Dosier-/Mischungsverhältnis `B / A × 100`, Messreihen und Diagramm: Berechnungen im Geräteprozess.
- Benutzerdefinierte Materialien und Sprache: `localStorage` im WebView.
- Messungs-ID: `crypto.randomUUID()` (kryptografische Zufallsquelle, **kein Verschlüsseln von Nutzdaten**).
- PDF: `html2pdf.js` lokal im WebView, dann `Filesystem.writeFile()` in den Android-App-Cache.
- Teilen/E-Mail: `Share.share()` über den Android-Freigabedialog; der Benutzer wählt eine andere App für das Senden.
- `fetch('./version.json')`: Lesen der gebündelten Web-Asset-Version; im nativen Paket gibt es keine konfigurierte externe `server.url`.
- App-Signierung und HTTPS-Schema sind **nicht** gleichbedeutend mit der Implementierung einer allgemeinen Datenverschlüsselungsfunktion.

**Vorläufige technische Schlussfolgerung:** Anwendungsspezifischer Code ist eine Offline-Rechen- und Dokumentations-App, keine Kryptografie-Software oder Krypto-SDK. Es wurden keine eigens implementierten Algorithmen für die Datenverschlüsselung gefunden. **Dies allein begründet keine abschließende EAR-/ECCN- oder EU-Exportfreigabe.**

## Noch erforderlich vor Store-Veröffentlichung

1. **Neues Release-AAB** mit endgültigem Code und korrektem Signaturschlüssel erstellen und auf tatsächlich ausgelieferte Crypto-/Netzwerkfunktionen prüfen.
2. Rechtliche EAR-Anwendbarkeit, insbesondere mögliche Einstufung als **EAR99 vs. 5D992.c vs. 5D002**, durch geeignete fachliche Begründung klären – **keine dieser Klassen wurde hier verbindlich vergeben**.
3. EU-Dual-Use-Verordnung (EU) 2021/821 und geltenden Anhang I (u. a. Kategorie 5 Teil 2), BAFA/AWV, Sanktions-/Endverwendungsfragen für den konkreten Vertrieb prüfen.
4. Geplante Länder in Play Console ausdrücklich festlegen und dokumentieren. **Die Länder sind derzeit nicht bekannt, also nicht als geprüft markieren.** Zunächst enger interner Testkreis statt unbeabsichtigter weltweiter Freigabe empfohlen.
5. Datenschutz-/Backup-Eigenschaften (besonders `android:allowBackup=true`) und Play-Console-Datensicherheitsangaben prüfen.
6. Person, Datum, prüfbaren Beleg und Freigabeentscheidung in `EXPORT-COMPLIANCE.md` ergänzen; erst danach die Google-Play-Export-Erklärung bestätigen.

## Maßgebliche Primärquellen, geprüft am 11.11.2026

- [Google Play: Einhaltung der Exportbestimmungen](https://support.google.com/googleplay/android-developer/answer/113770?hl=de)
- [BIS: Cryptography for Data Confidentiality](https://www.bis.gov/learn-support/encryption-controls/cryptography-for-data-confidentiality)
- [BIS: ECCN-Klassifizierung](https://www.bis.gov/licensing/classify-your-item)
- [BIS: Mass Market](https://www.bis.gov/learn-support/encryption-controls/mass-market)
- [BIS: EAR § 740](https://www.bis.gov/regulations/ear/740)
- [OFAC: Aktuelle Sanktionsprogramme](https://ofac.treasury.gov/sanctions-programs-and-country-information)
- [EU-Dual-Use-Verordnung (EU) 2021/821, geltende konsolidierte Fassung](https://eur-lex.europa.eu/eli/reg/2021/821)
- [EU-Anhang-I-Update 2025/2003](https://eur-lex.europa.eu/eli/reg_del/2025/2003/oj)
- [BAFA: Genehmigungspflicht und Auskunft zur Güterliste](https://www.bafa.de/DE/Aussenwirtschaft/Ausfuhrkontrolle/ausfuhrkontrolle_node.html)
