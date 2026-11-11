# Datenschutzerklärung direkt über dieses GitHub-Repository bereitstellen

**Vorbereitet:** 11.11.2026 · Android-Paket-ID `de.hdt.dosing`

Die Datenschutzseite benötigt **kein zweites Repository**. Eine identische, auf GitHub Pages abgestimmte Version liegt hier:

- `public/datenschutz.html` – lokale, offline lesbare Fassung in der Android-App
- `docs/index.html` – GitHub-Pages-Fassung für den Play-Store-Link

Der GitHub-Actions-Build prüft mit `scripts/verify_policy_sync.py`, dass beide Dateien identisch sind, die neue Paket-ID enthalten und die Kontaktangaben stimmen.

## Geplante URL (noch nicht als online bestätigt)

```text
https://dtypnt71.github.io/dosing-android/
```

Eine Repository-Dateiseite wie `github.com/DtyPnt71/dosing-android/blob/main/public/datenschutz.html` ist **nicht** die geeignete Play-Store-Datenschutz-URL. Google Play verlangt eine direkt im Browser angezeigte, öffentliche HTTPS-Webseite ohne Login, Geosperre oder herunterladbares PDF.

## Sichtbarkeit: bitte vor dem Umstellen prüfen

**`dosing-android` ist inzwischen öffentlich einsehbar und proprietär lizenziert.** Die Lizenz „Alle Rechte vorbehalten“ verhindert technisch **nicht**, dass andere die Dateien lesen oder kopieren, sobald das Repository öffentlich ist.

Bei einer Umstellung auf **öffentlich** wird nicht nur die Datenschutzseite sichtbar, sondern auch:

- der gesamte React-/Capacitor-Quellcode, einschließlich Berechnungslogik,
- die vorhandenen Materialien, Namen, PDF-Vorlagen und ggf. im Code hinterlegte Zugangscodes,
- die bisherigen Git-Commits und ihre enthaltenen Dateien,
- verwendete HDT-Firmenlogos und andere Assets, unabhängig von deren Lizenz.

Die Berechtigung zur Verwendung des HDT-Logos **durch den App-Entwickler** erteilt Dritten keine Lizenz. Deshalb vor einem öffentlichen Repo die Publizierbarkeit der Projektdateien und der Git-Historie genau prüfen.

Nach aktueller GitHub-Dokumentation:
- **GitHub Free:** Pages für dieses Repo erfordert `public` und macht damit auch den kompletten Quellcode öffentlich.
- **GitHub Pro/Team:** Pages kann aus privaten Repositories betrieben werden, während die Webseite öffentlich zugänglich ist. Prüfe das konkret verfügbare Pages-Angebot in deinem GitHub-Konto.

Ein separat gehostetes Datenschutzdokument oder die Freigabe **nur** der HTML-Datei über einen Deploy-Prozess kann die App-Quellen privat halten. Ein zweites Repository ist dafür nicht zwingend nötig, wäre aber eine besonders einfache Alternative.

## GitHub Pages auf diesem Repository aktivieren

Nur nach bewusster Entscheidung zur passenden Repository-Sichtbarkeit:

1. Repository `DtyPnt71/dosing-android` aufrufen.
2. **Settings → Pages** öffnen.
3. **Build and deployment → Source: Deploy from a branch** wählen.
4. **Branch: main**, Ordner **/docs** auswählen und **Save** klicken.
5. Die oben angegebene GitHub-Pages-Adresse in einem privaten Browserfenster ohne GitHub-Anmeldung öffnen.
6. Kontrollieren, dass die Seite auf Deutsch als normale Webseite erscheint, die Adresse und E-Mail korrekt sind und sie auch außerhalb Deutschlands ohne Login erreichbar ist.
7. Datenschutzerklärung juristisch auf Verantwortlichkeit, Hosted-Logs, E-Mail-Verarbeitung, Rechtsgrundlagen und den finalen Play-Store-AAB abgleichen.
8. **Erst danach** `mobile-release.json` von `privacyPolicyStatus: "draft"` auf `"approved"` umstellen. Der signierte Release-Build bleibt bis dahin ausdrücklich gesperrt.

Die URL `privacyPolicyUrl` ist in `mobile-release.json` bereits als **geplant** hinterlegt, nicht als geprüft/öffentlich.

### Wenn die Datenschutzseite über GitHub Pages erreichbar ist

In **Google Play Console → App-Inhalte / Datenschutzrichtlinie** den Link
`https://dtypnt71.github.io/dosing-android/` eintragen, falls sie unter genau dieser URL öffentlich und ohne Login erreichbar ist.

Vor dem ersten Play-Store-Upload bestätigen, dass die Paketkennung in der Konsole und in der APK exakt `de.hdt.dosing` lautet. Das zuvor verwendete `de.hdt.dosiertool` bezeichnet für Android eine **andere App**.

Amtliche Quellen:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://support.google.com/googleplay/android-developer/answer/9859455
- https://developer.android.com/build/configure-app-module
