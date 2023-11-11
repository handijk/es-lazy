import { describe, test, expect, vi } from 'vitest';
import { lazyClass } from '../src/lazy-class.js';

const classMock = vi.fn();

let imported = 0;
vi.mock('./test1.js', () => {
  imported++;
  return {
    default: classMock,
  };
});

const importMeta = {
  resolve: vi.fn(),
};

describe('lazy-class', () => {
  test('instantiate it two times', async () => {
    const functionArgs = [Symbol('functionArg1', Symbol('functionArg2'))];
    const functionArgs2 = [Symbol('functionArg2.1', Symbol('functionArg2.2'))];
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    importMeta.resolve.mockReturnValueOnce('./test1.js');
    const fn = lazyClass(importMeta, './test1.js');
    expect(imported).toBe(0);
    expect(classMock).not.toBeCalled();
    const result = await fn(...functionArgs);
    expect(imported).toBe(1);
    expect(classMock).toHaveBeenCalledOnce();
    expect(classMock).toHaveBeenLastCalledWith(...functionArgs);
    expect(classMock.mock.instances.length).toBe(1);
    expect(classMock.mock.instances[0]).toBe(result);
    const result2 = await fn(...functionArgs2);
    expect(imported).toBe(1);
    expect(classMock).toHaveBeenCalledTimes(2);
    expect(classMock).toHaveBeenLastCalledWith(...functionArgs2);
    expect(classMock.mock.instances.length).toBe(2);
    expect(classMock.mock.instances[1]).toBe(result2);
  });
});
