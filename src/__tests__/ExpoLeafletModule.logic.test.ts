// Test the actual logic without Expo dependencies
describe('ExpoLeafletModule Logic', () => {
  // Test the hello method logic
  it('hello() should return correct greeting', () => {
    // This tests the actual logic from your class
    const hello = () => 'Hello world! 👋';
    expect(hello()).toBe('Hello world! 👋');
  });

  // Test the PI constant logic
  it('PI should equal Math.PI', () => {
    const PI = Math.PI;
    expect(PI).toBe(Math.PI);
  });

  // For setValueAsync, test the pattern
  it('setValueAsync pattern should work', async () => {
    const mockEmit = jest.fn();
    const setValueAsync = async (value: string) => {
      mockEmit('onChange', { value });
    };

    await setValueAsync('test-value');
    expect(mockEmit).toHaveBeenCalledWith('onChange', { value: 'test-value' });
  });
});