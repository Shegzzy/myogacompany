import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../components/table/table.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
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
import ModalContainer from "../../components/modal/ModalContainer";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { DisabledByDefault } from "@mui/icons-material";

const Single = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [diff, setDiff] = useState(null);
  const [oData, setOData] = useState([]);
  const [lWData, setLWData] = useState([]);
  const [lMData, setLData] = useState([]);
  const [mData, setMData] = useState([]);

  //Fetching rider's data
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const userRef = doc(db, "Drivers", id);
      const userDoc = await getDoc(userRef);
      if (isMounted && userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Calculating rider's total earnings
  useEffect(() => {
    let isMounted = true;

    const bookingsQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      let totalAmount = 0;
      snapshot.forEach((doc) => {
        const booking = doc.data();
        totalAmount += parseFloat(booking.Amount);
      });
      if (isMounted) {
        setTotalEarnings(totalAmount);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [id]);

  const [data, setData] = useState([]);
  // Fetching all rider's deliveries
  useEffect(() => {
    let isMounted = true;

    const bookingsQuery = query(
      collection(db, "Bookings"),
      where("Driver ID", "==", id)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((doc) => {
        const booking = doc.data();
        const bookingId = doc.id; // unique ID for this booking document
        bookingsData.push({ ...booking, id: bookingId }); // include ID in booking data
      });
      if (isMounted) {
        bookingsData.sort(
          (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
        );
        setData(bookingsData);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeekAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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

    //This Month's Earning Query
    const thisMonthQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", ">=", firstDayOfMonth.toISOString()),
      where("DateCreated", "<=", today.toISOString())
    );

    //Last Month's Earning Query
    const lastMonthQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", ">=", lastMonth.toISOString()),
      where("DateCreated", "<=", endOfMonth.toISOString())
    );

    //A week ago
    const oneWeekQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", "<=", today.toISOString()),
      where("DateCreated", ">", oneWeekAgo.toISOString())
    );

    //Two weeks ago
    const twoWeekQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", "<=", oneWeekAgo.toISOString()),
      where("DateCreated", ">", twoWeekAgo.toISOString())
    );

    //Gettin the percentage difference
    let currentMonthPercentageDiff = 0;

    if (lMData > 0) {
      currentMonthPercentageDiff = ((mData - lMData) / lMData) * 100;
    } else {
      currentMonthPercentageDiff = 100;
    }
    const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 0 decimal places
    setDiff(roundedDiff);

    getDocs(lastMonthQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseInt(data.Amount);
      });
      setLData(total);
    });

    getDocs(thisMonthQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseInt(data.Amount);
      });
      setMData(total);
    });

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
  };

  const formattedTotalEarning = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(totalEarnings)
    .replace(".00", "");

  const formattedoDataEarning = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(oData)
    .replace(".00", "");

  const formattedlWEarning = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(lWData)
    .replace(".00", "");

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {user ? (
              <div className="editButton">
                <Link to={`/edit/${id}`} style={{ textDecoration: "none" }}>
                  Edit
                </Link>
              </div>
            ) : (
              <div className="editButtons"></div>
            )}
            <h1 className="title">Information</h1>
            {user ? (
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

                <div className="details">
                  <h1 className="name">Vehicle Details</h1>
                  <div className="detailItem">
                    <span className="itemKey">Type: </span>
                    <span className="itemValue">{user["Vehicle Type"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Make: </span>
                    <span className="itemValue">{user["Vehicle Make"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Model: </span>
                    <span className="itemValue">{user["Vehicle Model"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">VNumber: </span>
                    <span className="itemValue">{user["Vehicle Number"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Year: </span>
                    <span className="itemValue">{user["Vehicle Year"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Color: </span>
                    <span className="itemValue">{user["Vehicle Color"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Current Location: </span>
                    <span className="itemValue">{user["Driver Address"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Latitude: </span>
                    <span className="itemValue">{user["Driver Latitude"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Longitude: </span>
                    <span className="itemValue">
                      {user["Driver Longitude"]}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Documents: </span>
                    {/* {row?.Documents.map((doc) => (
                      <img src={doc} alt="avatar" className="itemImg" />
                    ))} */}
                    <img
                      src={user.Documents}
                      alt="avatar"
                      className="itemImg"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="detailItem">
                <span className="itemKey">
                  <div className="no-data-message">
                    <div className="single-container">
                      <div className="loader">
                        <div className="lds-dual-ring"></div>
                        <div>Loading... </div>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            )}
          </div>
          <div className="right">
            <div className="featured">
              <div className="top">
                <h1 className="title">Total Earning</h1>
              </div>
              <div className="bottom">
                <div className="featuredChart">
                  <CircularProgressbar
                    value={diff}
                    text={`${diff}%`}
                    strokeWidth={5}
                  />
                </div>
                <br />
                <p className="title">Total</p>
                <p className="amount">{formattedTotalEarning}</p>

                <div className="summary">
                  {oData > lWData ? (
                    <div className="item">
                      <div className="itemTitle">Last Week</div>
                      <div className="itemResult positive">
                        <KeyboardArrowUpOutlinedIcon
                          fontSize="small"
                          style={{ color: "green" }}
                        />
                        <div
                          className="resultAmount"
                          style={{ color: "green" }}
                        >
                          {formattedoDataEarning}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="item">
                      <div className="itemTitle">Last Week</div>
                      <div className="itemResult positive">
                        <KeyboardArrowDownOutlined
                          fontSize="small"
                          style={{ color: "red" }}
                        />
                        <div className="resultAmount" style={{ color: "red" }}>
                          {formattedoDataEarning}
                        </div>
                      </div>
                    </div>
                  )}

                  {lWData > oData ? (
                    <div className="item">
                      <div className="itemTitle">Two Weeks Ago</div>
                      <div className="itemResult positive">
                        <KeyboardArrowUpOutlinedIcon
                          fontSize="small"
                          style={{ color: "green" }}
                        />
                        <div
                          className="resultAmount"
                          style={{ color: "green" }}
                        >
                          {formattedlWEarning}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="item">
                      <div className="itemTitle">Two Weeks Ago</div>
                      <div className="itemResult positive">
                        <KeyboardArrowDownOutlined
                          fontSize="small"
                          style={{ color: "red" }}
                        />
                        <div className="resultAmount" style={{ color: "red" }}>
                          {formattedlWEarning}
                        </div>
                      </div>
                    </div>
                  )}
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
                {data ? (
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
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        })
                          .format(row["Amount"])
                          .replace(".00", "")}
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
                        {<ModalContainer id={row["Booking Number"]} />}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Single;
