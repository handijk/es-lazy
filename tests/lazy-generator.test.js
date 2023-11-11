import { describe, test, expect, vi } from 'vitest';
import { lazyGenerator } from '../src/lazy-generator.js';

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

describe('lazy-generator', () => {
  const result1 = Symbol('result1');
  const result2 = Symbol('result2');
  const result3 = Symbol('result3');

  async function* generatorFn() {
    yield result1;
    yield result2;
    yield result3;
  }

  test('call it and yield values two times', async () => {
    const functionArgs = [Symbol('functionArg1', Symbol('functionArg2'))];
    const functionArgs2 = [Symbol('functionArg1.1', Symbol('functionArg2.1'))];
    functionMock.mockReturnValueOnce(generatorFn());
    functionMock.mockReturnValueOnce(generatorFn());
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    const fn = lazyGenerator(importMeta, './test1.js');
    expect(imported).toBe(0);
    expect(functionMock).not.toBeCalled();
    const generator = fn(...functionArgs);
    expect(imported).toBe(0);
    expect(functionMock).not.toBeCalled();
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: result1,
    });
    expect(imported).toBe(1);
    expect(functionMock).toHaveBeenCalledOnce();
    expect(functionMock).toHaveBeenLastCalledWith(...functionArgs);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: result2,
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: result3,
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
    const generator2 = fn(...functionArgs2);
    expect(imported).toBe(1);
    expect(functionMock).toHaveBeenCalledOnce();
    await expect(generator2.next()).resolves.toStrictEqual({
      done: false,
      value: result1,
    });
    expect(imported).toBe(1);
    expect(functionMock).toHaveBeenCalledTimes(2);
    expect(functionMock).toHaveBeenLastCalledWith(...functionArgs2);
    await expect(generator2.next()).resolves.toStrictEqual({
      done: false,
      value: result2,
    });
    await expect(generator2.next()).resolves.toStrictEqual({
      done: false,
      value: result3,
    });
    await expect(generator2.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });
});
