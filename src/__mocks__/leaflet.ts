// Manual mock for leaflet package
module.exports = {
  map: jest.fn(() => ({
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn()
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn()
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
    on: jest.fn()
  })),
  polygon: jest.fn(() => ({
    addTo: jest.fn()
  })),
  circle: jest.fn(() => ({
    addTo: jest.fn()
  })),
  Icon: {
    Default: {
      mergeOptions: jest.fn(),
      prototype: {}
    }
  }
};