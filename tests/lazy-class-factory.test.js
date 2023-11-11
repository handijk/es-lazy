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

describe('lazy-class-factory', () => {
  test('create factory and instantiate it two times', async () => {
    const factoryArgs = [Symbol('factoryArg1', Symbol('factoryArg2'))];
    const functionArgs = [Symbol('functionArg1', Symbol('functionArg2'))];
    const functionArgs2 = [Symbol('functionArg2.1', Symbol('functionArg2.2'))];
    const classMock = vi.fn();
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    factoryMock.mockReturnValueOnce(classMock);
    const factory = lazyFunctionFactory(importMeta, './test1.js');
    expect(imported).toBe(0);
    expect(factoryMock).not.toBeCalled();
    expect(classMock).not.toBeCalled();
    const fn = factory(...factoryArgs);
    expect(imported).toBe(0);
    expect(factoryMock).not.toBeCalled();
    expect(classMock).not.toBeCalled();
    const result = await fn(...functionArgs);
    expect(imported).toBe(1);
    expect(factoryMock).toHaveBeenCalledOnce();
    expect(factoryMock).toHaveBeenLastCalledWith(...factoryArgs);
    expect(classMock).toHaveBeenCalledOnce();
    expect(classMock).toHaveBeenLastCalledWith(...functionArgs);
    expect(classMock.mock.instances[0]).toBe(result);
    const result2 = await fn(...functionArgs2);
    expect(factoryMock).toHaveBeenCalledOnce();
    expect(classMock).toHaveBeenCalledTimes(2);
    expect(classMock).toHaveBeenLastCalledWith(...functionArgs2);
    expect(classMock.mock.instances[1]).toBe(result2);
  });
});
