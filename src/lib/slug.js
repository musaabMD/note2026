/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, ""); // Trim hyphens from end
}

/**
 * Get exam slug from exam - prefers abbreviation over full name
 * @param {string} examName - The exam name
 * @param {string} [abbreviation] - The exam abbreviation (optional)
 * @returns {string} - URL-friendly slug (abbreviation if available, otherwise slugified name)
 */
export function getExamSlug(examName, abbreviation) {
  // Prefer abbreviation if available (already short and URL-friendly)
  if (abbreviation && abbreviation.trim()) {
    return abbreviation.toLowerCase().trim();
  }
  return slugify(examName);
}

/**
 * Get subject slug from subject name
 */
export function getSubjectSlug(subjectName) {
  return slugify(subjectName);
}
