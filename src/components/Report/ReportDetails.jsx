import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReportModal from "./ReportModal";

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    const found = storedReports.find((r) => r.id === id);
    if (found) {
      setReport(found);
    } else {
      navigate("/my-reports");
    }
  }, [id, navigate]);

  const handleClose = () => {
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate("/my-reports");
    }
  };

  if (!report) return null;

  return <ReportModal report={report} onClose={handleClose} />;
}

export default ReportDetails;
