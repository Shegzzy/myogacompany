import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  YAxis,
  Bar,
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
  const { currentUser } = useContext(AuthContext);
  const [monthlyData, setMonthlyData] = useState([]);


  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const today = new Date();
    const monthData = [];

    if (currentUser) {
      const userRef = doc(db, "Companies", currentUser.uid);
      const docs = await getDoc(userRef);
      for (let i = 0; i < 6; i++) {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999);

        const earningsQuery = query(
          collection(db, "Earnings"),
          where("Company", "==", docs.data().company),
          where("DateCreated", ">=", firstDayOfMonth.toISOString()),
          where("DateCreated", "<=", lastDayOfMonth.toISOString())
        );

        try {
          const querySnapshot = await getDocs(earningsQuery);
          let total = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          monthData.push({
            name: getPreviousMonth(i),
            Total: total,
            EightyFivePercent: ((total * 0.85).toFixed(0)),
          });
        } catch (error) {
          console.error("Error fetching earnings data:", error);
          // Handle error
        }
      }
    }
    setMonthlyData(monthData.reverse());
  };

  const getPreviousMonth = (monthsAgo = 1) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const eightyFivePercentValue = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Math.round(payload[0].value * 0.85));
      const formattedValue = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format((payload[0].value));


      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Total: ${formattedValue}`}</p>
          <p className="intro">{`Profit: ${eightyFivePercentValue}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="chart">
      <div className="c-top">
        <div className="title">{title}</div>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart width={800} height={800} data={monthlyData}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            padding: "10px",
            fontSize: "14px",
          }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="Total" fill="#8884d8" barSize={25} label={{ position: "top", fill: "black" }} />
          <Bar dataKey="EightyFivePercent" fill="#82ca9d" barSize={25} label={{ position: "center", fill: "black" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default Chart;
