// utils/strings.ts
// Reusable string utilities for Next.js / TypeScript projects

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

/**
 * Convert text to Title Case
 */
export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });

/**
 * Convert string to slug
 * Example: Hello World => hello-world
 */
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/**
 * Convert slug to readable text
 * Example: hello-world => Hello World
 */
export const unslugify = (str: string): string =>
  toTitleCase(str.replace(/-/g, " "));

/**
 * Truncate text
 */
export const truncate = (
  str: string,
  length: number = 100,
  suffix: string = "..."
): string => (str.length > length ? str.slice(0, length) + suffix : str);

/**
 * Generate initials from name
 * Example: John Doe => JD
 */
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

/**
 * Remove extra spaces
 */
export const cleanSpaces = (str: string): string =>
  str.replace(/\s+/g, " ").trim();

/**
 * Check palindrome
 */
export const isPalindrome = (str: string): boolean => {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
};

/**
 * Mask email
 * Example: johndoe@gmail.com => jo****@gmail.com
 */
export const maskEmail = (email: string): string => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}****@${domain}`;
};

/**
 * Mask phone
 * Example: 9876543210 => ******3210
 */
export const maskPhone = (phone: string): string =>
  phone.replace(/\d(?=\d{4})/g, "*");

/**
 * Random string generator
 */
export const randomString = (length: number = 8): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

/**
 * Convert bytes to readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Safe string compare
 */
export const equalsIgnoreCase = (a: string, b: string): boolean =>
  a.toLowerCase() === b.toLowerCase();

/**
 * Convert camelCase to normal text
 * Example: firstName => First Name
 */
export const camelToText = (str: string): string =>
  capitalize(str.replace(/([A-Z])/g, " $1").trim());

/**
 * Convert snake_case to normal text
 */
export const snakeToText = (str: string): string =>
  toTitleCase(str.replace(/_/g, " "));

/**
 * Convert string to camelCase
 */
export const toCamelCase = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));

/**
 * Remove special characters
 */
export const removeSpecialChars = (str: string): string =>
  str.replace(/[^a-zA-Z0-9 ]/g, "");

/**
 * Count words
 */
export const wordCount = (str: string): number =>
  cleanSpaces(str).split(" ").filter(Boolean).length;