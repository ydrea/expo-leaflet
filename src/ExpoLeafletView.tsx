import React from 'react';
import { Platform } from 'react-native'; // Removed unused imports
import { ExpoLeafletViewProps, LeafletMapRef } from './ExpoLeaflet.types';

const ExpoLeafletView = React.forwardRef<LeafletMapRef, ExpoLeafletViewProps>(
  (props, ref) => {
    if (Platform.OS === 'web') {
      const WebView = require('./ExpoLeafletView.web').default;
      return <WebView ref={ref} {...props} />;
    } else {
      const NativeView = require('./ExpoLeafletView.native').default;
      return <NativeView ref={ref} {...props} />;
    }
  }
);

export default ExpoLeafletView;