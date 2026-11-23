/**
 * Normalizes any format of technologies into a clean array of strings.
 * Handles arrays, JSON strings, double-encoded JSON, comma-separated strings,
 * and strips any stray quotes or brackets so badges are always clean.
 */
export const normalizeTechList = (raw) => {
  if (!raw) return [];
  let list = [];

  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        list = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        list = trimmed.slice(1, -1).split(',');
      }
    } else {
      list = trimmed.split(',');
    }
  }

  return list
    .map((item) => {
      if (typeof item !== 'string') return String(item || '');
      // Strip outer quotes, brackets, and extra whitespace
      return item.replace(/^[\["'\s]+|[\]"'\s]+$/g, '').trim();
    })
    .filter(Boolean);
};
