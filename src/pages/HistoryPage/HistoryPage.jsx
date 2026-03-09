import { useMemo, useState } from "react";
import Container from "../../components/Container/Container";
import { useHistory } from "../../context/HistoryContext";
import { formatCreatedAt } from "../../utils/formatDate";
import DeleteIcon from "../../assets/DeleteIcon";

import styles from "./HistoryPage.module.css";

const testsData = {
    S: { name: "Test S" },
    M: { name: "Test M" },
};

const isDarkBackground = (colorStr) => {
    const m = colorStr?.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (!m) return false;
    const r = Number(m[1]) / 255;
    const g = Number(m[2]) / 255;
    const b = Number(m[3]) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 0.5;
};

const HistoryPage = () => {
    const { items, removeItem } = useHistory();
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered = useMemo(() => {
        if (activeFilter === "all") return items;
        return items.filter((item) => item.id === activeFilter);
    }, [items, activeFilter]);

    return (
        <main className={styles.content}>
            <Container>
                <h1 className={styles.header}>History</h1>
                <p className={styles.descr}>
                    {items.length} scan{items.length === 1 ? "" : "s"} recorded
                </p>

                <div className={styles.filterBar}>
                    <button
                        type="button"
                        className={`${styles.filterBtn} ${activeFilter === "all" ? styles.filterBtnActive : ""}`}
                        onClick={() => setActiveFilter("all")}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`${styles.filterBtn} ${activeFilter === "S" ? styles.filterBtnActive : ""}`}
                        onClick={() => setActiveFilter("S")}
                    >
                        <span>S</span> Test S
                    </button>
                    <button
                        type="button"
                        className={`${styles.filterBtn} ${activeFilter === "M" ? styles.filterBtnActive : ""}`}
                        onClick={() => setActiveFilter("M")}
                    >
                        <span>M</span> Test M
                    </button>
                </div>

                {filtered.length === 0 ? (
                    <div className={styles.wrapBox}>
                        <p className={styles.report}>No scans yet. Start scanning!</p>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {filtered.map((item) => {
                            const test = testsData[item.id] || { name: item.id };

                            return (
                                <div
                                    key={item.itemId}
                                    className={`${styles.item} ${isDarkBackground(item.color) ? styles.itemDark : ""}`}
                                    style={{ backgroundColor: item.color }}
                                >
                                    <div className={styles.check}></div>
                                    <div className={styles.itemTest}>{item.id}</div>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemValue}>
                                            <span>{item.value.toFixed(1)} </span> {test.name}
                                        </div>
                                        <div className={styles.itemTime}>{formatCreatedAt(item.createdAt)}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.deleteIcon}
                                        onClick={() => removeItem(item.itemId)}
                                        aria-label="Delete"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Container>
        </main>
    );
};

export default HistoryPage;

