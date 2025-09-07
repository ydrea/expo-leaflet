import { NativeModule, requireNativeModule } from 'expo';

import { ExpoLeafletModuleEvents } from './ExpoLeaflet.types';

declare class ExpoLeafletModule extends NativeModule<ExpoLeafletModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoLeafletModule>('ExpoLeaflet');
