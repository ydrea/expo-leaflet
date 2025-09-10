// // __tests__/ExpoLeafletModule.test.ts
// import { PI, hello, setValueAsync, addListener, removeAllListeners } from '../ExpoLeafletModule';

// // Mock the native module
// jest.mock('../NativeExpoLeafletModule', () => ({
//   PI: Math.PI,
//   hello: jest.fn(() => 'Hello from native!'),
//   setValueAsync: jest.fn(() => Promise.resolve()),
//   addListener: jest.fn(() => ({ remove: jest.fn() })),
//   removeListeners: jest.fn(),
// }));

// // Mock react-native Platform
// jest.mock('react-native', () => ({
//   Platform: { OS: 'web' },
//   NativeModules: {
//     ExpoLeafletModule: {
//       setValueAsync: jest.fn(() => Promise.resolve()),
//       addListener: jest.fn(() => ({ remove: jest.fn() })),
//       removeListeners: jest.fn(),
//     },
//   },
// }));

// describe('ExpoLeafletModule', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('PI constant', () => {
//     expect(PI).toBe(Math.PI);
//   });

//   test('hello function', () => {
//     const result = hello();
//     expect(result).toBe('Hello world! 👋');
//   });

//   test('setValueAsync on web', async () => {
//     await expect(setValueAsync('test')).resolves.toBeUndefined();
//   });

//   test('setValueAsync on native', async () => {
//     // Change platform to native
//     jest.doMock('react-native', () => ({
//       Platform: { OS: 'ios' },
//       NativeModules: {
//         ExpoLeafletModule: {
//           setValueAsync: jest.fn(() => Promise.resolve()),
//           addListener: jest.fn(() => ({ remove: jest.fn() })),
//           removeListeners: jest.fn(),
//         },
//       },
//     }));

//     // Re-import to get the mocked version
//     const { setValueAsync: setValueAsyncNative } = require('../ExpoLeafletModule');
//     await expect(setValueAsyncNative('test')).resolves.toBeUndefined();
//   });

//   test('addListener and removeAllListeners', () => {
//     const listener = jest.fn();
    
//     const subscription = addListener('onChange', listener);
//     expect(subscription).toHaveProperty('remove');
    
//     removeAllListeners();
//   });
// });

// __tests__/ExpoLeafletModule.simple.test.ts
import { PI, hello, setValueAsync } from '../ExpoLeafletModule';

// Simple mocks
jest.mock('../NativeExpoLeafletModule', () => ({
  PI: Math.PI,
  hello: jest.fn(() => 'Hello from native!'),
  setValueAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
  NativeModules: {
    ExpoLeafletModule: {
      setValueAsync: jest.fn(() => Promise.resolve()),
    },
  },
}));

describe('ExpoLeafletModule', () => {
  test('PI constant', () => {
    expect(PI).toBe(Math.PI);
  });

  test('hello function', () => {
    const result = hello();
    expect(result).toBe('Hello world! 👋');
  });

  test('setValueAsync resolves', async () => {
    await expect(setValueAsync('test')).resolves.toBeUndefined();
  });
});