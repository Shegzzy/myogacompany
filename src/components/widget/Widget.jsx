import "./widget.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { AuthContext } from "../../context/authContext";

const Widget = ({ type }) => {
  let data;
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [previousMonthTotalPrice, setPreviousMonthTotalPrice] = useState(0);
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [diff, setDiff] = useState("");
  const [lMDiff, setLMDiff] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        const unsubscribe = onSnapshot(
          query(
            collection(db, "Drivers"),
            where("Company", "==", docs.data().company)
          ),
          (snapShot) => {
            setTotalDrivers(snapShot.size);
          }
        );

        const bookingsUnsubscribe = onSnapshot(
          collection(db, "Bookings"),
          (snapshot) => {
            setTotalBookings(snapshot.size);
          }
        );
        return () => {
          unsubscribe();
          bookingsUnsubscribe();
        };
      }
    };

    // const unsubscribe = onSnapshot(collection(db, "Drivers"), (snapshot) => {
    //   setTotalDrivers(snapshot.size);
    // });

    fetchData();
  }, [currentUser]);

  //Last month's total
  useEffect(() => {
    const sumPrice = async () => {
      const startOfPreviousMonth = new Date();
      startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);
      startOfPreviousMonth.setDate(1);
      startOfPreviousMonth.setHours(0, 0, 0, 0);

      const endOfPreviousMonth = new Date();
      endOfPreviousMonth.setDate(0);
      endOfPreviousMonth.setHours(23, 59, 59, 999);

      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        const prevMonthQuery = query(
          collection(db, "Earnings"),
          where("Company", "==", docs.data().company),
          where("DateCreated", ">=", startOfPreviousMonth.toISOString()),
          where("DateCreated", "<=", endOfPreviousMonth.toISOString())
        );

        const querySnapshot = await getDocs(prevMonthQuery);
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setPreviousMonthTotalPrice(total);
      }
    };
    sumPrice();
  }, [currentUser]);

  //This month's total
  useEffect(() => {
    const sumPrice = async () => {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );

      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        const thisMonthQuery = query(
          collection(db, "Earnings"),
          where("Company", "==", docs.data().company),
          where("DateCreated", ">=", startOfMonth.toISOString()),
          where("DateCreated", "<", endOfMonth.toISOString())
        );

        const querySnapshot = await getDocs(thisMonthQuery);
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setTotalThisMonth(total);
      }
    };
    sumPrice();
  }, [previousMonthTotalPrice, currentUser, totalThisMonth]);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const startOfPreviousMonth = new Date();
    startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);
    startOfPreviousMonth.setDate(1);
    startOfPreviousMonth.setHours(0, 0, 0, 0);

    const endOfPreviousMonth = new Date();
    endOfPreviousMonth.setDate(0);
    endOfPreviousMonth.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    if (currentUser) {
      const userRef = doc(db, "Companies", currentUser.uid);
      const docs = await getDoc(userRef);
      const prevMonthQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", startOfPreviousMonth.toISOString()),
        where("DateCreated", "<=", endOfPreviousMonth.toISOString())
      );

      const thisMonthQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", docs.data().company),
        where("DateCreated", ">=", startOfMonth.toISOString()),
        where("DateCreated", "<", endOfMonth.toISOString())
      );

      const lastMonthData = await getDocs(prevMonthQuery);
      const thisMonthData = await getDocs(thisMonthQuery);

      const lastMonthDocsCount = lastMonthData.docs.length;
      const thisMonthDocsCount = thisMonthData.docs.length;

      let currentMonthPercentageDiff = 0;
      let lastMonthPercentageDiff = 0;

      if (lastMonthDocsCount > 0) {
        currentMonthPercentageDiff =
          ((thisMonthDocsCount - lastMonthDocsCount) / lastMonthDocsCount) *
          100;
        lastMonthPercentageDiff =
          ((lastMonthDocsCount - thisMonthDocsCount) / thisMonthDocsCount) *
          100;
      } else {
        currentMonthPercentageDiff = 100;
        lastMonthPercentageDiff = 0;
      }

      const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 0 decimal places
      const roundedLastMonthDiff = lastMonthPercentageDiff.toFixed(0); // round up to 0 decimal places

      setDiff(roundedDiff);
      setLMDiff(roundedLastMonthDiff);
    }
  };

  switch (type) {
    case "user":
      data = {
        title: "RIDERS",
        isMoney: false,
        link: (
          <Link to={`/users/`} style={{ textDecoration: "none" }}>
            See all riders
          </Link>
        ),
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "BOOKINGS",
        isMoney: false,
        // link: (
        //   <Link to={`/bookings/`} style={{ textDecoration: "none" }}>
        //     See all bookings
        //   </Link>
        // ),
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "THIS MONTH",
        isMoney: true,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "LAST MONTH",
        isMoney: true,
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {type === "user" && `${totalDrivers}`}
          {type === "order" && `${totalBookings}`}
          {data.isMoney && "\u20A6 "}
          {type === "earning" && `${totalThisMonth}`}
          {type === "balance" && `${previousMonthTotalPrice}`}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          {type === "earning" && (
            <>
              {totalThisMonth > previousMonthTotalPrice ? (
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
              {`${diff}%`}
            </>
          )}

          {type === "balance" && (
            <>
              {previousMonthTotalPrice > totalThisMonth ? (
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
              {`${lMDiff}%`}
            </>
          )}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
