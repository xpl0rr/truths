// app.config.js
export default ({ config }) => ({
  /** ───── basic app info ───── */
  name: 'truths',
  slug: 'truths',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'truths',

  /** ───── iOS ───── */
  ios: {
    bundleIdentifier: 'com.xplorr.truths',
    supportsTablet: true
  },

  /** ───── Android ───── */
  android: {
    package: 'com.xplorr.truths'
  },

  /** ───── extra Expo fields you already had ───── */
  owner: 'xplorr',
  runtimeVersion: '1.0.0',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png'
});