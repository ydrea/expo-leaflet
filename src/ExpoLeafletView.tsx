// import { requireNativeView } from 'expo';
// import * as React from 'react';

// import { ExpoLeafletViewProps } from './ExpoLeaflet.types';

// const NativeView: React.ComponentType<ExpoLeafletViewProps> =
//   requireNativeView('ExpoLeaflet');

// export default function ExpoLeafletView(props: ExpoLeafletViewProps) {
//   return <NativeView {...props} />;
// }

import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { LatLng, MapOptions, MarkerOptions, PolygonOptions, CircleOptions, LeafletMapRef, MapEvent } from './types';

interface LeafletViewProps {
  options: MapOptions;
  onMapReady?: () => void;
  onMapClick?: (event: MapEvent) => void;
  onMarkerClick?: (event: MapEvent) => void;
  style?: any;
}

const LeafletView = forwardRef<LeafletMapRef, LeafletViewProps>(({
  options,
  onMapReady,
  onMapClick,
  onMarkerClick,
  style
}, ref) => {
  const webViewRef = useRef<WebView>(null);
  const elementIdCounter = useRef(0);

  const generateHtml = useCallback((mapOptions: MapOptions) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { height: 100vh; width: 100vw; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map').setView([${mapOptions.center.lat}, ${mapOptions.center.lng}], ${mapOptions.zoom});
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markers = {};
    const polygons = {};
    const circles = {};
    let elementId = 0;

    // Event listeners
    map.on('click', (e) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapClick',
        latlng: e.latlng
      }));
    });

    window.generateId = () => 'element_' + (elementId++);

    window.setView = (lat, lng, zoom) => {
      map.setView([lat, lng], zoom);
    };

    window.addMarker = (options) => {
      const id = window.generateId();
      const marker = L.marker([options.position.lat, options.position.lng], {
        title: options.title,
        draggable: options.draggable
      }).addTo(map);
      
      if (options.title) {
        marker.bindPopup(options.title);
      }

      marker.on('click', (e) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerClick',
          id: id,
          latlng: e.latlng
        }));
      });

      markers[id] = marker;
      return id;
    };

    window.removeMarker = (id) => {
      if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
      }
    };

    window.addPolygon = (options) => {
      const id = window.generateId();
      const latlngs = options.positions.map(pos => [pos.lat, pos.lng]);
      const polygon = L.polygon(latlngs, {
        color: options.color || '#3388ff',
        fillColor: options.fillColor || '#3388ff',
        fillOpacity: options.fillOpacity || 0.2,
        weight: options.weight || 3
      }).addTo(map);
      
      polygons[id] = polygon;
      return id;
    };

    window.removePolygon = (id) => {
      if (polygons[id]) {
        map.removeLayer(polygons[id]);
        delete polygons[id];
      }
    };

    window.addCircle = (options) => {
      const id = window.generateId();
      const circle = L.circle([options.center.lat, options.center.lng], {
        radius: options.radius,
        color: options.color || '#3388ff',
        fillColor: options.fillColor || '#3388ff',
        fillOpacity: options.fillOpacity || 0.2,
        weight: options.weight || 3
      }).addTo(map);
      
      circles[id] = circle;
      return id;
    };

    window.removeCircle = (id) => {
      if (circles[id]) {
        map.removeLayer(circles[id]);
        delete circles[id];
      }
    };

    window.fitBounds = (bounds) => {
      const latLngBounds = L.latLngBounds(
        [bounds[0].lat, bounds[0].lng],
        [bounds[1].lat, bounds[1].lng]
      );
      map.fitBounds(latLngBounds);
    };

    // Notify React Native that map is ready
    setTimeout(() => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapReady'
      }));
    }, 100);
  </script>
</body>
</html>
    `;
  }, []);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'mapReady':
          onMapReady?.();
          break;
        case 'mapClick':
          onMapClick?.(data);
          break;
        case 'markerClick':
          onMarkerClick?.(data);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [onMapReady, onMapClick, onMarkerClick]);

  useImperativeHandle(ref, () => ({
    setView: (center: LatLng, zoom: number) => {
      webViewRef.current?.injectJavaScript(`
        window.setView(${center.lat}, ${center.lng}, ${zoom});
        true;
      `);
    },
    addMarker: (options: MarkerOptions): string => {
      const id = `marker_${elementIdCounter.current++}`;
      webViewRef.current?.injectJavaScript(`
        window.marker_${id} = window.addMarker(${JSON.stringify(options)});
        true;
      `);
      return id;
    },
    removeMarker: (id: string) => {
      webViewRef.current?.injectJavaScript(`
        window.removeMarker("${id}");
        true;
      `);
    },
    addPolygon: (options: PolygonOptions): string => {
      const id = `polygon_${elementIdCounter.current++}`;
      webViewRef.current?.injectJavaScript(`
        window.polygon_${id} = window.addPolygon(${JSON.stringify(options)});
        true;
      `);
      return id;
    },
    removePolygon: (id: string) => {
      webViewRef.current?.injectJavaScript(`
        window.removePolygon("${id}");
        true;
      `);
    },
    addCircle: (options: CircleOptions): string => {
      const id = `circle_${elementIdCounter.current++}`;
      webViewRef.current?.injectJavaScript(`
        window.circle_${id} = window.addCircle(${JSON.stringify(options)});
        true;
      `);
      return id;
    },
    removeCircle: (id: string) => {
      webViewRef.current?.injectJavaScript(`
        window.removeCircle("${id}");
        true;
      `);
    },
    fitBounds: (bounds: [LatLng, LatLng]) => {
      webViewRef.current?.injectJavaScript(`
        window.fitBounds(${JSON.stringify(bounds)});
        true;
      `);
    }
  }), []);

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: generateHtml(options) }}
      style={style}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
    />
  );
});

export default LeafletView;