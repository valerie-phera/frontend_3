/**
 * Форматирует timestamp (мс) в строку: D.M.YYYY, HH:mm:ss
 * Например: 9.3.2026, 19:18:57
 */
export const formatCreatedAt = (timestamp) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${day}.${month}.${year}, ${h}:${m}:${s}`;
};
