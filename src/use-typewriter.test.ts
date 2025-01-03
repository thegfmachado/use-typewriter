import { act, renderHook } from '@testing-library/react';
import { useTypewriter } from './use-typewriter';

afterEach(() => {
  jest.clearAllTimers();
});

test('should append characters correctly when write is called', async () => {
  const elem = document.createElement('div');
  const targetRef = { current: elem };

  const speed = 100;
  const buffer = 100;
  const text = 'Hello';
  const timeToComplete = speed * text.length + buffer;

  const { result } = renderHook(() => useTypewriter({ targetRef, speed }));

  act(() => {
    result.current.write(text).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete));

  expect(targetRef.current?.textContent).toBe(text);
});

test('should delete characters correctly when delete is called', async () => {
  const elem = document.createElement('div');
  const targetRef = { current: elem };

  const speed = 100;
  const buffer = 100;
  const text = 'Hello';
  const timeToComplete = speed * text.length + buffer;

  const { result } = renderHook(() => useTypewriter({ targetRef, speed }));

  act(() => {
    result.current.write(text).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete));

  act(() => {
    result.current.delete(3).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete));

  expect(targetRef.current?.textContent).toBe('He');
});

test('should call onWrite when new text is written', async () => {
  const onWriteMock = jest.fn();

  const elem = document.createElement('div');
  const targetRef = { current: elem };

  const speed = 100;
  const buffer = 100;
  const text = 'Hello';
  const timeToComplete = speed * text.length + buffer;

  const { result } = renderHook(() => useTypewriter({ targetRef, speed, onWrite: onWriteMock }));

  act(() => {
    result.current.write(text).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete));

  expect(onWriteMock).toHaveBeenCalledWith('H');
  expect(onWriteMock).toHaveBeenCalledWith('He');
  expect(onWriteMock).toHaveBeenCalledWith('Hel');
  expect(onWriteMock).toHaveBeenCalledWith('Hell');
  expect(onWriteMock).toHaveBeenCalledWith('Hello');
});

test('should call onComplete when the writing is done', async () => {
  const onCompleteMock = jest.fn();

  const elem = document.createElement('div');
  const targetRef = { current: elem };

  const speed = 100;
  const buffer = 100;
  const text = 'Hello';
  const timeToComplete = speed * text.length + buffer;

  const { result } = renderHook(() => useTypewriter({ targetRef, speed, onComplete: onCompleteMock }));

  act(() => {
    result.current.write(text).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete));

  expect(onCompleteMock).toHaveBeenCalledTimes(1);
});

test('should reset the text when reset is called', async () => {
  const elem = document.createElement('div');
  const targetRef = { current: elem };

  const speed = 100;
  const buffer = 100;
  const text = 'Hello';
  const timeToComplete = speed * text.length + buffer;

  const { result } = renderHook(() => useTypewriter({ targetRef, speed }));

  act(() => {
    result.current.write(text).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete));

  expect(targetRef.current?.textContent).toBe(text);

  act(() => {
    result.current.reset();
  });

  expect(targetRef.current?.textContent).toBe('');
});

test('should handle looping of text', async () => {
  const onWriteMock = jest.fn();

  const elem = document.createElement('div');
  const targetRef = { current: elem };

  const speed = 100;
  const buffer = 100;
  const text = 'Hello';
  const timeToComplete = speed * text.length + buffer;

  const { result } = renderHook(() => useTypewriter({ targetRef, speed, loop: true, onWrite: onWriteMock }));

  act(() => {
    result.current.write(text).start();
  });

  await new Promise((resolve) => setTimeout(resolve, timeToComplete * 2));

  expect(onWriteMock).toHaveBeenNthCalledWith(2, 'He');
});
