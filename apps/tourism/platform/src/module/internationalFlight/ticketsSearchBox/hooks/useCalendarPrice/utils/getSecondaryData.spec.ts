import getSecondaryData from './getSecondaryData';

describe('getSecondaryData', () => {
  it('should return the correct secondary data', () => {
    const rawData = '<font color="red" font-size="16px" font-weight="bold">Hello World</font>';
    const expectedData = {
      textContent: 'Hello World',
      style: {
        color: 'red',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    };
    const result = getSecondaryData(rawData);
    expect(result).toEqual(expectedData);
  });

  it('should return the default data when the regex does not match', () => {
    const rawData = 'This is a test';
    const expectedData = { textContent: '' };
    const result = getSecondaryData(rawData);
    expect(result).toEqual(expectedData);
  });
});
