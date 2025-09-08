// Jest will automatically use the mock from __mocks__ folder
import ExpoLeafletModule from '../__mocks__/ExpoLeafletModule.web';

describe('ExpoLeafletModule (Web)', () => {
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
});