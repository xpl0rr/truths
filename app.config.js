// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  /* inherit Expo defaults */
  ...config,

  /* ── basic app info ───────────────────────── */
  name: 'Wisdom',
  slug: 'wisdom',          // keep slug in sync with name
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'wisdom',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',

  /* ── EAS project & env vars ──────────────── */
  extra: {
    ...(config.extra || {}),
    eas: { projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a' },
    // add any other env vars here, e.g. API keys
  },

  /* ── iOS settings ────────────────────────── */
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.doug.wisdom',  // <— unique per-app!
    supportsTablet: true,
    buildNumber: '2',                     // bump when you rebuild
  },

  /* ── Android settings ───────────────────── */
  android: {
    ...config.android,
    package: 'com.doug.wisdom',
  },

  /* ── runtime & updates ───────────────────── */
  runtimeVersion: '1.0.0',

  // Disable OTA for a true, Metro-free release build.
  // Flip `enabled` back to true (and set a channel)
  // when you’re ready to use EAS Update.
  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0,
  },

  /* ── owner (for EAS services) ────────────── */
  owner: 'xplorr',
});