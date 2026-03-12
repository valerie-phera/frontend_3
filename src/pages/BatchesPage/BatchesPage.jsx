import { useState } from "react";
import Container from "../../components/Container/Container";
import Plus from "../../assets/Plus";
import CloseIcon from "../../assets/CloseIcon";

import styles from "./BatchesPage.module.css";

const formatDateOnly = (timestamp) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

const BatchesPage = () => {
    const [selected, setSelected] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [batchName, setBatchName] = useState("");
    const [batchDescription, setBatchDescription] = useState("");
    const [batches, setBatches] = useState([]);

    const handleCreateBatch = () => {
        const name = batchName.trim();
        if (!name) {
            return;
        }
        const now = Date.now();
        const newBatch = {
            id: now,
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
                            <div key={batch.id} className={styles.batchItem}>
                                <div className={styles.batchInfo}>
                                    <div className={styles.batchTitle}>{batch.name}</div>
                                <div className={styles.batchMeta}>{formatDateOnly(batch.createdAt)}</div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
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
// ---------------------------------

