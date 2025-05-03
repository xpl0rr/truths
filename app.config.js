// app.config.js
export default ({ config }) => ({
    /* ───────── basic app info ───────── */
    owner: 'xplorr',
    name: 'truths',
    slug: 'truths',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    runtimeVersion: '1.0.0',
    icon: './assets/icon.png',
    scheme: 'truths',

    /* ───────── iOS ───────── */
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.xplorr.truths',      // ← no suffix
        infoPlist: { ITSAppUsesNonExemptEncryption: false },
        buildNumber: '2'
    },

    /* ───────── Android ───────── */
    android: {
        package: 'com.xplorr.truths'                // ← no suffix
    },

    /* ───────── Web / plugins / misc ───────── */
    web: {},
    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            { resizeMode: 'contain', backgroundColor: '#ffffff' }
        ]
    ],
    experiments: { typedRoutes: true },
    updates: { fallbackToCacheTimeout: 0 },

    /* ───────── Expo-EAS linkage ───────── */
    extra: {
        eas: { projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a' },
        router: { origin: false }
    }
});