import React from "react";
import "./report_chart.scss";
import {
  BarChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

const CompletedBookingsChart = ({ aspect, title }) => {
  const [totalBookings, setTotalBookings] = useState([]);
  const [currentMonth, setCurrentMont] = useState([]);
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

    // Calculate the first day of current month
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Calculate the last day of current month
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

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

      const driversQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", docs.data().company)
      );
      const driversSnapshot = await getDocs(driversQuery);

      // Collecting Driver IDs
      const driverIds = driversSnapshot.docs.map((driverDoc) => driverDoc.id);

      //Total Month's Completed Bookings Query
      const totalQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
      );

      //Current Month's Completed Bookings Query
      const currentMonthQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", startOfMonth.toISOString()),
        where("Date Created", "<=", endOfMonth.toISOString())
      );

      //Last Month's Earning Query
      const lastMonthQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", firstDayOfLastMonth.toISOString()),
        where("Date Created", "<=", lastDayOfLastMonth.toISOString())
      );

      //Last Two Month's Earning Query
      const lastTwoMonthsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", firstDayOfLastTwoMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastTwoMonths.toISOString())
      );

      //Last Three Month's Earning Query
      const lastThreeMonthsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", firstDayOfLastThreeMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastThreeMonths.toISOString())
      );

      //Last Five Month's Earning Query
      const lastFourMonthsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", firstDayOfLastFourMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastFourMonths.toISOString())
      );

      //Last Four Month's Earning Query
      const lastFiveMonthsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", firstDayOfLastFiveMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastFiveMonths.toISOString())
      );

      //Last Six Month's Earning Query
      const lastSixMonthsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "in", driverIds),
        where("Status", "==", "completed"),
        where("Date Created", ">=", firstDayOfLastSixMonths.toISOString()),
        where("Date Created", "<=", lastDayOfLastSixMonths.toISOString())
      );

      //Calculating total month bookings
      getDocs(totalQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setTotalBookings(total);
      });

      //Calculating current month bookings
      getDocs(currentMonthQuery).then((querySnapshot) => {
        let total = querySnapshot.size;
        setCurrentMont(total);
      });

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

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2
      },${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width
      }, ${y + height}
  Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  return (
    <div className="report__chart">
      <div className="title">
        <p>{title}</p>
        <p>Current Month's Bookings: {currentMonth}</p>
        <p>Total Number of Bookings: {totalBookings}</p>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar
            dataKey="Total"
            fill="#8884d8"
            shape={<TriangleBar />}
            label={{ position: "top" }}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletedBookingsChart;
