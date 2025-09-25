import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cabsul.fr',
  appName: 'lesieurtab',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
    allowNavigation: ['https://alik144.sg-host.com']
  },
  android: {
    webContentsDebuggingEnabled: true
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      StatusBarBackgroundColor: '#1D4898',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      loadUrlTimeoutValue: '700000',
      AndroidGradlePluginVersion: '4.0.0'
    }
  }
};

export default config;
