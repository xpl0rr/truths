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
            bundleIdentifier: 'com.xplorr.truths',
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            },
        },
        android: {
            package: 'com.xplorr.truths',
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
        },
        web: {
            favicon: './assets/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
            'expo-dev-client',
        ],
        experiments: {
            typedRoutes: true,
        },
        updates: {
            url: 'https://u.expo.dev/4137856e-1f8e-436a-8b2f-3e0fb7f94b4a',
        },
        extra: {
            eas: {
                projectId: '4137856e-1f8e-436a-8b2f-3e0fb7f94b4a'
            }
        }
    }
};