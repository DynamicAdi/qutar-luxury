// utils/array.ts
// Reusable array utilities for Next.js / TypeScript projects

/**
 * Remove duplicate primitive values
 */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

/**
 * Remove duplicate objects by key
 */
export const uniqueBy = <T, K extends keyof T>(arr: T[], key: K): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size <= 0) return [];
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
};

/**
 * Flatten nested arrays (1 level)
 */
export const flatten = <T>(arr: T[][]): T[] => arr.flat();

/**
 * Deep flatten nested arrays
 */
export const deepFlatten = (arr: any[]): any[] =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val)
        ? acc.concat(deepFlatten(val))
        : acc.concat(val),
    []
  );

/**
 * Get random item
 */
export const randomItem = <T>(arr: T[]): T | undefined =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Shuffle array
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

/**
 * Sort by object key
 */
export const sortBy = <T, K extends keyof T>(
  arr: T[],
  key: K,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupBy = <T, K extends keyof T>(
  arr: T[],
  key: K
): Record<string, T[]> =>
  arr.reduce((acc, item) => {
    const group = String(item[key]);

    if (!acc[group]) acc[group] = [];
    acc[group].push(item);

    return acc;
  }, {} as Record<string, T[]>);

/**
 * Paginate array
 */
export const paginate = <T>(
  arr: T[],
  page: number = 1,
  limit: number = 10
): T[] => {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

/**
 * Get max by key
 */
export const maxBy = <T, K extends keyof T>(arr: T[], key: K): T | undefined =>
  arr.reduce((max, item) =>
    item[key] > max[key] ? item : max
  );

/**
 * Get min by key
 */
export const minBy = <T, K extends keyof T>(arr: T[], key: K): T | undefined =>
  arr.reduce((min, item) =>
    item[key] < min[key] ? item : min
  );

/**
 * Sum array numbers
 */
export const sum = (arr: number[]): number =>
  arr.reduce((total, num) => total + num, 0);

/**
 * Average array numbers
 */
export const average = (arr: number[]): number =>
  arr.length ? sum(arr) / arr.length : 0;

/**
 * Remove falsy values
 */
export const compact = <T>(arr: T[]): T[] => arr.filter(Boolean);

/**
 * Find last item
 */
export const last = <T>(arr: T[]): T | undefined =>
  arr[arr.length - 1];

/**
 * Insert item at index
 */
export const insertAt = <T>(arr: T[], index: number, item: T): T[] => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];

/**
 * Remove item at index
 */
export const removeAt = <T>(arr: T[], index: number): T[] =>
  arr.filter((_, i) => i !== index);

/**
 * Move item in array
 */
export const move = <T>(
  arr: T[],
  from: number,
  to: number
): T[] => {
  const copy = [...arr];
  const item = copy.splice(from, 1)[0];
  copy.splice(to, 0, item);
  return copy;
};