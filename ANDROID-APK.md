# HDT Dosier-Tool – Android APK (v3.3.1)

Die native Android-App benutzt Capacitor 8 und den unveränderten React-/Vite-Kern (Berechnungen, Mittelwert, Diagramm, Materialien). Die App enthält ihre Web-Dateien lokal und bleibt offline nutzbar.

## Testversion herunterladen

- In GitHub → **Actions → HDT Dosier-Tool Android** den erfolgreichen Build öffnen.
- Unter **Artifacts** `HDT-Dosier-Tool-Android-Debug-APK` herunterladen, ZIP entpacken, APK installieren.
- Der Workflow im eigenständigen Android-Repository wird ausschließlich manuell über **Actions → Run workflow** gestartet.
- Test-Artefakte laufen nach **2 Tagen** ab, um GitHub Actions Speicher zu sparen.

## Android Release & Google Play

Siehe **[MOBILE-RELEASE.md](./MOBILE-RELEASE.md)**. Sobald die vier Signierschlüssel-Secrets im Repository hinterlegt sind, erzeugt derselbe Workflow zusätzlich:

- eine dauerhaft mit dem **Upload-Schlüssel** signierte Release-APK
- ein signiertes App Bundle (`.aab`) für Google Play

Die Keystore-Datei, Passwörter und Store-Zertifikate werden **niemals** ins GitHub-Repository eingecheckt. App-Inhaber/Copyright: **Timo Burian**.

## Stand der Update-Mechanik

Die Webversion unter https://dosing.netlify.app/ bleibt vorerst unverändert. Die installierte Android-App **lädt keine Website-Updates oder GitHub-Dateien automatisch nach**. Wir entwickeln neue Android-Versionen im GitHub-Projekt, testen sie und veröffentlichen anschließend ein signiertes Android App Bundle über **Google Play**. Erst dort freigegebene Updates werden an Nutzer verteilt (je nach Einstellungen automatisch). Damit bleiben Offline-Betrieb und Messreihen stabil. Kein eigener GitHub-APK-Updater und kein Web-Bundle-OTA geplant.

## Bekannte Eigenschaften

- PDF-Bericht: natives Speichern/Teilen statt Browser-Blob-Download
- Textbericht: natives Teilen-Menü
- PWA-Service-Worker im Android-Container deaktiviert
- Lokale Benutzermaterialien in der bisherigen Website werden nicht automatisch in die APK übertragen
- Debug- und Release-Signaturen sind nicht austauschbar; vor einem Debug-zu-Release-Wechsel Daten sichern
