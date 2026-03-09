import { Routes, Route } from "react-router-dom";

import HomePage from "./HomePage/HomePage";
import ScanPage from "./ScanPage/ScanPage";
import CameraPreviewPlaceholder from "./CameraPreviewPlaceholder/CameraPreviewPlaceholder";
import ResultsPage from "./ResultsPage/ResultsPage";
import HistoryPage from "./HistoryPage/HistoryPage";
import BatchesPage from "./BatchesPage/BatchesPage";

const Navigation = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/camera" element={<CameraPreviewPlaceholder />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/batches" element={<BatchesPage />} />
        </Routes>
    )
}

export default Navigation;