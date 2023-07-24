import "./featured.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
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

const Featured = () => {
  const [Selected, setSelected] = useState("total");
  const [data, setData] = useState([]);
  const [oData, setOData] = useState([]);
  const [lWData, setLWData] = useState([]);
  //const [lData, setLData] = useState([]);
  const [fieldSum, setFieldSum] = useState(0);
  // const [oneSum, setOneSum] = useState(0);
  // const [lastSum, setLastSum] = useState(0);
  const [diff, setDiff] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const FetchData = async () => {
      let list = [];
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        if (Selected === "1") {
          const today = new Date();
          // Calculate the date range for 1 day ago
          const oneDayAgo = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
          const startOfOneDayAgo = new Date(
            oneDayAgo.getFullYear(),
            oneDayAgo.getMonth(),
            oneDayAgo.getDate(),
            0,
            0,
            0,
            0
          );
          const endOfOneDayAgo = new Date(
            oneDayAgo.getFullYear(),
            oneDayAgo.getMonth(),
            oneDayAgo.getDate(),
            23,
            59,
            59,
            999
          ); // Timestamp for 1 day ago // 24 hours in milliseconds
          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", startOfOneDayAgo.toISOString()),
            where("DateCreated", "<=", endOfOneDayAgo.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });
          setData(list);
          setFieldSum(total);
        } else if (Selected === "7") {
          const today = new Date();

          // Calculate the date range for 1 week ago
          const oneWeekAgo = new Date(
            today.getTime() - 7 * 24 * 60 * 60 * 1000
          );

          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("DateCreated", ">=", oneWeekAgo.toISOString()),
            where("DateCreated", "<=", today.toISOString())
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });
          setData(list);
          setFieldSum(total);
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
          setData(list);
          setFieldSum(total);
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
          setData(list);
          setFieldSum(total);
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
          setData(list);
          setFieldSum(total);
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
          setData(list);
          setFieldSum(total);
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
          setData(list);
          setFieldSum(total);
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
          setData(list);
          setFieldSum(total);
        } else if (Selected === "total") {
          const sumEarnings = async () => {
            const querySnapshot = await getDocs(
              query(
                collection(db, "Earnings"),
                where("Company", "==", docs.data().company)
              )
            );

            let total = 0;
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              total += parseFloat(data.Amount);
            });

            setFieldSum(total);
          };
          sumEarnings();
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

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeekAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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

    if (currentUser) {
      //This Month's Earning Query
      const userRef = doc(db, "Companies", currentUser.uid);
      const docs = await getDoc(userRef);

      const thisMonthQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfMonth.toISOString()),
        where("DateCreated", "<=", today.toISOString())
      );

      //Last Month's Earning Query
      const lastMonthQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", firstDayOfLastMonth.toISOString()),
        where("DateCreated", "<=", lastDayOfLastMonth.toISOString())
      );

      //A week ago
      const oneWeekQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", "<=", today.toISOString()),
        where("DateCreated", ">=", oneWeekAgo.toISOString())
      );

      //Two weeks ago
      const twoWeekQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", twoWeekAgo.toISOString()),
        where("DateCreated", "<=", oneWeekAgo.toISOString())
      );

      const lastMonthData = await getDocs(lastMonthQuery);
      const thisMonthData = await getDocs(thisMonthQuery);

      //Getting the percentage difference
      const lastMonthTotalEarnings = lastMonthData.docs.reduce(
        (total, doc) => total + parseFloat(doc.data().Amount),
        0
      );
      const thisMonthTotalEarnings = thisMonthData.docs.reduce(
        (total, doc) => total + parseFloat(doc.data().Amount),
        0
      );

      let currentMonthPercentageDiff = 0;
      if (lastMonthTotalEarnings > 0) {
        currentMonthPercentageDiff =
          ((thisMonthTotalEarnings - lastMonthTotalEarnings) /
            lastMonthTotalEarnings) *
          100;
      } else {
        currentMonthPercentageDiff = 100;
      }

      const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 2 decimal places

      setDiff(roundedDiff);

      //Calculating a week ago amount
      getDocs(oneWeekQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setOData(total);
      });

      //Calculating two weeks ago amount
      getDocs(twoWeekQuery).then((querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setLWData(total);
      });
    }
  };

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(fieldSum)
    .replace(".00", "");

  const formattedoDataAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(oData)
    .replace(".00", "");

  const formattedlWAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(lWData)
    .replace(".00", "");

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
          <option value="total">Total</option>
          <option value="7">Last Week</option>
          <option value="1">Yesterday</option>
          <option value={getPreviousMonth()}>{getPreviousMonth()}</option>
          <option value={getPreviousMonth(2)}>{getPreviousMonth(2)}</option>
          <option value={getPreviousMonth(3)}>{getPreviousMonth(3)}</option>
          <option value={getPreviousMonth(4)}>{getPreviousMonth(4)}</option>
          <option value={getPreviousMonth(5)}>{getPreviousMonth(5)}</option>
          <option value={getPreviousMonth(6)}>{getPreviousMonth(6)}</option>
        </select>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={diff} text={`${diff}%`} strokeWidth={5} />
        </div>
        <p className="title">Total Earnings</p>
        <p className="amount">{formattedAmount}</p>
        {/* <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p> */}
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult negative">
              {oData > lWData ? (
                <KeyboardArrowUpOutlinedIcon
                  style={{ color: "green" }}
                  fontSize="small"
                />
              ) : (
                <KeyboardArrowDownIcon
                  style={{ color: "red" }}
                  fontSize="small"
                />
              )}
              {oData > lWData ? (
                <div className="resultAmount" style={{ color: "green" }}>
                  {formattedoDataAmount}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  {formattedoDataAmount}
                </div>
              )}
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Two Weeks Ago</div>
            <div className="itemResult positive">
              {lWData > oData ? (
                <KeyboardArrowUpOutlinedIcon
                  style={{ color: "green" }}
                  fontSize="small"
                />
              ) : (
                <KeyboardArrowDownIcon
                  style={{ color: "red" }}
                  fontSize="small"
                />
              )}
              {lWData > oData ? (
                <div className="resultAmount" style={{ color: "green" }}>
                  {formattedlWAmount}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  {formattedlWAmount}
                </div>
              )}
            </div>
          </div>
          {/* <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">₦{lData}</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Featured;
