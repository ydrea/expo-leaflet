import React from 'react';

const ExpoLeafletView = React.forwardRef((props: any, ref: any) => {
  React.useImperativeHandle(ref, () => ({
    setView: jest.fn(),
    addMarker: jest.fn(),
    removeMarker: jest.fn(),
    addPolygon: jest.fn(),
    removePolygon: jest.fn(),
    addCircle: jest.fn(),
    removeCircle: jest.fn(),
    fitBounds: jest.fn()
  }));

  return React.createElement('div', { 
    'data-testid': 'expo-leaflet-map',
    ...props 
  });
});

export default ExpoLeafletView;