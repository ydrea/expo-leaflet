import { ConfigPlugin, withInfoPlist } from '@expo/config-plugins';

const withLeaflet: ConfigPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    // Ensure WebView permissions are set
    if (!config.modResults.NSAppTransportSecurity) {
      config.modResults.NSAppTransportSecurity = {
        NSAllowsArbitraryLoads: true,
        NSAllowsArbitraryLoadsInWebContent: true
      };
    }
    
    return config;
  });
};

export default withLeaflet;