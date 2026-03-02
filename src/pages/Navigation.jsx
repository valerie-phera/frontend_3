import { Routes, Route } from "react-router-dom";

import HomePage from "./HomePage/HomePage";
import ScanPage from "./ScanPage/ScanPage";
import HistoryPage from "./HistoryPage/HistoryPage";
import BatchesPage from "./BatchesPage/BatchesPage";

const Navigation = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/batches" element={<BatchesPage />} />
        </Routes>
    )
}

export default Navigation;