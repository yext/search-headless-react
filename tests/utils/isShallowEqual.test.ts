import isShallowEqual from '../../src/utils/isShallowEqual';

describe('handles arrays properly', () => {
  it('equal arrays', () => {
    const obj = {
      test: 'hi'
    };
    const arr1 = [ 1, 2, obj ];
    const arr2 = [ 1, 2, obj ];
    expect(isShallowEqual(arr1, arr2)).toBeTruthy();
  });

  it('arrays of different sizes', () => {
    expect(isShallowEqual([], [1])).toBeFalsy();
    expect(isShallowEqual([1], [])).toBeFalsy();
  });

  it('arrays with different orderings', () => {
    const obj = {
      test: '123'
    };
    const arr1 = [ 1, obj ];
    const arr2 = [ obj, 1 ];
    expect(isShallowEqual(arr1, arr2)).toBeFalsy();
  });
});

it('only compares object value references, rather than doing a deep comparison', () => {
  const originalObj = {
    childObj: {
      test: 'hi'
    }
  };
  const newObj = {
    childObj: {
      test: 'hi'
    }
  };
  expect(isShallowEqual(originalObj, newObj)).toBeFalsy();
});

it('handles objects with equal value references', () => {
  const childObj = {
    test: 'hi',
    more: {
      nesting: true
    }
  };
  const originalObj = {
    aNum: 1,
    aString: 'boo',
    aBool: true,
    childObj,
  };
  const newObj = {
    aNum: 1,
    aString: 'boo',
    aBool: true,
    childObj,
  };
  expect(isShallowEqual(originalObj, newObj)).toBeTruthy();
});

it('handles objects with different values', () => {
  const originalObj = {
    test: 'hi',
  };
  const newObj = {
    test: 'bye'
  };
  expect(isShallowEqual(originalObj, newObj)).toBeFalsy();
});

it('handles objects with different numbers of keys', () => {
  const originalObj = {};
  const newObj = {
    test: 'bye'
  };
  expect(isShallowEqual(originalObj, newObj)).toBeFalsy();
});

it('handles objects with empty arrays that have different references', () => {
  const originalObj = {
    test: []
  };
  const newObj = {
    test: []
  };
  expect(isShallowEqual(originalObj, newObj)).toBeFalsy();
});
