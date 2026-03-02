import { useState } from "react";
import Container from "../../components/Container/Container";
import ScanBtn from "../../assets/ScanBtn";

import styles from "./ScanPage.module.css";

const testsData = [
    { id: "S", name: "Test S", range: "pH range 3,5-7,0" },
    { id: "M", name: "Test M", range: "pH range 3,5-7,0" },
];

const ScanPage = () => {
    const [selectedTests, setSelectedTests] = useState(["S"]);

    const toggleTest = (id) => {
        if (selectedTests.includes(id)) {
            if (selectedTests.length === 1) return; 
            setSelectedTests(selectedTests.filter((t) => t !== id));
        } else {
            setSelectedTests([...selectedTests, id]);
        }
    };

    return (
        <main className={styles.content}>
            <Container>
                <h1 className={styles.header}>New Scan</h1>
                <p className={styles.descr}>Select which tests you want to scan</p>
                <div className={styles.wrapBox}>
                    {testsData.map((test) => {
                        const isSelected = selectedTests.includes(test.id);
                        return (
                            <div
                                key={test.id}
                                className={styles.box}
                                onClick={() => toggleTest(test.id)}
                            >
                                <div className={styles.block}>
                                    <span>{test.id}</span>
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.infoHeader}>{test.name}</div>
                                    <div className={styles.infoText}>{test.range}</div>
                                </div>
                                <div
                                    className={isSelected ? styles.opted : styles.unopted}
                                ></div>
                            </div>
                        );
                    })}
                </div>

                <p className={styles.text}>
                    {selectedTests.length} test{selectedTests.length > 1 ? "s" : ""} selected
                </p>

                <button className={styles.btn}>
                    <ScanBtn className={styles.btnIcon} />
                    <span>Start Scanning</span>
                </button>
            </Container>
        </main>
    );
};

export default ScanPage;

