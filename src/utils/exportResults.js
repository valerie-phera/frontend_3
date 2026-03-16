import { formatValue } from "./formatValue";
import { formatCreatedAt } from "./formatDate";

/**
 * Normalizes the result element to a string for export.
 * item: { id, value, label?, confidence?, createdAt, readingName? }
 * testName: optional test name (e.g. "Test S")
 */
export function toExportRow(item, testName = null) {
    const name = testName || item.id || "";
    return {
        Test: name,
        Value: formatValue(item.value),
        "pH Label": item.label ?? "",
        "Confidence %": item.confidence ?? "",
        "Created At": item.createdAt ? formatCreatedAt(item.createdAt) : "",
        "Reading Name": (item.readingName || "").slice(0, 15),
    };
}

/**
 * Downloads a file with the given name and contents.
 */
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Escapes a field for CSV (quote marks if necessary).
 */
function csvEscape(str) {
    const s = String(str ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

/**
 * Export to CSV.
 * rows: array of toExportRow objects (or with the same keys).
 */
export function exportCSV(rows, filename = "export.csv") {
    if (!rows || rows.length === 0) return;
    const headers = ["Test", "Value", "pH Label", "Confidence %", "Created At", "Reading Name"];
    const line = (obj) => headers.map((h) => csvEscape(obj[h])).join(",");
    const csv = [headers.join(","), ...rows.map(line)].join("\r\n");
    const bom = "\uFEFF";
    downloadFile(filename, bom + csv, "text/csv;charset=utf-8");
}

/**
 * Export to JSON.
 */
export function exportJSON(rows, filename = "export.json") {
    if (!rows || rows.length === 0) return;
    const json = JSON.stringify(rows, null, 2);
    downloadFile(filename, json, "application/json");
}

/**
 * Export to Excel (.xlsx) using SheetJS.
 */
export async function exportXLSX(rows, filename = "export.xlsx") {
    if (!rows || rows.length === 0) return;
    const { utils, write } = await import("xlsx");
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Export");
    const data = write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
