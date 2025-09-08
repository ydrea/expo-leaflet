import React from 'react';
import { render } from '@testing-library/react-native';

// Basic WebView mock
jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return { WebView: View }; // use View directly
});

import ExpoLeafletView from '../ExpoLeafletView';

describe('ExpoLeafletView Smoke Test', () => {
  const mockOptions = {
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13
  };

  it('renders without crashing', () => {
    expect(() => {
      render(React.createElement(ExpoLeafletView, { options: mockOptions }));
    }).not.toThrow();
  });

  it('accepts basic props', () => {
    const onMapReady = jest.fn();
    
    expect(() => {
      render(React.createElement(ExpoLeafletView, { 
        options: mockOptions, 
        onMapReady 
      }));
    }).not.toThrow();
  });
});
