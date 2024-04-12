
import { format } from './no-exception.js';
import { it, describe } from 'node:test';
import { deepStrictEqual } from 'node:assert';

const startsWith = (str: string, prefix: string) => {
  return deepStrictEqual(str.slice(0, prefix.length), prefix);
};

describe('format.text', () => {

  it('should correctly format a number', () => {
      deepStrictEqual(format.text(5), '5');
  });

  it('should correctly format a string', () => {
      deepStrictEqual(format.text('foobar'), 'foobar');
  });

  it('should correctly format an instance of Error', () => {
      startsWith(format.text(new Error('foobar')), 'Error: foobar\n');
  });

  it('should correctly format an instance of a subclass of Error', () => {
    class SubError extends Error {}
    startsWith(format.text(new SubError('foobar')), 'Error: foobar\n');
  });

  it('should correctly format an instance of a subclass of Error with custom name', () => {
    class SubError extends Error {}
    SubError.prototype.name = 'SubError';
    startsWith(format.text(new SubError('foobar')), 'SubError: foobar\n');
  });

});
