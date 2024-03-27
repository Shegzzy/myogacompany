import "./bookings.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ModalContainer from "../../components/modal/ModalContainer";
import { AuthContext } from "../../context/authContext";

const Bookings = ({ inputs, title }) => {
  const [data, setData] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedRiderFilter] = useState("all");


  // Fetching bookings handled by the company's riders
  useEffect(() => {
    setIsMounted(true);

    fetchBookingData();

    return () => {
      setIsMounted(false);
    };
  }, [currentUser, isMounted]);

  const fetchBookingData = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        setLoading(true);

        if (docs.exists && isMounted) {
          const driversQuery = query(
            collection(db, "Drivers"),
            where("Company", "==", docs.data().company)
          );
          const driversSnapshot = await getDocs(driversQuery);

          const driverMap = new Map();
          driversSnapshot.forEach((driverDoc) => {
            driverMap.set(driverDoc.id, driverDoc.data().FullName);
          });

          const bookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "in", Array.from(driverMap.keys()))
          );

          const bookingsSnapshot = await getDocs(bookingsQuery);

          const bookings = bookingsSnapshot.docs.map((bookingDoc) => {
            const bookingData = bookingDoc.data();
            return {
              ...bookingData,
              driverName: driverMap.get(bookingData["Driver ID"]),
            };
          });

          bookings.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

          if (isMounted) {
            setData(bookings);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch operation aborted due to component unmount');
      } else {
        toast.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to search for riders
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchBookingData();
    } else {
      const filteredData = data.filter((bookingNumber) => {
        const name = bookingNumber['Booking Number']?.toLowerCase() ?? "";
        return name.includes(searchTerm?.toLowerCase() ?? "");
      });

      if (filteredData.length === 0) {
        toast.error('No search results found.');
      }

      setData(filteredData);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  // Function for bookings monthly and weekly query
  useEffect(() => {
    let isMounted = true;

    const fetchBookingDataByWeek = async () => {
      if (currentUser && isMounted) {
        try {
          const userRef = doc(db, "Companies", currentUser.uid);
          const docs = await getDoc(userRef);
          setLoading(true);

          let startOfPeriod, endOfPeriod;

          if (selectedFilter === "all") {
            fetchBookingData();
          } else {
            const today = new Date();

            // Calculate the start and end dates based on the selected filter
            if (selectedFilter === "7") {
              // Last Week
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
            } else if (selectedFilter === "1") {
              // Two Weeks Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 14);
              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 8);
            } else if (selectedFilter === "2") {
              // Three Weeks Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 21);
              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 15);
            } else if (selectedFilter === "3") {
              // Four Weeks Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 28);
              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 22);
            } else if (selectedFilter === "30") {
              // Last Month
              startOfPeriod = new Date(today);
              startOfPeriod.setMonth(today.getMonth() - 1, 1);
              startOfPeriod.setHours(0, 0, 0, 0);
              endOfPeriod = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0);
              // endOfPeriod.setHours(23, 59, 59, 999);
            } else if (selectedFilter === "60") {
              // Two Months Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setMonth(today.getMonth() - 2, 1);
              startOfPeriod.setHours(0, 0, 0, 0);
              endOfPeriod = new Date(today);
              endOfPeriod.setMonth(today.getMonth() - 1, 0);

            }

            // startOfWeek.setHours(0, 0, 0, 0);
            // endOfWeek = new Date(startOfWeek);
            // endOfWeek.setDate(startOfWeek.getDate() + 6);
            // // endOfWeek.setHours(23, 59, 59, 999);

            console.log('Start of period: ' + startOfPeriod);
            console.log('End of period: ' + endOfPeriod);

            if (docs.exists && isMounted) {
              const driversQuery = query(
                collection(db, "Drivers"),
                where("Company", "==", docs.data().company)
              );
              const driversSnapshot = await getDocs(driversQuery);

              const driverMap = new Map();
              driversSnapshot.forEach((driverDoc) => {
                driverMap.set(driverDoc.id, driverDoc.data().FullName);
              });

              const bookingsQuery = query(
                collection(db, "Bookings"),
                where("Driver ID", "in", Array.from(driverMap.keys())),
                where("Date Created", ">=", startOfPeriod.toISOString()),
                where("Date Created", "<=", endOfPeriod.toISOString())
              );

              const bookingsSnapshot = await getDocs(bookingsQuery);

              const bookings = bookingsSnapshot.docs.map((bookingDoc) => {
                const bookingData = bookingDoc.data();
                return {
                  ...bookingData,
                  driverName: driverMap.get(bookingData["Driver ID"]),
                };
              });

              bookings.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

              if (isMounted) {
                setData(bookings);
              }
            }

          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingDataByWeek();
    return () => {
      isMounted = false;
    };
  }, [currentUser, selectedFilter]);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>

          <select
            className="chart-select"
            value={selectedFilter}
            onChange={(e) => setSelectedRiderFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="7">Last Week</option>
            <option value="1">Two Weeks Ago</option>
            <option value="2">Three Weeks Ago</option>
            <option value="3">Four Weeks Ago</option>
            <option value="30">Last Month</option>
            <option value="60">Two Months Ago</option>
          </select>

          <input
            type="text"
            placeholder="Enter Booking Number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {!loading ? (<div className="b-table">

          {data.length === 0 ? (<h6>There are no bookings for this filter</h6>) : (<TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 780 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell" width={80}>
                    Booking Number
                  </TableCell>
                  <TableCell className="tableCell" width={80}>
                    Package
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Customer Name
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Date
                  </TableCell>
                  <TableCell className="tableCell" width={50}>
                    Amount
                  </TableCell>
                  <TableCell className="tableCell" width={20}>
                    Payment Method
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Pickup Location
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Dropoff Location
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Phone
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Rider
                  </TableCell>
                  <TableCell className="tableCell" width={80}>
                    Distance
                  </TableCell>
                  <TableCell className="tableCell" width={130}>
                    Ride Type
                  </TableCell>
                  <TableCell className="tableCell" width={100}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row["Booking Number"]}>
                    <TableCell className="tableCell" width={80}>
                      {row["Booking Number"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["Package Type"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["Customer Name"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {new Date(row["Date Created"]).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="tableCell">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })
                        .format(row["Amount"])
                        .replace(".00", "")}</TableCell>
                    <TableCell className="tableCell">
                      {row["Payment Method"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["PickUp Address"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["DropOff Address"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["Customer Phone"]}
                    </TableCell>
                    <TableCell className="tableCell" width={100}>
                      <Link to={`/users/${row["Driver ID"]}`}>
                        {row.driverName}
                      </Link>
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["Distance"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row["Ride Type"]}
                    </TableCell>
                    <TableCell className="tableCell">
                      <div className={`cellWithStatus ${row["Status"]}`}>
                        {row["Status"]}
                        {<ModalContainer id={row["Booking Number"]} />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>)}
        </div>) :
          (<div className="detailItem">
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
          </div>)
        }
      </div>
    </div>
  );
};

export default Bookings;
