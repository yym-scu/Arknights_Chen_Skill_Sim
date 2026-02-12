import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chensimulator.app',
  appName: 'Chen Simulator',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
