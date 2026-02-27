const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 100;
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

// In-memory store: { count, resetTime }
const store = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetTime <= now) store.delete(key);
  }
}, CLEANUP_INTERVAL_MS);

const rateLimit =
  (options = {}) =>
  (req, res, next) => {
    const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
    const max = options.max || DEFAULT_MAX_REQUESTS;
    const message = options.message || 'Too many requests, please try again later.';
    const keyGenerator =
      options.keyGenerator ||
      ((request) => {
        return `${request.ip}:${request.baseUrl}${request.path}`;
      });

    const now = Date.now();
    const key = keyGenerator(req);
    let entry = store.get(key);

    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      entry.count += 1;
    }

    store.set(key, entry);

    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.set('X-RateLimit-Reset', String(Math.floor(entry.resetTime / 1000)));

    if (entry.count > max) {
      return res.status(429).json({
        message,
      });
    }

    return next();
  };

module.exports = rateLimit;

