
import React from 'react';
import { render } from '@testing-library/react-native';

// Super simple WebView mock - no React.createElement needed
jest.mock('react-native-webview', () => ({
  WebView: () => null // Return null or simple component
}));

import ExpoLeafletView from '../ExpoLeafletView';

describe('ExpoLeafletView Logic', () => {
  const mockOptions = {
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13
  };

  it('renders without crashing', () => {
    expect(() => {
      render(<ExpoLeafletView options={mockOptions} />);
    }).not.toThrow();
  });

  it('accepts onMapReady callback prop', () => {
    const onMapReady = jest.fn();
    
    expect(() => {
      render(<ExpoLeafletView options={mockOptions} onMapReady={onMapReady} />);
    }).not.toThrow();
  });
});