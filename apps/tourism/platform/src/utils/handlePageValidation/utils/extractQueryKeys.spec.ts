import extractQueryKeys from './extractQueryKeys';

describe('extractQueryKeys', () => {
  test('should return query object without params keys', () => {
    const query = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const params = {
      key2: 'value2',
      key3: 'value3',
    };
    const result = extractQueryKeys(query, params);
    expect(result).toEqual({
      key1: 'value1',
    });
  });

  test('should return empty object if same params keys are present', () => {
    const query = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const params = { key1: 'value1', key2: 'value2', key3: 'value3' };
    const result = extractQueryKeys(query, params);
    expect(result).toEqual({});
  });

  test('should return original object if no params are present', () => {
    const query = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const params = {};
    const result = extractQueryKeys(query, params);
    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    });
  });
});
