#!/usr/bin/env python3
"""Harden generated Capacitor Android project for local-only operation.

Invoked after `npx cap add android && npx cap sync android`, before Gradle.
The generated android/ directory is not committed, so changes must be reapplied
on every build. Changes are intentionally strict; device testing is required.
"""
from __future__ import annotations

from pathlib import Path
import xml.etree.ElementTree as ET

ANDROID_NS = "http://schemas.android.com/apk/res/android"
TOOLS_NS = "http://schemas.android.com/tools"
ET.register_namespace("android", ANDROID_NS)
ET.register_namespace("tools", TOOLS_NS)

manifest_path = Path("android/app/src/main/AndroidManifest.xml")
if not manifest_path.exists():
    raise SystemExit("Capacitor AndroidManifest.xml missing; run npx cap add/sync first.")

tree = ET.parse(manifest_path)
root = tree.getroot()
application = root.find("application")
if application is None:
    raise SystemExit("Android application element missing.")

a = lambda prop: f"{{{ANDROID_NS}}}{prop}"
t = lambda prop: f"{{{TOOLS_NS}}}{prop}"

# Nothing from the app's private storage should be uploaded by Android Auto
# Backup or moved through Android device-transfer backup APIs.
application.set(a("allowBackup"), "false")
application.set(a("dataExtractionRules"), "@xml/hdt_data_extraction_rules")
application.set(a("fullBackupContent"), "@xml/hdt_full_backup_content")
application.set(a("usesCleartextTraffic"), "false")

# This is an intentionally offline-only app. APK assets load via Capacitor's
# local WebView asset handler; PDF sharing delegates to external apps. Removing
# INTERNET/AD_ID at manifest merge also prevents future SDKs re-adding them
# unnoticed. If future releases require networking, reassess Data safety first.
blocked = [
    "com.google.android.gms.permission.AD_ID",
    "android.permission.INTERNET",
]
for child in list(root):
    if child.tag in ("uses-permission", "uses-permission-sdk-23") and child.get(a("name")) in blocked:
        root.remove(child)
for name in blocked:
    ET.SubElement(root, "uses-permission", {a("name"): name, t("node"): "remove"})

tree.write(manifest_path, encoding="utf-8", xml_declaration=True)

resource_dir = Path("android/app/src/main/res/xml")
resource_dir.mkdir(parents=True, exist_ok=True)

# Android 11 and below.
(resource_dir / "hdt_full_backup_content.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n'
    '<full-backup-content>\n'
    '    <exclude domain="root" path="." />\n'
    '    <exclude domain="external" path="." />\n'
    '</full-backup-content>\n', encoding="utf-8")

# Android 12+ distinguishes cloud backup from device transfer.
(resource_dir / "hdt_data_extraction_rules.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n'
    '<data-extraction-rules>\n'
    '    <cloud-backup>\n'
    '        <exclude domain="root" path="." />\n'
    '        <exclude domain="external" path="." />\n'
    '    </cloud-backup>\n'
    '    <device-transfer>\n'
    '        <exclude domain="root" path="." />\n'
    '        <exclude domain="external" path="." />\n'
    '    </device-transfer>\n'
    '</data-extraction-rules>\n', encoding="utf-8")

print("Capacitor Android privacy hardening applied:")
print("  Advertising ID and INTERNET: removed from merged manifest")
print("  Android Auto Backup and D2D-transfer data: disabled/excluded")
print("  Plaintext external network traffic: disabled")
print("  On-device PDF sharing remains enabled; run device regression tests.")
