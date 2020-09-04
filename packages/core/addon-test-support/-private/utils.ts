export function wrapWithNodeStyle(callback: (...args: unknown[]) => unknown) {
  return async function nodeStyleWrapper(...args: unknown[]) {
    const next = args.pop() as (err: Error | null, result?: unknown) => void;

    try {
      const result = await callback(...args);
      next(null, result);
    } catch (err) {
      next(err);
    }
  }
}
