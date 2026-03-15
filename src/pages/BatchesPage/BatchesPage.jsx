import { useState, useEffect, useRef } from "react";
import Container from "../../components/Container/Container";
import Plus from "../../assets/Plus";
import CloseIcon from "../../assets/CloseIcon";
import Export from "../../assets/Export";
import DeleteIcon from "../../assets/DeleteIcon";

import { formatValue } from "../../utils/formatValue";
import styles from "./BatchesPage.module.css";

const formatDateOnly = (timestamp) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
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

const BatchesPage = () => {
    const [selected, setSelected] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [batchName, setBatchName] = useState("");
    const [batchDescription, setBatchDescription] = useState("");
    const [batches, setBatches] = useState(() => {
        try {
            const raw = window.localStorage.getItem("phScannerBatches");
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });
    const nameInputRef = useRef(null);
    const [openBatchId, setOpenBatchId] = useState(null);

    useEffect(() => {
        if (isModalOpen && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isModalOpen]);

    useEffect(() => {
        try {
            window.localStorage.setItem("phScannerBatches", JSON.stringify(batches));
        } catch {
            // ignore
        }
    }, [batches]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsModalOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleCreateBatch = () => {
        const name = batchName.trim();
        if (!name) {
            return;
        }
        const now = Date.now();
        const newBatch = {
            id: `batch-${now}-${Math.random().toString(36).slice(2)}`,
            name,
            description: batchDescription.trim(),
            createdAt: now,
        };
        setBatches((prev) => [newBatch, ...prev]);
        setBatchName("");
        setBatchDescription("");
        setIsModalOpen(false);
    };

    return (
        <main className={styles.content}>
            <Container>
                <div className={styles.wrapTitle}>
                    <div className={styles.wrapHeader}>
                        <h1 className={styles.header}>Batches</h1>
                        <p className={styles.descr}>Group your scans together</p>
                    </div>
                    <button className={styles.btn} onClick={() => setIsModalOpen(true)}>
                        <Plus className={styles.btnIcon} />
                        <span>New</span>
                    </button>
                </div>

                <div className={styles.wrapBox}>
                    <div
                        className={selected === "All" ? styles.opted : styles.unopted}
                        onClick={() => setSelected("All")}
                    >
                        All
                    </div>

                    <div
                        className={selected === "Test S" ? styles.opted : styles.unopted}
                        onClick={() => setSelected("Test S")}
                    >
                        <span className={styles.firstLetter}>S</span>
                        <span className={styles.restText}>Test S</span>
                    </div>

                    <div
                        className={selected === "Test M" ? styles.opted : styles.unopted}
                        onClick={() => setSelected("Test M")}
                    >
                        <span className={styles.firstLetter}>M</span>
                        <span className={styles.restText}>Test M</span>
                    </div>
                </div>

                {batches.length === 0 ? (
                    <p className={styles.report}>No batches yet. Create one to group your scans.</p>
                ) : (
                    <div className={styles.batchList}>
                        {batches.map((batch) => (
                            <div key={batch.id}>
                                <div
                                    className={`${styles.batchItem} ${openBatchId === batch.id ? styles.batchItemExpanded : ""}`}
                                    onClick={() =>
                                        setOpenBatchId((prev) => (prev === batch.id ? null : batch.id))
                                    }
                                >
                                    <div
                                        className={`${styles.batchChevron} ${openBatchId === batch.id ? styles.batchChevronOpen : ""}`}
                                        aria-hidden
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </div>
                                    <div className={styles.batchInfo}>
                                        <div className={styles.batchTitle}>{batch.name}</div>
                                        <div className={styles.batchMeta}>
                                            {(() => {
                                                const results = batch.results || [];
                                                const count = selected === "All"
                                                    ? results.length
                                                    : selected === "Test S"
                                                        ? results.filter((r) => r.id === "S").length
                                                        : results.filter((r) => r.id === "M").length;
                                                return `${count} results · ${formatDateOnly(batch.createdAt)}`;
                                            })()}
                                        </div>
                                    </div>
                                    <div className={styles.batchActions}>
                                        <div className={styles.exportAction}>
                                            <Export />
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.deleteAction}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBatches((prev) => prev.filter((b) => b.id !== batch.id));
                                            }}
                                            aria-label="Delete batch"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                                <div
                                        className={`${styles.batchExpand} ${openBatchId === batch.id ? styles.batchExpandOpen : ""}`}
                                    >
                                        <div className={styles.batchExpandInner}>
                                            {batch.description != null && batch.description !== "" && (
                                                <div className={styles.batchDescription}>
                                                    {batch.description}
                                                </div>
                                            )}
                                            {(() => {
                                                const results = batch.results || [];
                                                const filtered = results
                                                    .map((r, originalIndex) => ({ r, originalIndex }))
                                                    .filter(({ r }) =>
                                                        selected === "All" ||
                                                        (selected === "Test S" && r.id === "S") ||
                                                        (selected === "Test M" && r.id === "M")
                                                    );
                                                return filtered.length > 0 ? (
                                                    <div className={styles.batchTests}>
                                                        {filtered.map(({ r, originalIndex }) => (
                                                            <div
                                                                key={`${batch.id}-${originalIndex}`}
                                                                className={`${styles.batchTestChip} ${isDarkBackground(r.color) ? styles.batchTestChipDark : ""}`}
                                                                style={{
                                                                    backgroundColor: r.color,
                                                                    ['--chip-color']: r.color,
                                                                }}
                                                            >
                                                                <div className={styles.itemTest}>{r.id}</div>
                                                                <div className={styles.itemValue}>
                                                                    {formatValue(r.value)}
                                                                    <span className={styles.batchTestId}>
                                                                        {r.id === "S" || r.id === "M"
                                                                            ? `Test ${r.id}`
                                                                            : r.id}
                                                                        {r.readingName ? ` · ${r.readingName.slice(0, 15)}` : ""}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className={styles.batchTestDelete}
                                                                    onClick={() => {
                                                                        const updated = batches.map((b) => {
                                                                            if (b.id !== batch.id) return b;
                                                                            const nextResults = (b.results || []).filter(
                                                                                (_, i) => i !== originalIndex
                                                                            );
                                                                            return { ...b, results: nextResults };
                                                                        });
                                                                        setBatches(updated);
                                                                    }}
                                                                    aria-label="Delete test"
                                                                >
                                                                    <DeleteIcon />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className={styles.batchEmpty}>No results in this batch.</p>
                                                );
                                            })()}
                                        </div>
                                        </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div
                        className={styles.modalOverlay}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsModalOpen(false);
                            }
                        }}
                    >
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Create Batch</h2>
                                <button
                                    type="button"
                                    className={styles.modalClose}
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="Close"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <input
                                    type="text"
                                    className={styles.modalInput}
                                    placeholder="Batch name "
                                    ref={nameInputRef}
                                    value={batchName}
                                    onChange={(e) => setBatchName(e.target.value)}
                                />
                                <textarea
                                    className={styles.modalTextarea}
                                    placeholder="Description (optional)"
                                    rows={3}
                                    value={batchDescription}
                                    onChange={(e) => setBatchDescription(e.target.value)}
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    type="button"
                                    className={styles.modalBtnCancel}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={styles.modalBtnCreate}
                                    onClick={handleCreateBatch}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default BatchesPage;
