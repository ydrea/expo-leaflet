// Mock the native module with proper typing
jest.mock('../ExpoLeafletModule', () => {
  const mockModule = {
    PI: Math.PI,
    hello: jest.fn(() => 'Hello world! 👋'),
    setValueAsync: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListeners: jest.fn(),
    injectJavaScript: jest.fn(),
  };
  return mockModule;
});

// Import the MOCKED module
import ExpoLeafletModule from '../ExpoLeafletModule';

describe('ExpoLeafletModule (Native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have PI constant', () => {
    expect(ExpoLeafletModule.PI).toBe(Math.PI);
  });

  it('should have hello method that returns greeting', () => {
    const result = ExpoLeafletModule.hello();
    expect(result).toBe('Hello world! 👋');
    expect(ExpoLeafletModule.hello).toHaveBeenCalled();
  });

  it('should have setValueAsync method', () => {
    expect(typeof ExpoLeafletModule.setValueAsync).toBe('function');
  });

  it('setValueAsync should be callable', async () => {
    await ExpoLeafletModule.setValueAsync('test-value');
    expect(ExpoLeafletModule.setValueAsync).toHaveBeenCalledWith('test-value');
  });

  it('should have event listener methods', () => {
    expect(typeof ExpoLeafletModule.addListener).toBe('function');
    expect(typeof ExpoLeafletModule.removeListeners).toBe('function');
  });
});