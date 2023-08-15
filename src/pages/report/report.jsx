import React from "react";
import "./report.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReportChart from "../../components/report-charts/report_chart";
import CompletedBookingsChart from "../../components/report-charts/completed_bookings_chart";
import EarningProfits from "../../components/report-charts/monthly_earnings_and_profits";
import Chart from "../../components/chart/Chart";

const Report = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="reportTitle">Last 6 Months Report</div>
        <div className="charts">
          <ReportChart title="Riders Chart" aspect={4 / 3} />
          <CompletedBookingsChart
            title="Completed Bookings Chart"
            aspect={4 / 3}
          />
          <Chart title="Total Earnings Chart" aspect={2 / 1} />
          <EarningProfits title="Monthly Earnings and Profits" />
        </div>
      </div>
    </div>
  );
};

export default Report;
