import React from 'react';
import { requireNativeView } from 'expo';
import { ExpoLeafletViewProps, LeafletMapRef } from './ExpoLeaflet.types';

const NativeView = requireNativeView('ExpoLeafletView');

const ExpoLeafletViewNative = React.forwardRef<LeafletMapRef, ExpoLeafletViewProps>(
  (props, ref) => {
    return <NativeView ref={ref} {...props} />;
  }
);

export default ExpoLeafletViewNative;