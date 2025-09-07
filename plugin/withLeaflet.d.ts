export interface ConfigPlugin {
    (config: any): any;
}
export function withLeaflet(config: ConfigPlugin): ConfigPlugin;