import { registerWebModule, NativeModule } from 'expo';

import { ExpoLeafletModuleEvents } from './ExpoLeaflet.types';

class ExpoLeafletModule extends NativeModule<ExpoLeafletModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoLeafletModule, 'ExpoLeafletModule');
