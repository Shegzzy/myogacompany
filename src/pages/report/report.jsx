import React from "react";
import "./report.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReportChart from "../../components/report-charts/report_chart";

const Report = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="reportTitle">Reports</div>
        <div className="charts"> 
            <ReportChart title="Riders Chart" aspect={4 / 3} />
            <ReportChart title="Riders Chart" aspect={4 / 3}/>
            <ReportChart title="Riders Chart" aspect={4 / 3}/>
            <ReportChart title="Riders Chart" aspect={4 / 3}/>
        </div>
      </div>
    </div>
  );
};

export default Report;
