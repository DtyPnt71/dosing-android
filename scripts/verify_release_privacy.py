#!/usr/bin/env python3
"""Block signed Store builds until the privacy statement is publication-ready.

This check is intentionally mechanical and never substitutes for a legal
review, Play Console disclosures or a device/SDK network audit.
"""
import json
from pathlib import Path
from urllib.parse import urlparse

release = json.loads(Path("mobile-release.json").read_text(encoding="utf-8"))
html = Path("public/datenschutz.html").read_text(encoding="utf-8")
url = release.get("privacyPolicyUrl", "")
status = release.get("privacyPolicyStatus", "")

if status != "approved":
    raise SystemExit("Privacy policy is still a draft; public Play release signing blocked.")
host = urlparse(url)
if host.scheme != "https" or not host.netloc or "example" in host.netloc.lower():
    raise SystemExit("Privacy policy requires a real public HTTPS URL in mobile-release.json.")
if "Datenschutzerklärung" not in html or "Timo Burian" not in html:
    raise SystemExit("The app-bundled privacy page must identify the app and its controller.")
if "ENTWURF" in html or "[" in html and ("[Ladungsfähige" in html or "[Datenschutz-" in html or "[Hostinganbieter" in html or "[Datenschutzkontakt" in html):
    raise SystemExit("Privacy policy contains draft markers or incomplete contact/hosting details.")
print(f"Privacy policy gate passed for: {url}")
print("Manual checks still required: public site accessibility worldwide, SDK audit, legal accuracy and Play form.")
