import Container from "../../components/Container/Container";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Check from "../../assets/Check";
import Export from "../../assets/Export";
import AddToBatch from "../../assets/AddToBatch";
import ExportResults from "../../assets/ExportResults";
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
    const [isExportOpen, setIsExportOpen] = useState(false);
    const exportRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (exportRef.current && !exportRef.current.contains(e.target)) {
                setIsExportOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const testsData = {
        S: { name: "Test S", gradient: gradientS },
        M: { name: "Test M", gradient: gradientM },
    };

    useEffect(() => {
        const createdAt = Date.now();
        setResults(
            selectedTests
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
                .filter(Boolean)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTests.join(",")]);

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
                    <button className={styles.btnTransparent}>
                        <AddToBatch /> Add to Batch
                    </button>
                    <div className={styles.exportWrap} ref={exportRef}>
                        <button
                            type="button"
                            className={styles.btnTransparent}
                            onClick={() => setIsExportOpen(prev => !prev)}
                        >
                            <Export /> Export Results
                        </button>

                        {isExportOpen && (
                            <ul className={styles.exportDropdown} role="menu">
                                <li role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={styles.exportOption}
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        Export CSV
                                    </button>
                                </li>
                                <li role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={styles.exportOption}
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        Export JSON
                                    </button>
                                </li>
                                <li role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={styles.exportOption}
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        Export XLSX
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className={styles.blockBtn}>
                        <button className={styles.btnTransparent} onClick={() => navigate("/scan")}>
                            Scan Again
                        </button>
                        <button
                            className={styles.btn}
                            onClick={() => {
                                addResults(results);
                                navigate("/history");
                            }}
                        >
                            <Check /> View History
                        </button>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default ResultsPage;
