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
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Drivers"), (snapshot) => {
      setTotalDrivers(snapshot.size);
    });

    onSnapshot(collection(db, "Bookings"), (snapshot) => {
      setTotalBookings(snapshot.size);
    });

    return unsubscribe;
  }, []);

  //Last month's total
  useEffect(() => {
    const sumPrice = async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() - 1);
      endOfMonth.setDate(1);
      endOfMonth.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "Bookings"),
        where("Date Created", ">=", endOfMonth),
        where("Date Created", "<", startOfMonth)
      );

      const querySnapshot = await getDocs(q);
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setTotalPrice(total);
    };
    sumPrice();
  }, []);

  const [totalPrices, setTotalPrices] = useState(0);

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
      const q = query(
        bookingsRef,
        where("Date Created", ">=", startOfMonth),
        where("Date Created", "<=", endOfMonth)
      );
      const querySnapshot = await getDocs(q);
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateCreated = data["Date Created"].toDate();
        total += parseFloat(data.Amount);
        const formattedPrice = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(total);
      });
      setTotalPrices(total);
    };
    sumPrice();
  }, []);

  //temporary
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "DRIVERS",
        isMoney: false,
        link: (
          <Link to={`/users/`} style={{ textDecoration: "none" }}>
            See all drivers
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
          {type === "earning" && `${totalPrices}`}
          {type === "balance" && `${totalPrice}`}
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
