import "../featured/featured.scss";
import "react-circular-progressbar/dist/styles.css";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/authContext";

const EarningProfits = () => {
  const [Selected, setSelected] = useState("Total");
  const [data, setData] = useState([]);
  const [fieldSum, setFieldSum] = useState(0);
  const [profitSum, setProfitSum] = useState(0);
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

      for (let i = 0; i < 7; i++) {
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
            EightyFivePercent: total * 0.85
          });
        } catch (error) {
          console.error("Error fetching earnings data:", error);
          // Handle error
        }
      }
    }
    setMonthlyData(monthData);
  };

  useEffect(() => {

    const FetchData = async () => {
      let list = [];
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        //Calculate for current month earnings and profits
        if (Selected === getPreviousMonth(0)) {
          const today = new Date();
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          );

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", startOfMonth.toISOString()),
            where("DateCreated", "<=", endOfMonth.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);


          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }

        //Calculate for last month earnings
        else if (Selected === getPreviousMonth()) {
          // Calculate today
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

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", firstDayOfLastMonth.toISOString()),
            where("DateCreated", "<=", lastDayOfLastMonth.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });
          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);


          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }

        //Calculate for two month ago earnings
        else if (Selected === getPreviousMonth(2)) {
          // Calculate today
          const today = new Date();

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

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", firstDayOfLastTwoMonths.toISOString()),
            where("DateCreated", "<=", lastDayOfLastTwoMonths.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });
          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);


          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }

        //Calculate for three month ago earnings
        else if (Selected === getPreviousMonth(3)) {
          // Calculate today
          const today = new Date();

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

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", firstDayOfLastThreeMonths.toISOString()),
            where("DateCreated", "<=", lastDayOfLastThreeMonths.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });
          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);


          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }

        //Calculate for four month ago earnings
        else if (Selected === getPreviousMonth(4)) {
          // Calculate today
          const today = new Date();

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

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", firstDayOfLastFourMonths.toISOString()),
            where("DateCreated", "<=", lastDayOfLastFourMonths.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);

          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }

        //Calculate for five month ago earnings
        else if (Selected === getPreviousMonth(5)) {
          // Calculate today
          const today = new Date();

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

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", firstDayOfLastFiveMonths.toISOString()),
            where("DateCreated", "<=", lastDayOfLastFiveMonths.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);


          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }

        //Calculate for six month ago earnings
        else if (Selected === getPreviousMonth(6)) {
          // Calculate today
          const today = new Date();

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

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", firstDayOfLastSixMonths.toISOString()),
            where("DateCreated", "<=", lastDayOfLastSixMonths.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          // Calculating 85% of the total earnings
          const eightyFivePercent = total * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);


          setData(list);
          setFieldSum(total);
          setProfitSum(roundPercentage);
        }
      }
    };
    FetchData();
  }, [Selected, currentUser, data]);

  const getPreviousMonth = (monthsAgo = 1) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount).replace(".00", "");
  }

  const formattedAmount = formatCurrency(fieldSum);

  const formattedProfit = formatCurrency(profitSum);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Company's Income</h1>
        <select
          className="chart-select"
          onChange={(e) => {
            e.preventDefault();
            setSelected(e.target.value);
          }}
        >
          <option value="Total">Total</option>
          <option value={getPreviousMonth(0)}>Current Month</option>
          <option value={getPreviousMonth()}>{getPreviousMonth()}</option>
          <option value={getPreviousMonth(2)}>{getPreviousMonth(2)}</option>
          <option value={getPreviousMonth(3)}>{getPreviousMonth(3)}</option>
          <option value={getPreviousMonth(4)}>{getPreviousMonth(4)}</option>
          <option value={getPreviousMonth(5)}>{getPreviousMonth(5)}</option>
          <option value={getPreviousMonth(6)}>{getPreviousMonth(6)}</option>
        </select>
      </div>

      {Selected === "Total" ? (
        <div className="bottom">
          <table className="user-table">
            <thead>
              <tr>
                <th>Months</th>
                <th>Total Earnings</th>
                <th>Profits</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((entry, index) => (
                <tr key={index} className="user-entry">
                  <td>{entry.name}</td>
                  <td>{formatCurrency(entry.Total)}</td>
                  <td>{formatCurrency(entry.EightyFivePercent.toFixed(0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>) : (
        <div className="bottom">
          <p className="title">{Selected} Earnings and Profits</p>
          <div className="bottoms">
            <div className="place__holder">
              <div className="featuredChart total__holder">
                <p className="amount amounts">{formattedAmount}</p>
              </div>

              <p className="title">Monthly Earnings</p>
            </div>

            <div className="place__holder">
              <div className="featuredChart total__holder">
                <p className="amount amounts">{formattedProfit}</p>
              </div>

              <p className="title">Monthly Profits</p>
            </div>
          </div>
        </div>)}
    </div>
  );
};

export default EarningProfits;
