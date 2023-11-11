import { describe, test, expect, vi } from 'vitest';
import { lazyFunction } from '../src/lazy-function.js';

const functionMock = vi.fn();

let imported = 0;
vi.mock('./test1.js', () => {
  imported++;
  return {
    default: functionMock,
  };
});

const importMeta = {
  resolve: vi.fn(),
};

describe('lazy-function', () => {
  test('call it two times', async () => {
    const functionArgs = [Symbol('functionArg1', Symbol('functionArg2'))];
    const functionArgs2 = [Symbol('functionArg2.1', Symbol('functionArg2.2'))];
    const result = Symbol('result');
    const result2 = Symbol('result2');
    functionMock.mockReturnValueOnce(result);
    functionMock.mockReturnValueOnce(result2);
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    const fn = lazyFunction(importMeta, './test1.js');
    expect(imported).toBe(0);
    expect(functionMock).not.toBeCalled();
    await expect(fn(...functionArgs)).resolves.toBe(result);
    expect(imported).toBe(1);
    expect(functionMock).toHaveBeenCalledOnce();
    expect(functionMock).toHaveBeenLastCalledWith(...functionArgs);
    await expect(fn(...functionArgs2)).resolves.toBe(result2);
    expect(imported).toBe(1);
    expect(functionMock).toHaveBeenCalledTimes(2);
    expect(functionMock).toHaveBeenLastCalledWith(...functionArgs2);
  });
});
