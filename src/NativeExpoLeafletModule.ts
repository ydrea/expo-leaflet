// Native module shim for TypeScript
import { NativeModules } from 'react-native';

const { ExpoLeafletModule } = NativeModules;

interface NativeExpoLeafletModule {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default ExpoLeafletModule as NativeExpoLeafletModule;