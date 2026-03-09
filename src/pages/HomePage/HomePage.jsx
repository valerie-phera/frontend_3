import Container from "../../components/Container/Container";
import { useNavigate } from "react-router-dom";
import Drop from "../../assets/Drop";
import History from "../../assets/History";
import Batches from "../../assets/Batches";
import ScanBtn from "../../assets/ScanBtn";

import styles from "./HomePage.module.css";

const HomePage = () => {
    const navigate = useNavigate();

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
                        <div className={styles.box}>
                            <div className={styles.wrapImg}><History /></div>
                            <div className={styles.num}>0</div>
                            <p className={styles.text}>Total Scans</p>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.wrapImg}><Batches /></div>
                            <div className={styles.num}>0</div>
                            <p className={styles.text}>Batches</p>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    )
};

export default HomePage

