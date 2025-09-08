import React, { createRef } from 'react';
import { render } from '@testing-library/react-native';
import ExpoLeafletView from '../ExpoLeafletView';

// Track injectJavaScript calls
let mockInjectJavaScript: jest.Mock;

// Mock WebView with proper ref handling
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return { 
    WebView: React.forwardRef((props: any, ref: any) => {
      // Store the ref methods that will be called
      React.useImperativeHandle(ref, () => ({
        injectJavaScript: (script: string) => {
          mockInjectJavaScript(script);
        }
      }));
      
      return React.createElement(View, { ...props, testID: "expo-leaflet-view" });
    })
  };
});

describe('ExpoLeafletView Native Ref Methods', () => {
  const mockOptions = {
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13
  };

  beforeEach(() => {
    mockInjectJavaScript = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exposes ref methods', () => {
    const ref = createRef<any>();
    render(React.createElement(ExpoLeafletView, { ref, options: mockOptions }));
    
    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.setView).toBe('function');
    expect(typeof ref.current?.addMarker).toBe('function');
  });

  it('setView calls injectJavaScript with correct script', () => {
    const ref = createRef<any>();
    render(React.createElement(ExpoLeafletView, { ref, options: mockOptions }));
    
    ref.current?.setView({ lat: 52.52, lng: 13.405 }, 10);
    
    expect(mockInjectJavaScript).toHaveBeenCalledWith(
      expect.stringContaining('window.setView(52.52, 13.405, 10)')
    );
  });
});