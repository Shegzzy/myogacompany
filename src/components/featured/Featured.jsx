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
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Timestamp for 1 day ago // 24 hours in milliseconds
          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("timeStamp", "<=", today),
            where("timeStamp", ">", yesterday)
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
          const now = new Date();
          const sevenDaysAgo = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("timeStamp", ">=", sevenDaysAgo)
          );
          const querySnapshot = await getDocs(q);

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });
          setData(list);
          setFieldSum(total);
        } else if (Selected === "30") {
          const now = new Date();
          const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          const q = query(
            collection(db, "Earnings"),
            where("Company", "==", docs.data().company),
            where("timeStamp", ">=", thirtyDaysAgo)
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

  // useEffect(() => {
  //   const sum = data.reduce((total, item) => total + parseInt(item.Amount), 0);
  //   setFieldSum(sum);
  // }, [data]);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    // let dataArray = [];
    // let dataOArray = [];
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeekAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfMonth = new Date(
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
        where("DateCreated", ">=", lastMonth.toISOString()),
        where("DateCreated", "<=", endOfMonth.toISOString())
      );
      // const prevMonthQuery = query(
      //   collection(db, "Earnings"),
      //   where("Company", "==", docs.data().company),
      //   where("timeStamp", "<=", lastMonth),
      //   where("timeStamp", ">", prevMonth)
      // );
      //A week ago
      const oneWeekQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", oneWeekAgo)
      );

      //Two weeks ago
      const twoWeekQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("timeStamp", "<=", oneWeekAgo),
        where("timeStamp", ">", twoWeekAgo)
      );

      const lastMonthData = await getDocs(lastMonthQuery);
      const thisMonthData = await getDocs(thisMonthQuery);
      // const oneWeekData = await getDocs(oneWeekQuery);
      // const twoWeekData = await getDocs(twoWeekQuery);
      // setDiff(
      //   ((thisMonthData.docs.length - lastMonthData.docs.length) /
      //     lastMonthData.docs.length) *
      //     100
      // );

      //Gettin the percentage difference
      const lastMonthDocsCount = lastMonthData.docs.length;
      const thisMonthDocsCount = thisMonthData.docs.length;

      let currentMonthPercentageDiff = 0;
      if (lastMonthDocsCount > 0) {
        currentMonthPercentageDiff =
          ((thisMonthDocsCount - lastMonthDocsCount) / lastMonthDocsCount) *
          100;
      } else {
        currentMonthPercentageDiff = 100;
      }

      const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 0 decimal places

      setDiff(roundedDiff);

      // getDocs(lastMonthQuery).then((querySnapshot) => {
      //   let total = 0;
      //   querySnapshot.forEach((doc) => {
      //     const data = doc.data();
      //     total += parseFloat(data.Amount);
      //   });
      //   setLData(total);
      // });

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

      // const total = lData.reduce(
      //   (total, item) => total + parseInt(item.Amount),
      //   0
      // );
      // setLastSum(total);

      // const sum = oData.reduce(
      //   (total, item) => total + parseInt(item.Amount),
      //   0
      // );
      // setOneSum(sum);
    }
  };

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
          <option value="30">30 Days</option>
          <option value="7">7 Days</option>
          <option value="1">1 Day</option>
        </select>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={diff} text={`${diff}%`} strokeWidth={5} />
        </div>
        <p className="title">Total Earnings</p>
        <p className="amount">₦{fieldSum}</p>
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
                  ₦{oData}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  ₦{oData}
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
                  ₦{lWData}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  ₦{lWData}
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
