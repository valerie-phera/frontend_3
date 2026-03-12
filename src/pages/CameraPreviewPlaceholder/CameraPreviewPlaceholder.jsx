import Container from "../../components/Container/Container";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Photo from "../../assets/Photo";
import Check from "../../assets/Check";
import CloseIcon from "../../assets/CloseIcon";

import styles from "./CameraPreviewPlaceholder.module.css";

const CameraPreviewPlaceholder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedTests = location.state?.selectedTests || [];
    const [isScanning, setIsScanning] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleSimulateScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        timeoutRef.current = window.setTimeout(() => {
            navigate("/results", { state: { selectedTests } });
            setIsScanning(false);
        }, 1000);
    };

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
                    {isScanning && (
                        <div className={styles.scanningWrap}>
                            <div className={styles.spinner} aria-hidden />
                            <div className={styles.scanningText}>Scanning scan...</div>
                        </div>
                    )}
                </div>

                <div className={styles.blockBtn}>
                    <button className={styles.btnTransparent} onClick={() => navigate("/scan")}>
                        <CloseIcon /> Back
                    </button>
                    <button
                        className={styles.btn}
                        onClick={handleSimulateScan}
                        disabled={isScanning}
                    >
                        <Check /> Simulate Scan
                    </button>
                </div>
            </Container>
        </main>
    );
};

export default CameraPreviewPlaceholder;

