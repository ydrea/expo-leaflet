
import React from 'react';
import { render } from '@testing-library/react';

// Mock the CSS import explicitly at the VERY TOP
jest.mock('leaflet/dist/leaflet.css', () => ({}));

// Now use require() instead of import to ensure proper mock order
const ExpoLeafletView = require('../ExpoLeafletView.web').default;

describe('ExpoLeafletView Web Ref', () => {
  const mockOptions = {
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13
  };

  it('exposes ref methods', () => {
    const ref = React.createRef<any>();
    render(<ExpoLeafletView ref={ref} options={mockOptions} />);
    
    expect(ref.current).toBeDefined();
    expect(typeof ref.current.setView).toBe('function');
    expect(typeof ref.current.addMarker).toBe('function');
    expect(typeof ref.current.removeMarker).toBe('function');
    expect(typeof ref.current.addPolygon).toBe('function');
    expect(typeof ref.current.addCircle).toBe('function');
    expect(typeof ref.current.fitBounds).toBe('function');
  });

  it('setView method is callable without errors', () => {
    const ref = React.createRef<any>();
    render(<ExpoLeafletView ref={ref} options={mockOptions} />);
    
    // Test that the method can be called without throwing errors
    expect(() => {
      ref.current.setView({ lat: 52.52, lng: 13.405 }, 10);
    }).not.toThrow();
  });

  it('addMarker method is callable without errors', () => {
    const ref = React.createRef<any>();
    render(<ExpoLeafletView ref={ref} options={mockOptions} />);
    
    expect(() => {
      ref.current.addMarker({
        position: { lat: 51.505, lng: -0.09 },
        title: 'Test Marker'
      });
    }).not.toThrow();
  });
});