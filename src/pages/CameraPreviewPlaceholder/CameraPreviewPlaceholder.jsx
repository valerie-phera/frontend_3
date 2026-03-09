import Container from "../../components/Container/Container";
import { useNavigate, useLocation } from "react-router-dom";
import Photo from "../../assets/Photo";
import Check from "../../assets/Check";
import Close from "../../assets/Close";

import styles from "./CameraPreviewPlaceholder.module.css";

const CameraPreviewPlaceholder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedTests = location.state?.selectedTests || [];

    return (
        <main className={styles.content}>
            <Container>
                <div className={styles.infoBlock}>
                    <div className={styles.icon}>
                        <Photo />
                    </div>
                    <div className={styles.text}>
                        Camera placeholder — will be replaced with CV pipeline
                    </div>
                </div>

                <div className={styles.blockBtn}>
                    <button className={styles.btnTransparent} onClick={() => navigate("/scan")}>
                        <Close /> Back
                    </button>
                    <button
                        className={styles.btn}
                        onClick={() => navigate("/results", { state: { selectedTests } })}
                    >
                        <Check /> Simulate Scan
                    </button>
                </div>
            </Container>
        </main>
    );
};

export default CameraPreviewPlaceholder;

