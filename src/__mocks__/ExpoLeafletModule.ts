// Properly typed mock
const mockExpoLeafletModule = {
  // Constants
  PI: Math.PI,
  
  // Methods
  hello: jest.fn(() => 'Hello world! 👋'),
  setValueAsync: jest.fn(),
  
  // Event system with proper typing
  addListener: jest.fn((eventName: string, listener: Function) => {
    return { remove: jest.fn() };
  }),
  
  removeListeners: jest.fn(),
  
  // WebView communication
  injectJavaScript: jest.fn(),
};

// Cast to proper type
export default mockExpoLeafletModule as unknown as {
  PI: number;
  hello: () => string;
  setValueAsync: (value: string) => Promise<void>;
  addListener: (eventName: string, listener: Function) => { remove: () => void };
  removeListeners: () => void;
  injectJavaScript: (script: string) => void;
};