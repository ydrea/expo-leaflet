import { Platform } from 'react-native';
import { ExpoLeafletModuleEvents, ChangeEventPayload } from './ExpoLeaflet.types';

// Complete web event system
class WebEventEmitter {
  private listeners = new Map<keyof ExpoLeafletModuleEvents, Function[]>();

  addListener<EventName extends keyof ExpoLeafletModuleEvents>(
    eventName: EventName,
    listener: ExpoLeafletModuleEvents[EventName]
  ) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
    
    return {
      remove: () => this.removeListener(eventName, listener)
    };
  }

  removeListener<EventName extends keyof ExpoLeafletModuleEvents>(
    eventName: EventName,
    listener: ExpoLeafletModuleEvents[EventName]
  ) {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  removeAllListeners() {
    this.listeners.clear();
  }

  emit<EventName extends keyof ExpoLeafletModuleEvents>(
    eventName: EventName,
    ...args: Parameters<ExpoLeafletModuleEvents[EventName]>
  ) {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          (listener as Function)(...args);
        } catch (error) {
          console.error(`Error in ${eventName} listener:`, error);
        }
      });
    }
  }
}

// Global web event emitter
const webEventEmitter = new WebEventEmitter();

// Unified module implementation
export const PI = Math.PI;

export const hello = (): string => 'Hello world! 👋';

export const setValueAsync = async (value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    // Emit change event on web
    const eventPayload: ChangeEventPayload = { value };
    webEventEmitter.emit('onChange', eventPayload);
    return Promise.resolve();
  } else {
    // Native implementation
    const nativeModule = require('./NativeExpoLeafletModule');
    return nativeModule.setValueAsync(value);
  }
};

// Event listener methods for web compatibility
export const addListener = <EventName extends keyof ExpoLeafletModuleEvents>(
  eventName: EventName,
  listener: ExpoLeafletModuleEvents[EventName]
) => {
  if (Platform.OS === 'web') {
    return webEventEmitter.addListener(eventName, listener);
  } else {
    const nativeModule = require('./NativeExpoLeafletModule');
    return nativeModule.addListener(eventName, listener);
  }
};

export const removeAllListeners = () => {
  if (Platform.OS === 'web') {
    webEventEmitter.removeAllListeners();
  } else {
    const nativeModule = require('./NativeExpoLeafletModule');
    return nativeModule.removeAllListeners();
  }
};

// Optional: Helper method to get current listeners (useful for debugging)
export const getListenersCount = () => {
  if (Platform.OS === 'web') {
    let count = 0;
    webEventEmitter['listeners'].forEach(listeners => {
      count += listeners.length;
    });
    return count;
  } else {
    const nativeModule = require('./NativeExpoLeafletModule');
    return nativeModule.getListenersCount?.() || 0;
  }
};