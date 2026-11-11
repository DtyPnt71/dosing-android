#!/usr/bin/env python3
"""CI check that the built Android manifest matches the privacy declarations."""
from __future__ import annotations

import sys
from pathlib import Path
import xml.etree.ElementTree as ET

ANDROID_NS = "http://schemas.android.com/apk/res/android"
a = lambda k: f"{{{ANDROID_NS}}}{k}"
forbidden = {
    "com.google.android.gms.permission.AD_ID",
    "android.permission.INTERNET",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.CAMERA",
    "android.permission.RECORD_AUDIO",
    "android.permission.READ_CONTACTS",
    "android.permission.READ_PHONE_STATE",
}

variant = sys.argv[1] if len(sys.argv) > 1 else "debug"
candidates = list(Path("android/app/build/intermediates").glob(
    f"merged_manifests/{variant}/**/AndroidManifest.xml"
))
if not candidates:
    candidates = list(Path("android/app/build/intermediates").glob(
        f"packaged_manifests/{variant}/**/AndroidManifest.xml"
    ))
if not candidates:
    raise SystemExit(f"No merged Android manifest for {variant} found – cannot certify privacy.")

for path in candidates:
    root = ET.parse(path).getroot()
    perms = {
        n.get(a("name"))
        for n in root
        if n.tag.startswith("uses-permission")
    }
    violated = perms & forbidden
    if violated:
        raise SystemExit(f"Forbidden Android permissions in {path}: {sorted(violated)}")
    app = root.find("application")
    if app is None:
        raise SystemExit("Missing application element")
    if app.get(a("allowBackup")) != "false":
        raise SystemExit(f"Backup not explicitly disabled in {path}")
    if app.get(a("dataExtractionRules")) is None:
        raise SystemExit(f"Android 12+ data extraction exclusions absent in {path}")
    if app.get(a("fullBackupContent")) is None:
        raise SystemExit(f"Legacy full backup exclusions absent in {path}")
    print(f"PASS {variant}: no AD_ID, INTERNET, broad storage, camera, microphone, location or contacts; backup disabled.")
    print(f"Verified: {path}")

print("Reminder: Permission audit does not prove all SDK data practices; device/runtime audit remains required.")
