import Container from "../../components/Container/Container";

import styles from "./HistoryPage.module.css";

const HistoryPage = () => {

    return (
        <>
            <main className={styles.content}>
                <Container>
                    <h1 className={styles.header}>History</h1>
                    <p className={styles.descr}>0 scans recorded</p>
                    <div className={styles.wrapBox}>
                        <p className={styles.report}>No scans yet. Start scanning!</p>
                    </div>
                </Container>
            </main>
        </>
    )
};

export default HistoryPage

