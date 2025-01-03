import * as React from 'react';

/**
 * Configuration options for the typewriter hook.
 */
interface TypewriterOptions {
  /**
   * The target element to apply the typewriter effect.
   */
  targetRef: React.RefObject<HTMLElement | null>;
  /**
   * Typing and deleting speed in milliseconds per character. Defaults to 100ms.
   */
  speed?: number;
  /**
   * Whether to display a blinking cursor. Defaults to `true`.
   */
  cursor?: boolean;
  /**
   * The character to use for the blinking cursor. Defaults to `"|"`.
   */
  cursorChar?: string;
  /**
   * The speed of the blinking cursor in milliseconds. Defaults to `450ms`.
   */
  cursorSpeed?: number;
  /**
   * Whether to loop the typewriter queue. Defaults to `false`.
   */
  loop?: boolean;
  /**
   * Callback function that is called when new text is written.
   */
  onWrite?: (text: string) => void;
  /**
   * Callback function that is called when text is deleted.
   */
  onDelete?: (text: string) => void;
  /**
   * Callback function that is called when the typewriter completes a loop.
   */
  onComplete?: () => void;
}

/**
 * Methods available for controlling the typewriter instance.
 */
interface TypewriterInstance {
  /**
   * Appends new text to the typewriter output.
   *
   * @param text - The text to type.
   * @returns The typewriter instance to allow method chaining.
   */
  write: (text: string) => TypewriterInstance;

  /**
   * Deletes a specified number of characters from the current text.
   *
   * @param count - The number of characters to delete.
   * @returns The typewriter instance to allow method chaining.
   */
  delete: (count: number) => TypewriterInstance;

  /**
   * Pauses the typewriter effect for a specified duration.
   *
   * @param duration - The duration of the pause in milliseconds.
   * @returns The typewriter instance to allow method chaining.
   */
  stop: (duration: number) => TypewriterInstance;

  /**
   * Starts processing the typewriter queue.
   */
  start: () => void;

  /**
   * Resets the typewriter by clearing all text and pending tasks in the queue.
   */
  reset: () => void;
}

/**
 * Function to create a blinking cursor effect for a given text.
 *
 * @param text - The text to display.
 * @param cursorChar - The character to use for the blinking cursor.
 * @param interval - The blink interval in milliseconds.
 * @returns The text with a blinking cursor.
 */
function useBlinkingCursor(text: string, cursorChar: string, interval: number): string {
  const [cursorVisible, setCursorVisible] = React.useState(true);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return `${text}${cursorVisible ? cursorChar : ''}`;
}

/**
 * React hook to create a typewriter effect.
 */
function useTypewriter(options: TypewriterOptions): TypewriterInstance {
  const {
    targetRef,
    cursor,
    cursorSpeed = 450,
    cursorChar = '|',
    speed = 100,
    loop = false,
    onWrite,
    onDelete,
    onComplete,
  } = options;

  const queue = React.useRef<(() => Promise<void>)[]>([]);
  const lastQueue = React.useRef<(() => Promise<void>)[]>([]);

  const isQueueRunning = React.useRef(false);
  const [isWriting, setIsWriting] = React.useState(false);

  const [originalText, setOriginalText] = React.useState<string>(targetRef.current?.textContent || '');

  const timeouts = React.useRef<Set<globalThis.NodeJS.Timeout>>(new Set());

  const blinkingCursorText = useBlinkingCursor(originalText || '', cursorChar, cursorSpeed);

  const updateOriginalText = React.useCallback((text: string | null) => {
    setOriginalText(text ?? '');
  }, []);

  React.useEffect(() => {
    if (
      cursor &&
      queue.current.length === 0 &&
      targetRef.current &&
      !isWriting &&
      targetRef.current.textContent?.length
    ) {
      targetRef.current.textContent = blinkingCursorText;
    }
  }, [blinkingCursorText, cursor, isWriting, targetRef]);

  const setSafeTimeout = React.useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeouts.current.delete(timeoutId);
      callback();
    }, delay);
    timeouts.current.add(timeoutId);
  }, []);

  const clearAllTimeouts = React.useCallback(() => {
    for (const timeoutId of timeouts.current) {
      clearTimeout(timeoutId);
    }

    timeouts.current.clear();
  }, []);

  const resetQueue = React.useCallback(() => {
    queue.current = [];
    isQueueRunning.current = false;

    if (targetRef.current) {
      targetRef.current.textContent = '';
      setOriginalText(targetRef.current.textContent);
    }
  }, [targetRef]);

  const enqueue = React.useCallback((task: () => Promise<void>) => {
    queue.current.push(task);
  }, []);

  const processQueue = React.useCallback(async () => {
    if (isQueueRunning.current) return;
    isQueueRunning.current = true;
    lastQueue.current = [...queue.current];

    while (queue.current.length > 0) {
      const task = queue.current.shift();
      if (task) await task();

      if (queue.current.length === 0) {
        onComplete?.();

        if (loop) {
          if (targetRef.current) {
            targetRef.current.textContent = '';
            setOriginalText(targetRef.current.textContent);
          }

          queue.current.push(...lastQueue.current);
        }
      }
    }

    isQueueRunning.current = false;
  }, [loop, onComplete, targetRef]);

  React.useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    targetRef.current.textContent = '';
    setOriginalText(targetRef.current.textContent);

    processQueue();

    return () => {
      resetQueue();
      clearAllTimeouts();
    };
  }, [targetRef, processQueue, resetQueue, clearAllTimeouts, cursor, cursorChar, cursorSpeed, speed, loop]);

  const typewriterInstance: TypewriterInstance = React.useMemo(
    () => ({
      write(text: string) {
        enqueue(async () => {
          setIsWriting(true);

          for (let i = 0; i < text.length; i++) {
            await new Promise<void>((res) => setSafeTimeout(() => res(), speed));
            if (targetRef.current) {
              targetRef.current.textContent += text[i];
              updateOriginalText(targetRef.current.textContent);
              if (targetRef.current.textContent) {
                onWrite?.(targetRef.current.textContent);
              }
            }
          }

          setIsWriting(false);
        });
        return typewriterInstance;
      },

      delete(count: number) {
        enqueue(async () => {
          for (let i = 0; i < count; i++) {
            await new Promise<void>((res) => setSafeTimeout(() => res(), speed));
            if (targetRef.current) {
              targetRef.current.textContent = targetRef.current.textContent?.slice(0, -1) || '';
              updateOriginalText(targetRef.current.textContent);
              onDelete?.(targetRef.current.textContent);
            }
          }
        });
        return typewriterInstance;
      },

      stop(duration: number) {
        enqueue(() => new Promise((res) => setSafeTimeout(res, duration)));
        return typewriterInstance;
      },

      start() {
        processQueue();
      },

      reset() {
        resetQueue();
      },
    }),
    [enqueue, targetRef, setSafeTimeout, speed, onWrite, updateOriginalText, onDelete, processQueue, resetQueue],
  );

  return typewriterInstance;
}

export type { TypewriterOptions, TypewriterInstance };
export { useTypewriter };
