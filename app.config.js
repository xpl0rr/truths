// app.config.js
export default ({ config }) => ({
  // inherit Expo defaults
  ...config,

  /* ── basic app info ─────────────────────────────── */
  name: 'wisdom',
  slug: 'wisdom',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'wisdom',

  extra: {
    eas: {
      projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a',
    },
  },

  /* ── iOS ─────────────────────────────────────────── */
  ios: {
    bundleIdentifier: 'com.xplorr.wisdom',
    supportsTablet: true,
    buildNumber: '2',          // bump when you rebuild
  },

  /* ── Android ─────────────────────────────────────── */
  android: {
    package: 'com.xplorr.wisdom',
  },

  /* ── OTA updates ────────────────────────────────── */
  updates: {
    url: 'https://u.expo.dev/4137856e-1f8e-436a-8b2f-3e0fb7f94b4a',
    fallbackToCacheTimeout: 0,
    checkAutomatically: 'ON_LOAD'
  },

  /* ── misc ───────────────────────────────────────── */
  owner: 'xplorr',
  runtimeVersion: '1.0.0',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
});