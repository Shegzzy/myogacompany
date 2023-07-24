import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
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

const Chart = ({ aspect, title }) => {
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
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastMonth.toISOString()),
        where("DateCreated", "<=", lastDayOfLastMonth.toISOString())
      );

      //Last Two Month's Earning Query
      const lastTwoMonthsQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastTwoMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastTwoMonths.toISOString())
      );

      //Last Three Month's Earning Query
      const lastThreeMonthsQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastThreeMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastThreeMonths.toISOString())
      );

      //Last Five Month's Earning Query
      const lastFourMonthsQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastFourMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastFourMonths.toISOString())
      );

      //Last Four Month's Earning Query
      const lastFiveMonthsQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastFiveMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastFiveMonths.toISOString())
      );

      //Last Six Month's Earning Query
      const lastSixMonthsQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastSixMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastSixMonths.toISOString())
      );

      //Calculating a month ago amount
      getDocs(lastMonthQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setLastMonthData(total);
      });

      //Calculating two months ago amount
      getDocs(lastTwoMonthsQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setLastTwoMonthData(total);
      });

      //Calculating three months ago amount
      getDocs(lastThreeMonthsQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setLastThreeMonthData(total);
      });

      //Calculating four months ago amount
      getDocs(lastFourMonthsQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setLastFourMonthData(total);
      });

      //Calculating five months ago amount
      getDocs(lastFiveMonthsQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setLastFiveMonthData(total);
      });

      //Calculating six months ago amount
      getDocs(lastSixMonthsQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
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
    { name: "Start", Total: 0 },
    { name: getPreviousMonth(6), Total: lastSixMonthData },
    { name: getPreviousMonth(5), Total: lastFiveMonthData },
    { name: getPreviousMonth(4), Total: lastFourMonthData },
    { name: getPreviousMonth(3), Total: lastThreeMonthData },
    { name: getPreviousMonth(2), Total: lastTwoMonthData },
    { name: getPreviousMonth(), Total: lastMonthData },
  ];
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              })
                .format(value)
                .replace(".00", "")
            }
            labelStyle={{ color: "black" }}
          />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
            baseValue={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
