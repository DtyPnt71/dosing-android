#!/usr/bin/env python3
"""Verify that Android and GitHub Pages publish the same privacy declaration.

This is a local consistency check, not proof of a working public URL or
a completed legal/privacy compliance review.
"""
import json
from pathlib import Path

app = Path("public/datenschutz.html").read_bytes()
site = Path("docs/index.html").read_bytes()
if app != site:
    raise SystemExit("Privacy policy mismatch: public/datenschutz.html and docs/index.html must be identical.")

release = json.loads(Path("mobile-release.json").read_text(encoding="utf-8"))
app_id = release["appId"]
if app_id != "de.hdt.dosing":
    raise SystemExit(f"Unexpected mobile-release appId: {app_id}")

config = Path("capacitor.config.ts").read_text(encoding="utf-8")
if f"appId: '{app_id}'" not in config:
    raise SystemExit("Capacitor appId and mobile-release.json are inconsistent.")

text = app.decode("utf-8")
required = [
    "Datenschutzerklärung",
    "Paketkennung: de.hdt.dosing",
    "Timo Burian",
    "Müllerstraße 7",
    "46242 Bottrop",
    "timo.burian@h-d-tec.de",
    "GitHub Pages",
]
missing = [s for s in required if s not in text]
if missing:
    raise SystemExit(f"Privacy statement missing: {missing}")

for obsolete in ["de.hdt.dosiertool", "[Ladungsfähige", "[Datenschutz-", "[Hostinganbieter", "ENTWURF"]:
    if obsolete in text:
        raise SystemExit(f"Privacy statement still contains obsolete placeholder: {obsolete}")

print("OK: Android package ID is de.hdt.dosing")
print("OK: GitHub Pages privacy HTML and offline app HTML are identical")
print("OK: privacy policy contains Timo Burian's supplied address and contact email")
print("Note: This check does not publish the website or establish its legal completeness.")
