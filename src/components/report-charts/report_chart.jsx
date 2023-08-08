import React from "react";
import "./report_chart.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const ReportChart = ({ aspect, title }) => {
  const [lastMonthData, setLastMonthData] = useState([]);
  const [lastTwoMonthData, setLastTwoMonthData] = useState([]);
  const [lastThreeMonthData, setLastThreeMonthData] = useState([]);
  const [lastFourMonthData, setLastFourMonthData] = useState([]);
  const [lastFiveMonthData, setLastFiveMonthData] = useState([]);
  const [lastSixMonthData, setLastSixMonthData] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const today = new Date();

    // Calculate the first day of last month
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the first day of last month
    const firstDayOfLastTwoMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastTwoMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the first day of last month
    const firstDayOfLastThreeMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastThreeMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the first day of last month
    const firstDayOfLastFourMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 4,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastFourMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the first day of last month
    const firstDayOfLastFiveMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 5,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastFiveMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 4,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the first day of last month
    const firstDayOfLastSixMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastSixMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 5,
      0,
      23,
      59,
      59,
      999
    );

    if (currentUser) {
      //This Month's Earning Query
      const userRef = doc(db, "Companies", currentUser.uid);
      const docs = await getDoc(userRef);

      //Last Month's Earning Query
      const lastMonthQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company),
        where("Date Created", ">=", firstDayOfLastMonth.toISOString()),
        where("Date Created", "<=", lastDayOfLastMonth.toISOString())
      );

      //Last Two Month's Earning Query
      const lastTwoMonthsQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company),
        where("Date Created", ">=", firstDayOfLastTwoMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastTwoMonths.toISOString())
      );

      //Last Three Month's Earning Query
      const lastThreeMonthsQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company),
        where("Date Created", ">=", firstDayOfLastThreeMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastThreeMonths.toISOString())
      );

      //Last Five Month's Earning Query
      const lastFourMonthsQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company),
        where("Date Created", ">=", firstDayOfLastFourMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastFourMonths.toISOString())
      );

      //Last Four Month's Earning Query
      const lastFiveMonthsQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company),
        where("Date Created", ">=", firstDayOfLastFiveMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastFiveMonths.toISOString())
      );

      //Last Six Month's Earning Query
      const lastSixMonthsQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company),
        where("Date Created", ">=", firstDayOfLastSixMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastSixMonths.toISOString())
      );

      //Calculating a month ago amount
      getDocs(lastMonthQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setLastMonthData(total);
      });

      //Calculating two months ago amount
      getDocs(lastTwoMonthsQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setLastTwoMonthData(total);
      });

      //Calculating three months ago amount
      getDocs(lastThreeMonthsQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setLastThreeMonthData(total);
      });

      //Calculating four months ago amount
      getDocs(lastFourMonthsQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setLastFourMonthData(total);
      });

      //Calculating five months ago amount
      getDocs(lastFiveMonthsQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setLastFiveMonthData(total);
      });

      //Calculating six months ago amount
      getDocs(lastSixMonthsQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setLastSixMonthData(total);
      });
    }
  };

  const getPreviousMonth = (monthsAgo = 1) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  const data = [
    { name: getPreviousMonth(6), Total: lastSixMonthData },
    { name: getPreviousMonth(5), Total: lastFiveMonthData },
    { name: getPreviousMonth(4), Total: lastFourMonthData },
    { name: getPreviousMonth(3), Total: lastThreeMonthData },
    { name: getPreviousMonth(2), Total: lastTwoMonthData },
    { name: getPreviousMonth(), Total: lastMonthData },
  ];

  return (
    <div className="report__chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart width={800} height={300} data={data}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="Total" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
