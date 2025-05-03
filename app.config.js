// app.config.js

module.exports = function ({ config }) {
    const suffix = process.env.BUNDLE_SUFFIX ?? '';

    return {
        /* ───── basic app info ───── */
        owner: 'xplorr',
        name: 'truths',
        slug: 'truths',
        version: '1.0.0',
        orientation: 'portrait',
        userInterfaceStyle: 'light',
        runtimeVersion: '1.0.0',
        icon: './assets/icon.png',
        scheme: 'truths',

        /* ───── iOS ───── */
        ios: {
            supportsTablet: true,
            // bundleIdentifier is now ignored if native ios/ exists
        },
    };
};