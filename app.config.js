// app.config.js  — FINAL VERSION
import 'dotenv/config';

export default ({ config }) => ({
  ...config,

  /* ── basic ───────────────────────────── */
  name: 'Wisdom',
  slug: 'wisdom',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'wisdom',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',

  /* ── EAS + env ───────────────────────── */
  extra: {
    ...(config.extra || {}),
    eas: { projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a' },
  },

  /* ── iOS ─────────────────────────────── */
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.doug.wisdom',   // **MUST be unique**
    supportsTablet: true,
    buildNumber: '1',                      // bump on every store upload
  },

  /* ── Android ─────────────────────────── */
  android: {
    ...config.android,
    package: 'com.doug.wisdom',
  },

  /* ── runtime & updates ───────────────── */
  runtimeVersion: '1.0.0',
  updates: { enabled: false },             // no OTA for now

  owner: 'xplorr',
});