// app.config.js

module.exports = {
    expo: {
        name: 'truths',
        slug: 'truths',
        owner: 'xplorr',
        version: '1.0.0',
        orientation: 'portrait',
        userInterfaceStyle: 'light',
        runtimeVersion: '1.0.0',
        icon: './assets/icon.png',
        scheme: 'truths',
        ios: {
            supportsTablet: true,
            "bundleIdentifier": "com.xplorr.truths"
        },
        extra: {
            eas: {
                projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a'
            }
        }
    }
};