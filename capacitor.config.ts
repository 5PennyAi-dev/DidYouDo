import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.didyoudo.app',
  appName: 'DidYouDo',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#FF6B35',
    },
    Haptics: {},
    Preferences: {},
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
