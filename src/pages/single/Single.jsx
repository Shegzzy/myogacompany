import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../components/table/table.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { CircularProgressbar } from "react-circular-progressbar";
import "../../components/featured/featured.scss";
import { query, where } from "firebase/firestore";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast } from "react-toastify";

const Single = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "Drivers", id);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "Bookings"),
      where("Driver ID", "==", id)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      let totalAmount = 0;
      snapshot.forEach((doc) => {
        const booking = doc.data();
        totalAmount += parseFloat(booking.Amount);
      });
      setTotalBookings(totalAmount);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "Bookings"),
      where("Driver ID", "==", id)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((doc) => {
        const booking = doc.data();
        bookingsData.push(booking);
      });
      setData(bookingsData);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">
              <Link to={`/edit/${id}`} style={{ textDecoration: "none" }}>
                Edit
              </Link>
            </div>
            <h1 className="title">Information</h1>
            {user && (
              <div className="item">
                <img src={user["Profile Photo"]} alt="" className="itemImg" />
                <div className="details">
                  <h1 className="itemTitle">{user.FullName}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{user.Email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{user.Phone}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{user["Address"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">State:</span>
                    <span className="itemValue">{user.State}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="right">
            <div className="featured">
              <div className="top">
                <h1 className="title">Total Income</h1>
              </div>
              <div className="bottom">
                <div className="featuredChart">
                  <CircularProgressbar
                    value={70}
                    text={"70%"}
                    strokeWidth={5}
                  />
                </div>
                <p className="title">Total Earning</p>
                <p className="amount">₦ {totalBookings}</p>
                <div className="summary">
                  <div className="item">
                    <div className="itemTitle">Last Week</div>
                    <div className="itemResult positive">
                      <KeyboardArrowUpOutlinedIcon fontSize="small" />
                      <div className="resultAmount">₦12.4k</div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="itemTitle">Last Month</div>
                    <div className="itemResult positive">
                      <KeyboardArrowUpOutlinedIcon fontSize="small" />
                      <div className="resultAmount">₦12.4k</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Booking Number</TableCell>
                  <TableCell className="tableCell">Product</TableCell>
                  <TableCell className="tableCell">Customer</TableCell>
                  <TableCell className="tableCell">Date</TableCell>
                  <TableCell className="tableCell">Amount</TableCell>
                  <TableCell className="tableCell">Payment Method</TableCell>
                  <TableCell className="tableCell">Distance</TableCell>
                  <TableCell className="tableCell">Pick Up</TableCell>
                  <TableCell className="tableCell">Drop Off</TableCell>
                  <TableCell className="tableCell">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">
                        {row["Booking Number"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["Package Type"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["Customer Name"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {new Date(row["Date Created"]).toLocaleDateString(
                          "en-US"
                        )}
                      </TableCell>

                      <TableCell className="tableCell">
                        {row["Amount"]}
                      </TableCell>
                      <TableCell className="tableCell" width={200}>
                        {row["Payment Method"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["Distance"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["PickUp Address"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["DropOff Address"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["Status"]}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Single;
