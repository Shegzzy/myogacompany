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



  // Fetching bookings handled by the company's riders
  useEffect(() => {
    setIsMounted(true);

    fetchData();

    return () => {
      setIsMounted(false);
    };
  }, [currentUser, isMounted]);

  const fetchData = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);

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
    }
  };

  // Function to search for riders
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchData();
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

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>

          <input
            type="text"
            placeholder="Enter Booking Number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="b-table">
          <TableContainer component={Paper} className="table">
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
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
