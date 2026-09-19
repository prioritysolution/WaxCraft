/**
 * Coalesce identical in-flight GET requests (e.g. React Strict Mode remounts).
 * Supports multiple concurrent keys so different GETs on one page stay independent.
 * Brief post-complete TTL reduces duplicate network hits that trigger rate limits.
 */
export function createInFlightRequest<T>(ttlMs = 800) {
  const inFlight = new Map<string, Promise<T>>();

  const run = (key: string, factory: () => Promise<T>): Promise<T> => {
    const existing = inFlight.get(key);
    if (existing) {
      return existing;
    }

    const promise = factory().finally(() => {
      const clearKey = () => {
        if (inFlight.get(key) === promise) {
          inFlight.delete(key);
        }
      };

      if (typeof window === "undefined") {
        clearKey();
        return;
      }

      window.setTimeout(clearKey, ttlMs);
    });

    inFlight.set(key, promise);
    return promise;
  };

  const clear = () => {
    inFlight.clear();
  };

  return { run, clear };
}
