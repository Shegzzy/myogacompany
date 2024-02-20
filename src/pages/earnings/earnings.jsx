// import "./bookings.scss";
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

const CompanyEarnings = ({ title }) => {
    const [data, setData] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                try {
                    const userRef = doc(db, "Companies", currentUser.uid);
                    const docs = await getDoc(userRef);

                    const earningsQuery = query(
                        collection(db, "Earnings"),
                        where("Company", "==", docs.data().company)
                    );
                    const earningsSnapshot = await getDocs(earningsQuery);
                    earningsSnapshot.docs.forEach((doc) => {
                        console.log(doc.data().Driver);
                    });

                    // Collecting Driver IDs
                    const bookingNumbers = earningsSnapshot.docs.map(
                        (driverDoc) => driverDoc.id
                    );

                    const bookingsQuery = query(
                        collection(db, "Bookings"),
                        where("Booking Number", "in", bookingNumbers)
                    );
                    const bookingsSnapshot = await getDocs(bookingsQuery);

                    const bookings = bookingsSnapshot.docs.map((bookingDoc) =>
                        bookingDoc.data()
                    );

                    bookings.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

                    setData(bookings);
                } catch (error) {
                    toast.error(error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
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
                                        Driver ID
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
                                    <TableRow key={row["Driver ID"]}>
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
                                        <TableCell className="tableCell">{row.Amount}</TableCell>
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
                                        <TableCell className="tableCell">
                                            <Link to={`/users/${row["Driver ID"]}`}>
                                                {row["Driver ID"]}
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

export default CompanyEarnings;
