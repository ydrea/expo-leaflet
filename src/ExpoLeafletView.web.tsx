import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { View } from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ExpoLeafletViewProps, 
  LeafletMapRef, 
  LatLng, 
  MarkerOptions, 
  PolygonOptions, 
  CircleOptions,
  MapEvent
} from './ExpoLeaflet.types';
import type { StyleProp, ViewStyle } from 'react-native';
//

// Fix for default markers in web
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ExpoLeafletViewWeb = React.forwardRef<LeafletMapRef, ExpoLeafletViewProps>(
  ({ options, onMapReady, onMapClick, onMarkerClick, style }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markers = useRef<Map<string, L.Marker>>(new Map());
    const polygons = useRef<Map<string, L.Polygon>>(new Map());
    const circles = useRef<Map<string, L.Circle>>(new Map());

    // Initialize map
useEffect(() => {
  // if (!mapRef.current || mapInstance.current) return;

  console.log('useEffect called, mapRef.current:', !!mapRef.current);
  console.log('mapInstance.current:', !!mapInstance.current);
  
  if (!mapRef.current || mapInstance.current) return;
  console.log('Initializing map...');
  // Create default options
  const defaultOptions = {
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13,
    minZoom: undefined,
    maxZoom: undefined,
    zoomControl: true,
    scrollWheelZoom: true
  };

  // Merge with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  const map = L.map(mapRef.current).setView(
    [mergedOptions.center.lat, mergedOptions.center.lng],
    mergedOptions.zoom
  );

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Set map options
  if (mergedOptions.minZoom !== undefined) map.setMinZoom(mergedOptions.minZoom);
  if (mergedOptions.maxZoom !== undefined) map.setMaxZoom(mergedOptions.maxZoom);
  if (mergedOptions.zoomControl === false) map.removeControl(map.zoomControl);
  if (mergedOptions.scrollWheelZoom !== undefined) {
    mergedOptions.scrollWheelZoom ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable();
  }

  mapInstance.current = map;

  // Handle map click events
  if (onMapClick) {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const event: MapEvent = {
        type: 'mapClick',
        latlng: e.latlng
      };
      onMapClick({ nativeEvent: event });
    };
    map.on('click', handleMapClick);
  }
////////////////////////////////////////////
  // Notify that map is ready

  console.log('Setting up onMapReady timeout');
  setTimeout(() => {
    console.log('onMapReady timeout fired');
    onMapReady?.();
  }, 100);

  return () => {
    console.log('Cleanup called');
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
  };
}, [options, onMapReady, onMapClick]);

  // setTimeout(() => {
  //   onMapReady?.();
  // }, 100);

  // return () => {
  //   if (mapInstance.current) {
  //     mapInstance.current.remove();
  //     mapInstance.current = null;
  //   }
// In the useEffect of ExpoLeafletView.web.tsx, replace the timeout:
// Notify that map is ready - use requestAnimationFrame for better testability
// const readyId = requestAnimationFrame(() => {
//   onMapReady?.();
// });

// return () => {
//   if (mapInstance.current) {
//     mapInstance.current.remove();
//     mapInstance.current = null;
//   }
//   cancelAnimationFrame(readyId);
// };
  
// }, [options, onMapReady, onMapClick]);

/////////////////////////////////////

    useImperativeHandle(ref, () => ({
      setView: (center: LatLng, zoom: number) => {
        if (mapInstance.current) {
          mapInstance.current.setView([center.lat, center.lng], zoom);
        }
      },
      addMarker: (options: MarkerOptions): string => {
        if (!mapInstance.current) return '';
        
        const id = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Handle custom icons
        let icon: L.Icon | L.DivIcon | undefined;
        if (options.icon) {
          icon = L.icon({
            iconUrl: options.icon.iconUrl,
            iconSize: options.icon.iconSize || [25, 41],
            iconAnchor: options.icon.iconAnchor || [12, 41],
            popupAnchor: options.icon.popupAnchor || [1, -34]
          });
        }

        const marker = L.marker([options.position.lat, options.position.lng], {
          title: options.title,
          draggable: options.draggable,
          icon: icon
        }).addTo(mapInstance.current);

        if (options.title) {
          marker.bindPopup(options.title);
        }

        marker.on('click', (e) => {
          if (onMarkerClick) {
            const event: MapEvent = {
              type: 'markerClick',
              id,
              latlng: e.latlng
            };
            onMarkerClick({ nativeEvent: event });
          }
        });

        markers.current.set(id, marker);
        return id;
      },
      removeMarker: (id: string) => {
        const marker = markers.current.get(id);
        if (marker && mapInstance.current) {
          mapInstance.current.removeLayer(marker);
          markers.current.delete(id);
        }
      },
      addPolygon: (options: PolygonOptions): string => {
        if (!mapInstance.current) return '';
        
        const id = `polygon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const latlngs = options.positions.map(pos => [pos.lat, pos.lng] as [number, number]);
        const polygon = L.polygon(latlngs, {
          color: options.color || '#3388ff',
          fillColor: options.fillColor || '#3388ff',
          fillOpacity: options.fillOpacity || 0.2,
          weight: options.weight || 3
        }).addTo(mapInstance.current);

        polygons.current.set(id, polygon);
        return id;
      },
      removePolygon: (id: string) => {
        const polygon = polygons.current.get(id);
        if (polygon && mapInstance.current) {
          mapInstance.current.removeLayer(polygon);
          polygons.current.delete(id);
        }
      },
  addCircle: (options: CircleOptions): string => {
  if (!mapInstance.current) return '';
  
  const id = `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Use the options parameter (the function argument), not the component prop
  const centerLat = options.center?.lat ?? 51.505;
  const centerLng = options.center?.lng ?? -0.09;
  
  const circle = L.circle([centerLat, centerLng], {
    radius: options.radius,
    color: options.color || '#3388ff',
    fillColor: options.fillColor || '#3388ff',
    fillOpacity: options.fillOpacity || 0.2,
    weight: options.weight || 3
  }).addTo(mapInstance.current);

  circles.current.set(id, circle);
  return id;
},      removeCircle: (id: string) => {
        const circle = circles.current.get(id);
        if (circle && mapInstance.current) {
          mapInstance.current.removeLayer(circle);
          circles.current.delete(id);
        }
      },
      fitBounds: (bounds: [LatLng, LatLng]) => {
        if (mapInstance.current) {
          const latLngBounds = L.latLngBounds(
            [bounds[0].lat, bounds[0].lng],
            [bounds[1].lat, bounds[1].lng]
          );
          mapInstance.current.fitBounds(latLngBounds);
        }
      }
    }), [onMarkerClick]);

    return (
      <View style={style}>
        <div 
          ref={mapRef} 
      data-testid="expo-leaflet-map" // 
     style={{ 
        width: '100%', 
        height: '100%',
        minHeight: (style as ViewStyle)?.height || 400,
        backgroundColor: '#f0f0f0', // ← Optional: visible background
        ...(style ? (style as any) : {})
      }} 
        />
      </View>
    );
  }
);

export default ExpoLeafletViewWeb;