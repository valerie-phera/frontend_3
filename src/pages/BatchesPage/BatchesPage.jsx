import Container from "../../components/Container/Container";
import Plus from "../../assets/Plus";

import styles from "./BatchesPage.module.css";

const BatchesPage = () => {

    return (
        <>
            <main className={styles.content}>
                <Container>
                    <div className={styles.wrapTitle}>
                        <div className={styles.wrapHeader}>
                            <h1 className={styles.header}>Batches</h1>
                            <p className={styles.descr}>Group your scans together</p>
                        </div>
                        <button className={styles.btn}><Plus className={styles.btnIcon} /><span>New</span></button>
                    </div>
                    <div className={styles.wrapBox}>
                        <div className={styles.opted}>All</div>
                        <div className={styles.unopted}><span>S</span>Test S</div>
                        <div className={styles.unopted}><span>M</span>Test M</div>
                    </div>
                    <p className={styles.report}>No batches yet. Create one to group your scans.</p>
                </Container>
            </main>
        </>
    )
};

export default BatchesPage

