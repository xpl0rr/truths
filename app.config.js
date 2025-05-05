// app.config.js
export default ({ config }) => ({
  // inherit Expo defaults
  ...config,

  /* ── basic app info ─────────────────────────────── */
  name: 'truths',
  slug: 'truths',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'truths',

  extra: {
    eas: {
      projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a',
    },
  },

  /* ── iOS ─────────────────────────────────────────── */
  ios: {
    bundleIdentifier: 'com.xplorr.truths',
    supportsTablet: true,
    buildNumber: '2',          // bump when you rebuild
  },

  /* ── OTA updates ────────────────────────────────── */
  updates: {
    url: 'https://u.expo.dev/4137856e-1f8e-436a-8b2f-3e0fb7f94b4a',
  },

  /* ── misc ───────────────────────────────────────── */
  owner: 'xplorr',
  runtimeVersion: '1.0.0',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
});