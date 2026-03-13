import Container from "../../components/Container/Container";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Check from "../../assets/Check";
import AddToBatch from "../../assets/AddToBatch";
import ExportResults from "../../assets/ExportResults";
import CloseIcon from "../../assets/CloseIcon";
import { useHistory } from "../../context/HistoryContext";

import styles from "./ResultsPage.module.css";

const randomStep = (min, max, step) => {
    const range = Math.floor((max - min) / step) + 1;
    return +(min + Math.floor(Math.random() * range) * step).toFixed(2);
};

// Function to get color from gradient
const getGradientColor = (gradient, pos) => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");

    const grd = ctx.createLinearGradient(0, 0, 100, 0);

    gradient.forEach(stop => grd.addColorStop(stop.position, stop.color));

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 1);

    const pixel = ctx.getImageData(Math.round(pos * 100), 0, 1, 1).data;
    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
};

// We parse the gradients S and M into the data[] structure
const gradientS = [
    { position: 0, color: "rgb(235,124,15)" },
    { position: 1, color: "rgb(85,81,65)" }
];

const gradientM = [
    { position: 0, color: "rgb(255,172,69)" },
    { position: 1, color: "rgb(101,112,114)" }
];

const getAcidityLabel = (value) => {
    if (value >= 3.5 && value <= 4.0) {
        return "Strongly Acidic";
    }
    if (value > 4.0 && value <= 5.0) {
        return "Slightly Acidic";
    }
    if (value > 5.0 && value <= 5.9) {
        return "Acidic";
    }
    if (value >= 6.0 && value <= 6.5) {
        return "Neutral";
    }
    if (value > 6.5 && value <= 7.0) {
        return "Slightly Basic";
    }

    if (value < 7) {
        return "Acidic";
    }
    if (value > 7) {
        return "Alkaline";
    }
    return "Neutral";
};

const ResultsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedTests = location.state?.selectedTests || [];
    const [results, setResults] = useState([]);
    const { addResults } = useHistory();
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [batches, setBatches] = useState([]);
    const [newBatchName, setNewBatchName] = useState("");
    const batchModalRef = useRef(null);

    const testsData = {
        S: { name: "Test S", gradient: gradientS },
        M: { name: "Test M", gradient: gradientM },
    };

    useEffect(() => {
        const createdAt = Date.now();
        const nextResults = selectedTests
            .map((id) => {
                const test = testsData[id];
                if (!test) return null;

                const value = randomStep(3.5, 7.0, 0.1);
                const confidence = Math.floor(Math.random() * 31) + 70;
                const relativePos = (value - 3.5) / (7 - 3.5);
                const color = getGradientColor(test.gradient, relativePos);
                const label = getAcidityLabel(value);

                return { id, value, confidence, color, label, createdAt };
            })
            .filter(Boolean);
        setResults(nextResults);
        if (nextResults.length > 0) {
            addResults(nextResults);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTests.join(",")]);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem("phScannerBatches");
            const parsed = raw ? JSON.parse(raw) : [];
            setBatches(Array.isArray(parsed) ? parsed : []);
        } catch {
            setBatches([]);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsBatchModalOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleOpenBatchModal = () => {
        try {
            const raw = window.localStorage.getItem("phScannerBatches");
            const parsed = raw ? JSON.parse(raw) : [];
            setBatches(Array.isArray(parsed) ? parsed : []);
        } catch {
            setBatches([]);
        }
        setIsBatchModalOpen(true);
    };

    const handleAttachToBatch = (batchId) => {
        try {
            const raw = window.localStorage.getItem("phScannerBatches");
            const parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed)) return;

            const updated = parsed.map((batch) => {
                if (batch.id !== batchId) return batch;
                const existing = Array.isArray(batch.results) ? batch.results : [];
                const testsToAdd = results.map((r) => ({
                    id: r.id,
                    value: r.value,
                    color: r.color,
                    createdAt: r.createdAt,
                }));
                return {
                    ...batch,
                    results: [...existing, ...testsToAdd],
                };
            });

            window.localStorage.setItem("phScannerBatches", JSON.stringify(updated));
            setBatches(updated);
            setIsBatchModalOpen(false);
        } catch {
            // ignore storage errors
        }
    };

    const handleCreateBatchAndAttach = () => {
        const name = newBatchName.trim();
        if (!name) return;

        const now = Date.now();
        const newBatch = {
            id: `batch-${now}-${Math.random().toString(36).slice(2)}`,
            name,
            description: "",
            createdAt: now,
            results: results.map((r) => ({
                id: r.id,
                value: r.value,
                color: r.color,
                createdAt: r.createdAt,
            })),
        };

        try {
            const raw = window.localStorage.getItem("phScannerBatches");
            const parsed = raw ? JSON.parse(raw) : [];
            const existing = Array.isArray(parsed) ? parsed : [];
            const updated = [newBatch, ...existing];
            window.localStorage.setItem("phScannerBatches", JSON.stringify(updated));
            setBatches(updated);
            setNewBatchName("");
            setIsBatchModalOpen(false);
        } catch {
            // ignore
        }
    };

    return (
        <main className={styles.content}>
            <Container>
                <h1 className={styles.header}>Results</h1>
                <p className={styles.descr}>
                    {selectedTests.length} test{selectedTests.length > 1 ? "s" : ""} scanned
                </p>

                <div className={styles.wrapInfoBlock}>
                    {results.map(({ id, value, confidence, color }) => {
                        const test = testsData[id];
                        if (!test) return null;

                        const relativePos = (value - 3.5) / (7 - 3.5); // 0→1

                        return (
                            <div
                                key={id}
                                className={`${styles.infoBlock} ${selectedTests.length > 1 ? styles.withDivider : ""}`}
                            >
                                <div className={styles.data}>
                                    <div className={styles.box} style={{ backgroundColor: color }}>
                                        {id}
                                    </div>

                                    <div className={styles.info}>
                                        <div className={styles.infoTitle}>{test.name}</div>

                                        <div className={styles.infoValue}>
                                            <span>{value.toFixed(1)}</span> pH
                                        </div>

                                        <div className={styles.infoText}>
                                            {getAcidityLabel(value)}
                                        </div>

                                        <div className={styles.infoConfidence}>
                                            Confidence: <span>{confidence}</span>%
                                        </div>
                                    </div>
                                </div>

                                <input type="text" className={styles.input} placeholder="Name this reading (optional)" />

                                {/* Indicator */}
                                <div className={styles[`indicator${id}`]}>
                                    <div
                                        className={styles.indicatorCircle}
                                        style={{ left: `${relativePos * 100}%` }}
                                    ></div>
                                </div>

                                <div className={styles.indicatorValue}>
                                    <span>3,5</span>
                                    <span>5,25</span>
                                    <span>7,0</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.wrapBtn}>
                    <button className={styles.btnTransparent} onClick={handleOpenBatchModal}>
                        <AddToBatch /> Add to Batch
                    </button>
                    <button className={styles.btnTransparent}>
                        <ExportResults /> Export Results
                    </button>
                    <div className={styles.blockBtn}>
                        <button className={styles.btnTransparent} onClick={() => navigate("/scan")}>
                            Scan Again
                        </button>
                        <button
                            className={styles.btn}
                            onClick={() => navigate("/history")}
                        >
                            <Check /> View History
                        </button>
                    </div>
                </div>
                {isBatchModalOpen && (
                    <div
                        className={styles.batchModalOverlay}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsBatchModalOpen(false);
                            }
                        }}
                    >
                        <div className={styles.batchModal} ref={batchModalRef}>
                            <div className={styles.batchModalHeader}>
                                <h2 className={styles.batchModalTitle}>Add to Batch</h2>
                                <button
                                    type="button"
                                    className={styles.batchModalClose}
                                    onClick={() => setIsBatchModalOpen(false)}
                                    aria-label="Close"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className={styles.batchModalBody}>
                                {batches.length === 0 ? (
                                    <p className={styles.batchModalEmpty}>
                                        No batches yet. Create one below.
                                    </p>
                                ) : (
                                    <ul className={styles.batchModalList}>
                                        {batches.map((batch) => (
                                            <li key={batch.id}>
                                                <button
                                                    type="button"
                                                    className={styles.batchModalItem}
                                                    onClick={() => handleAttachToBatch(batch.id)}
                                                >
                                                    <span className={styles.batchModalIcon} aria-hidden>
                                                        <AddToBatch />
                                                    </span>
                                                    <span className={styles.batchModalName}>{batch.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className={styles.batchModalFooter}>
                                <input
                                    type="text"
                                    className={styles.batchModalInput}
                                    placeholder="New batch name"
                                    value={newBatchName}
                                    onChange={(e) => setNewBatchName(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={styles.batchModalAddBtn}
                                    onClick={handleCreateBatchAndAttach}
                                    disabled={!newBatchName.trim()}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default ResultsPage;