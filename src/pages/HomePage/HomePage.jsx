import { useState, useEffect } from "react";
import Container from "../../components/Container/Container";
import { useNavigate } from "react-router-dom";
import { useHistory } from "../../context/HistoryContext";
import { formatCreatedAt } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";
import Drop from "../../assets/Drop";
import History from "../../assets/History";
import Batches from "../../assets/Batches";
import ScanBtn from "../../assets/ScanBtn";

import styles from "./HomePage.module.css";

const getBatchesCount = () => {
    try {
        const raw = window.localStorage.getItem("phScannerBatches");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
        return 0;
    }
};

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

const HomePage = () => {
    const navigate = useNavigate();
    const { items } = useHistory();
    const [batchesCount, setBatchesCount] = useState(getBatchesCount);
    const lastThree = items.slice(0, 3);

    useEffect(() => {
        setBatchesCount(getBatchesCount());
    }, []);

    return (
        <>
            <main className={styles.content}>
                <Container>
                    <h1 className={styles.header}>
                        <Drop className={styles.dropImg} />
                        pH Test Scanner
                    </h1>
                    <p className={styles.descr}>Scan, track, and organize your pH results</p>
                    <button className={styles.btn} onClick={() => { navigate("/scan") }}><ScanBtn className={styles.btnIcon} /><span>Start Scanning</span></button>
                    <div className={styles.wrapBox}>
                        <div className={styles.box} onClick={() => { navigate("/history") }}>
                            <div className={styles.wrapImg}><History /></div>
                            <div className={styles.num}>{items.length}</div>
                            <p className={styles.text}>Total Scans</p>
                        </div>
                        <div className={styles.box} onClick={() => { navigate("/batches") }}>
                            <div className={styles.wrapImg}><Batches /></div>
                            <div className={styles.num}>{batchesCount}</div>
                            <p className={styles.text}>Batches</p>
                        </div>
                    </div>
                    {lastThree.length > 0 && (
                        <>
                            <div className={styles.itemsTitle}>
                                <div className={styles.itemsTitleName}>Recent Scans</div>
                                <div className={styles.itemsTitlebtn} onClick={() => { navigate("/history") }}>View All</div>
                            </div>
                            <div className={styles.recentList}>
                                {lastThree.map((item) => {
                                    const test = testsData[item.id] || { name: item.id };
                                    return (
                                        <div
                                            key={item.itemId}
                                            className={`${styles.item} ${isDarkBackground(item.color) ? styles.itemDark : ""}`}
                                            style={{ backgroundColor: item.color }}
                                        >
                                            <div className={styles.itemTest}>{item.id}</div>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemValue}>
                                                    <span>{formatValue(item.value)} </span> pH
                                                </div>
                                                <div className={styles.itemTime}>{test.name} {formatCreatedAt(item.createdAt)}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>

                    )}
                </Container>
            </main>
        </>
    )
};

export default HomePage

