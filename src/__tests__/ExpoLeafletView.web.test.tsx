// __tests__/debug.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ExpoLeafletViewWeb from '../ExpoLeafletView.web';

// Simple mocks to reduce noise
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    scrollWheelZoom: { enable: jest.fn(), disable: jest.fn() },
    zoomControl: { remove: jest.fn() },
  })),
  tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
  marker: jest.fn(() => ({ addTo: jest.fn(), bindPopup: jest.fn(), on: jest.fn() })),
  Icon: {
    Default: {
      mergeOptions: jest.fn(),
      prototype: { _getIconUrl: 'test' },
    },
  },
}));

jest.mock('leaflet/dist/leaflet.css', () => ({}));

jest.mock('react-native', () => ({
View: 'div',
  // const React = require('react') 
  // View: ({ children, ...props }: any) => {
  //   return React.createElement('div', props, children);
  // },
}));

describe('Debug Test', () => {
  test('debug component behavior', () => {
    console.log('=== STARTING DEBUG TEST ===');
    
    const onMapReady = jest.fn(() => {
      console.log('onMapReady callback was called!');
    });
    
    const props = {
      options: {
        center: { lat: 51.505, lng: -0.09 },
        zoom: 13,
      },
      onMapReady,
      style: { height: 500, width: 500 },
    };
    
    console.log('Rendering component...');
    const { unmount } = render(<ExpoLeafletViewWeb {...props} />);
    
    // Wait a bit to see if timeout fires
    setTimeout(() => {
      console.log('Timeout completed, onMapReady called:', onMapReady.mock.calls.length);
    }, 200);
    
    console.log('Unmounting component...');
    unmount();
    
    console.log('=== DEBUG TEST COMPLETE ===');
  });
});