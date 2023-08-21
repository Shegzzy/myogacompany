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
        <div className="reportTitle">Reports</div>
        <div className="charts">
          <div className="row">
            <div className="col-6">
              <ReportChart title="Registered Riders" aspect={3 / 1} />
              <CompletedBookingsChart
                title="Completed Bookings Chart"
                aspect={3 / 1}
              />
            </div>
            <div className="col-6">
              <Chart title="Total Earnings Chart" aspect={3 / 1} />
              <EarningProfits title="Monthly Earnings and Profits" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
