import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./HomePage/HomePage";
import ScanPage from "./ScanPage/ScanPage";
import CameraPreviewPlaceholder from "./CameraPreviewPlaceholder/CameraPreviewPlaceholder";
import ResultsPage from "./ResultsPage/ResultsPage";
import HistoryPage from "./HistoryPage/HistoryPage";
import BatchesPage from "./BatchesPage/BatchesPage";

import styles from "./Navigation.module.css";

const RouteRenderer = ({ pathname }) => {
  const location = useLocation();
  const syntheticLocation = { ...location, pathname };

  return (
    <Routes location={syntheticLocation}>
      <Route path="/" element={<HomePage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/camera" element={<CameraPreviewPlaceholder />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/batches" element={<BatchesPage />} />
    </Routes>
  );
};

const Navigation = () => {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <div key={location.pathname} className={styles.pageEnter}>
        <RouteRenderer pathname={location.pathname} />
      </div>
    </div>
  );
};

export default Navigation;
