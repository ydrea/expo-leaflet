// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// Simple mocks
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

// Mock leaflet for all tests
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
  polygon: jest.fn(() => ({ addTo: jest.fn() })),
  circle: jest.fn(() => ({ addTo: jest.fn() })),
  Icon: {
    Default: {
      mergeOptions: jest.fn(),
      prototype: { _getIconUrl: 'test' },
    },
  },
}));

jest.mock('leaflet/dist/leaflet.css', () => ({}));