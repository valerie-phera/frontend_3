import Container from "../../components/Container/Container";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Check from "../../assets/Check";
import AddToBatch from "../../assets/AddToBatch";
import ExportResults from "../../assets/ExportResults";

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

const ResultsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedTests = location.state?.selectedTests || [];
    const [results, setResults] = useState([]);

    const testsData = {
        S: { name: "Test S", gradient: gradientS },
        M: { name: "Test M", gradient: gradientM },
    };

    useEffect(() => {
        setResults(
            selectedTests
                .map((id) => {
                    const test = testsData[id];
                    if (!test) return null;

                    const value = randomStep(3.5, 7.0, 0.1);
                    const confidence = Math.floor(Math.random() * 31) + 70;

                    return { id, value, confidence };
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
                    {results.map(({ id, value, confidence }) => {
                        const test = testsData[id];
                        if (!test) return null;

                        const relativePos = (value - 3.5) / (7 - 3.5); // 0→1
                        const color = getGradientColor(test.gradient, relativePos);

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
                                            {value < 7 ? "Acidic" : value > 7 ? "Alkaline" : "Neutral"}
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
                    <button className={styles.btnTransparent}>
                        <ExportResults /> Export Results
                    </button>
                    <div className={styles.blockBtn}>
                        <button className={styles.btnTransparent} onClick={() => navigate("/scan")}>
                            Scan Again
                        </button>
                        <button className={styles.btn} onClick={() => navigate("/history")}>
                            <Check /> View History
                        </button>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default ResultsPage;
