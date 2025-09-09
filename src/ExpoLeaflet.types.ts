import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoLeafletModuleEvents = {
  onChange: (payload: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapOptions {
  center: LatLng;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  zoomControl?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  dragging?: boolean;
}

export interface MarkerOptions {
  position: LatLng;
  title?: string;
  draggable?: boolean;
  icon?: {
    iconUrl: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
  };
}

export interface PolygonOptions {
  positions: LatLng[];
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
}

export interface CircleOptions {
  center: LatLng;
  radius: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
}

export interface MapEvent {
  type: string;
  latlng?: LatLng;
  id?: string;
}

// Unified view props
export interface ExpoLeafletViewProps {
  // Map options
  options: MapOptions;
  
  // Event handlers
  onMapReady?: () => void;
  onMapClick?: (event: { nativeEvent: MapEvent }) => void;
  onMarkerClick?: (event: { nativeEvent: MapEvent }) => void;
  onLoad?: (event: { nativeEvent: OnLoadEventPayload }) => void;
  
  // Styling
  style?: StyleProp<ViewStyle>;
  
  // Standard React Native View props
  testID?: string;
  children?: React.ReactNode;
}

export interface LeafletMapRef {
  setView: (center: LatLng, zoom: number) => void;
  addMarker: (options: MarkerOptions) => string;
  removeMarker: (id: string) => void;
  addPolygon: (options: PolygonOptions) => string;
  removePolygon: (id: string) => void;
  addCircle: (options: CircleOptions) => string;
  removeCircle: (id: string) => void;
  fitBounds: (bounds: [LatLng, LatLng]) => void;
}

// Module interface
export interface ExpoLeafletModuleInterface {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}