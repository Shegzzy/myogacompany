import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const Widget = ({ type }) => {
  let data;
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [previousMonthTotalPrice, setPreviousMonthTotalPrice] = useState(0);
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [diff, setDiff] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Drivers"), (snapshot) => {
      setTotalDrivers(snapshot.size);
    });

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
  }, []);

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

      const prevMonthQuery = query(
        collection(db, "Bookings"),
        where("Date Created", ">=", startOfPreviousMonth.toISOString()),
        where("Date Created", "<=", endOfPreviousMonth.toISOString())
      );

      const querySnapshot = await getDocs(prevMonthQuery);
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setPreviousMonthTotalPrice(total);
    };
    sumPrice();
  }, []);

  //This month's total
  useEffect(() => {
    const sumPrice = async () => {
      const bookingsRef = collection(db, "Bookings");
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
      const thisMonthQuery = query(
        bookingsRef,
        where("Date Created", ">=", startOfMonth.toISOString()),
        where("Date Created", "<=", endOfMonth.toISOString())
      );

      const querySnapshot = await getDocs(thisMonthQuery);
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setTotalThisMonth(total);
      const percentageDiff =
        ((total - previousMonthTotalPrice) / previousMonthTotalPrice) * 100;
      setDiff(percentageDiff);
    };
    sumPrice();
  }, [previousMonthTotalPrice]);

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
        link: (
          <Link to={`/bookings/`} style={{ textDecoration: "none" }}>
            See all bookings
          </Link>
        ),
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
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
