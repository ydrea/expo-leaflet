// Type definitions for expo-leaflet 0.1.0, withLeaflet.d.ts
export interface ConfigPlugin {
    (config: any): any;
}
export function withLeaflet(config: ConfigPlugin): ConfigPlugin;