/**
 * CSV Export Utilities
 *
 * Utilities for generating CSV files with proper escaping and formatting
 */

/**
 * Escape CSV value
 */
function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate CSV string from headers and rows
 */
export function generateCSV(
  headers: string[],
  rows: (string | null | undefined)[][]
): string {
  const headerRow = headers.map(escapeCSV).join(",");
  const dataRows = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  return `${headerRow}\n${dataRows}`;
}

/**
 * Add BOM for Excel UTF-8 compatibility
 */
export function addBOM(csv: string): string {
  return "\uFEFF" + csv;
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: string = "csv"): string {
  const date = new Date().toISOString().split("T")[0];
  return `${prefix}_${date}.${extension}`;
}
