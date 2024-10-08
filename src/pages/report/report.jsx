import React, { useRef } from "react";
import "./report.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReportChart from "../../components/report-charts/report_chart";
import CompletedBookingsChart from "../../components/report-charts/completed_bookings_chart";
import EarningProfits from "../../components/report-charts/monthly_earnings_and_profits";
import Chart from "../../components/chart/Chart";
import { useReactToPrint } from "react-to-print";
import { Button } from "react-bootstrap";

const Report = ({verificationStatus}) => {

  const componentRef = useRef();
  const handlePagePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="list">
      <Sidebar verificationStatus = {verificationStatus}/>
      <div className="listContainer" ref={componentRef}>
        <Navbar />
        <div className="reportTitle">Reports</div>
        <div className="charts">
          <div className="row">
            <div className="col-6">
              <Chart title="Total Earnings Chart" aspect={4 / 2} />
              <br></br>
              <EarningProfits title="Monthly Earnings and Profits" />
              <br></br>
            </div>
            <div className="col-6">
              <CompletedBookingsChart
                title="Completed Bookings Chart"
                aspect={3 / 1}
              />
              <br></br>
              <ReportChart title="Registered Riders" aspect={3 / 1} />
              <br></br>
            </div>

            <Button style={{ width: 100 }} onClick={handlePagePrint}>Print</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
