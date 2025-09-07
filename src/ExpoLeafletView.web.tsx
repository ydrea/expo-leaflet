import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ExpoLeafletViewProps, 
  LatLng, 
  MapOptions, 
  MarkerOptions, 
  PolygonOptions, 
  CircleOptions, 
  LeafletMapRef,
  MapEvent
} from './ExpoLeaflet.types';

// Fix for default markers in web
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ExpoLeafletView = forwardRef<LeafletMapRef, ExpoLeafletViewProps>(({
  options,
  onMapReady,
  onMapClick,
  onMarkerClick,
  url, // Optional custom tile URL
  onLoad, // Optional load event
  style
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markers = useRef<Map<string, L.Marker>>(new Map());
  const polygons = useRef<Map<string, L.Polygon>>(new Map());
  const circles = useRef<Map<string, L.Circle>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView(
      [options.center.lat, options.center.lng],
      options.zoom
    );

    // Use provided URL for tile layer or default to OSM
    const tileLayerUrl = url || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(tileLayerUrl, {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Set map options
    if (options.minZoom !== undefined) map.setMinZoom(options.minZoom);
    if (options.maxZoom !== undefined) map.setMaxZoom(options.maxZoom);
    if (options.zoomControl === false) map.removeControl(map.zoomControl);
    if (options.scrollWheelZoom !== undefined) {
      options.scrollWheelZoom ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable();
    }

    mapInstance.current = map;

    // Notify that map is loaded (if onLoad callback provided)
    if (onLoad) {
      onLoad({ nativeEvent: { url: tileLayerUrl } });
    }

    // Notify that map is ready
    setTimeout(() => {
      onMapReady?.();
    }, 100);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

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
          iconSize: options.icon.iconSize,
          iconAnchor: options.icon.iconAnchor,
          popupAnchor: options.icon.popupAnchor
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
      const circle = L.circle([options.center.lat, options.center.lng], {
        radius: options.radius,
        color: options.color || '#3388ff',
        fillColor: options.fillColor || '#3388ff',
        fillOpacity: options.fillOpacity || 0.2,
        weight: options.weight || 3
      }).addTo(mapInstance.current);

      circles.current.set(id, circle);
      return id;
    },
    removeCircle: (id: string) => {
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

  // Handle map click events
  useEffect(() => {
    if (!mapInstance.current || !onMapClick) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        const event: MapEvent = {
          type: 'mapClick',
          latlng: e.latlng
        };
        onMapClick({ nativeEvent: event });
      }
    };

    mapInstance.current.on('click', handleMapClick);
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('click', handleMapClick);
      }
    };
  }, [onMapClick]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        ...(style as any)
      }}
    />
  );
});

export default ExpoLeafletView;