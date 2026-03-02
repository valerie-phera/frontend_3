import { useState } from "react";
import Container from "../../components/Container/Container";
import Plus from "../../assets/Plus";

import styles from "./BatchesPage.module.css";

const BatchesPage = () => {
    const [selected, setSelected] = useState("All");

    return (
        <main className={styles.content}>
            <Container>
                <div className={styles.wrapTitle}>
                    <div className={styles.wrapHeader}>
                        <h1 className={styles.header}>Batches</h1>
                        <p className={styles.descr}>Group your scans together</p>
                    </div>
                    <button className={styles.btn}>
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

                <p className={styles.report}>No batches yet. Create one to group your scans.</p>
            </Container>
        </main>
    );
};

export default BatchesPage;


