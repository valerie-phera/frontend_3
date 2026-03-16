import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./HomePage/HomePage";
import ScanPage from "./ScanPage/ScanPage";
import CameraPreviewPlaceholder from "./CameraPreviewPlaceholder/CameraPreviewPlaceholder";
import ResultsPage from "./ResultsPage/ResultsPage";
import HistoryPage from "./HistoryPage/HistoryPage";
import BatchesPage from "./BatchesPage/BatchesPage";

import styles from "./Navigation.module.css";

const pageVariants = {
  enter: {
    opacity: 0,
    y: 10,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
};

const RouteRenderer = ({ pathname }) => {
  const location = useLocation();
  const syntheticLocation = { ...location, pathname };

  return (
    <div className={styles.routeWrapper}>
      <Routes location={syntheticLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/camera" element={<CameraPreviewPlaceholder />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/batches" element={<BatchesPage />} />
      </Routes>
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className={styles.page}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            enter: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] },
            exit: { duration: 0.22, ease: [0.4, 0, 1, 1] },
          }}
        >
          <RouteRenderer pathname={location.pathname} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Navigation;
