import { describe, test, expect, vi } from 'vitest';
import { lazyFunctionFactory } from '../src/lazy-function-factory.js';

const factoryMock = vi.fn();

let imported = 0;
vi.mock('./test1.js', () => {
  imported++;
  return {
    default: factoryMock,
  };
});

const importMeta = {
  resolve: vi.fn(),
};

describe('lazy-function-factory', () => {
  test('create factory and call it two times', async () => {
    const factoryArgs = [Symbol('factoryArg1', Symbol('factoryArg2'))];
    const functionArgs = [Symbol('functionArg1', Symbol('functionArg2'))];
    const functionArgs2 = [Symbol('functionArg2.1', Symbol('functionArg2.2'))];
    const result = Symbol('result');
    const result2 = Symbol('result2');
    const functionMock = vi.fn();
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    factoryMock.mockReturnValueOnce(functionMock);
    functionMock.mockReturnValueOnce(result);
    functionMock.mockReturnValueOnce(result2);
    const factory = lazyFunctionFactory(importMeta, './test1.js');
    expect(imported).toBe(0);
    expect(factoryMock).not.toBeCalled();
    expect(functionMock).not.toBeCalled();
    const fn = factory(...factoryArgs);
    expect(imported).toBe(0);
    expect(factoryMock).not.toBeCalled();
    expect(functionMock).not.toBeCalled();
    await expect(fn(...functionArgs)).resolves.toBe(result);
    expect(imported).toBe(1);
    expect(factoryMock).toHaveBeenCalledOnce();
    expect(factoryMock).toHaveBeenLastCalledWith(...factoryArgs);
    expect(functionMock).toHaveBeenCalledOnce();
    expect(functionMock).toHaveBeenLastCalledWith(...functionArgs);
    await expect(fn(...functionArgs2)).resolves.toBe(result2);
    expect(factoryMock).toHaveBeenCalledOnce();
    expect(functionMock).toHaveBeenCalledTimes(2);
    expect(functionMock).toHaveBeenLastCalledWith(...functionArgs2);
  });
});
