import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ExpoLeafletModule from '../ExpoLeafletModule';
import ExpoLeafletView from '../ExpoLeafletView';

// Track event listeners
const mockEventListeners = new Map<string, Function>();

// Proper mock with TypeScript compatibility
jest.mock('../ExpoLeafletModule', () => {
  const mockModule = {
    PI: Math.PI,
    hello: jest.fn(() => 'Hello world! 👋'),
    setValueAsync: jest.fn(),
    addListener: jest.fn((eventName: string, listener: Function) => {
      mockEventListeners.set(eventName, listener);
      return { remove: () => mockEventListeners.delete(eventName) };
    }),
    removeListeners: jest.fn(() => mockEventListeners.clear()),
    injectJavaScript: jest.fn(),
  };
  return mockModule;
});

describe('ExpoLeaflet Module-View Integration', () => {
  const mockOptions = {
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13
  };

  beforeEach(() => {
    mockEventListeners.clear();
    jest.clearAllMocks();
  });

  it('should integrate module constants with view rendering', () => {
    const { getByTestId } = render(
      <ExpoLeafletView 
        options={mockOptions} 
        testID="leaflet-map" 
        onMapLoad={jest.fn()} // Add the missing prop
      />
    );
    
    // View renders successfully
    expect(getByTestId('leaflet-map')).toBeDefined();
    
    // Module constants are accessible
    expect(ExpoLeafletModule.PI).toBe(Math.PI);
  });

  it('should handle module events from view interactions', async () => {
    const onMapReady = jest.fn();
    const onMapLoad = jest.fn();
    
    render(
      <ExpoLeafletView 
        options={mockOptions}
        onMapReady={onMapReady}
        onMapLoad={onMapLoad}
        testID="test-map"
      />
    );

    // Simulate map ready event from native module
    const mapReadyCallback = mockEventListeners.get('onMapReady');
    if (mapReadyCallback) {
      mapReadyCallback({ 
        nativeEvent: { 
          mapId: 'test-map', 
          center: mockOptions.center 
        }
      });
    }
    
    await waitFor(() => {
      expect(onMapReady).toHaveBeenCalled();
    });
  });
});