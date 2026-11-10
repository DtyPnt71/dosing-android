import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'de.hdt.dosiertool',
  appName: 'HDT Dosier-Tool',
  webDir: 'dist',
  // All app assets are bundled into the APK, so measurements work offline.
  server: {
    androidScheme: 'https',
  },
}

export default config
