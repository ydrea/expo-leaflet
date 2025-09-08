import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo', () => ({
}));

// Mock React Native WebView
jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return {
    WebView: View,
  };
});

// Mock Leaflet for web tests
// jest.mock('leaflet', () => ({
//   map: jest.fn(() => ({
//     setView: jest.fn(),
//     on: jest.fn(),
//     off: jest.fn(),
//     remove: jest.fn(),
//     addLayer: jest.fn(),
//     removeLayer: jest.fn()
//   })),
//   tileLayer: jest.fn(() => ({
//     addTo: jest.fn()
//   })),
//   marker: jest.fn(() => ({
//     addTo: jest.fn(),
//     bindPopup: jest.fn(),
//     on: jest.fn()
//   })),
//   polygon: jest.fn(() => ({
//     addTo: jest.fn()
//   })),
//   circle: jest.fn(() => ({
//     addTo: jest.fn()
//   })),
//   Icon: {
//     Default: {
//       mergeOptions: jest.fn(),
//       prototype: {}
//     }
//   }
// }));