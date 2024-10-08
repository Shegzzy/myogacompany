import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import VerificationPage from "../awaiting-verification/awaiting_verification";
// import Table from "../../components/table/Table";

const Home = ({verificationStatus}) => {
  console.log(verificationStatus);
  return (
    <div className="home">
      <Sidebar verificationStatus={verificationStatus}/>
      <div className="homeContainer">
      {verificationStatus === "verified" ? (
        <>
          <Navbar />
          <div className="widgets">
            <Widget type="user" />
            <Widget type="order" />
            <Widget type="earning" />
            <Widget type="balance" />
          </div>
          <div className="charts">
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          {/* <div className="listContainer">
            <div className="listTitle">Latest Transactions</div>
            <Table />
          </div> */}
        </>
        ) : <VerificationPage />}
      </div>
    </div>
  );
};

export default Home;
