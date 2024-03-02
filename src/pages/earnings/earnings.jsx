import "./earnings.scss";
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CompanyEarnings = ({ title }) => {
    const [data, setData] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [isMounted, setIsMounted] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [total, setTotal] = useState(0);
    const [inFlow, setInFlow] = useState(null);
    const [outFlow, setOutFlow] = useState(null);
    const [cardPayments, setCardPayments] = useState(0);
    const [cashPayments, setCashPayments] = useState(0);
    const [payOut, setPayOut] = useState(0);
    const [toReceive, setToReceive] = useState(0);



    const fetchData = async () => {
        const allBookings = [];
        let sumCardPayments = 0;
        let sumCashPayments = 0;
        let totalReceive = 0;
        let totalPayOut = 0;

        if (currentUser && isMounted) {
            try {
                const userRef = doc(db, "Companies", currentUser.uid);
                const docs = await getDoc(userRef);
                setLoading(true);

                if (isMounted) {
                    const earningsQuery = query(
                        collection(db, "Earnings"),
                        where("Company", "==", docs.data().company)
                    );
                    const earningsSnapshot = await getDocs(earningsQuery);

                    // Collecting Bookings IDs
                    const bookingNumbers = earningsSnapshot.docs.map(
                        (bookingrDoc) => bookingrDoc.data().BookingID,
                    );
                    let earningsTotal = 0;

                    earningsSnapshot.forEach((doc) => {
                        const data = doc.data();
                        earningsTotal += parseFloat(data.Amount);
                    });


                    // Calculating 85% of the total earnings
                    const eightyFivePercent = earningsTotal * 0.85;
                    const roundPercentage = eightyFivePercent.toFixed(0);

                    // Calculating 15% of the total earnings
                    const fifteenPercent = earningsTotal * 0.15;
                    const roundFifteenPercent = fifteenPercent.toFixed(0);

                    const chunkSize = 30;
                    const bookingChunks = [];
                    for (let i = 0; i < bookingNumbers.length; i += chunkSize) {
                        const chunk = bookingNumbers.slice(i, i + chunkSize);
                        bookingChunks.push(chunk);
                    }


                    for (const chunk of bookingChunks) {
                        const bookingsQuery = query(
                            collection(db, "Bookings"),
                            where("Booking Number", "in", chunk)
                        );

                        try {
                            const bookingsSnapshot = await getDocs(bookingsQuery);

                            if (!bookingsSnapshot.empty) {
                                const bookings = bookingsSnapshot.docs.map((bookingDoc) => bookingDoc.data());

                                // Separate amounts based on payment method and calculate the sum
                                const cardPayments = bookings.filter((booking) => booking["Payment Method"] === "Card");
                                const cashPayments = bookings.filter((booking) => booking["Payment Method"] === "Cash on Delivery");

                                sumCardPayments += cardPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);
                                sumCashPayments += cashPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);

                                allBookings.push(...bookings);
                            } else {
                                console.log("No bookings found with the given Booking Numbers in this chunk.");
                            }
                        } catch (error) {
                            console.error("Error fetching bookings:", error);
                            toast.error("Error fetching bookings.");
                        }
                    }

                    if (sumCardPayments > roundFifteenPercent) {

                        totalReceive = sumCardPayments - roundFifteenPercent;

                        if (isMounted) {
                            setToReceive(totalReceive);
                            setPayOut(0);
                        }
                    } else if (sumCardPayments < roundFifteenPercent) {

                        totalPayOut = roundFifteenPercent - sumCardPayments;

                        if (isMounted) {
                            setPayOut(totalPayOut);
                            setToReceive(0);
                        }
                    } else {
                        totalPayOut = roundFifteenPercent - sumCardPayments;
                        totalReceive = sumCardPayments - roundFifteenPercent;


                        if (isMounted) {
                            setToReceive(totalReceive);
                            setPayOut(totalPayOut);
                        }

                    }

                    setTotal(earningsTotal);
                    setInFlow(roundPercentage);
                    setOutFlow(roundFifteenPercent);
                    setCardPayments(sumCardPayments);
                    setCashPayments(sumCashPayments);
                    allBookings.sort(
                        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                    );
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching data. Please check the console for details.");
            } finally {
                setLoading(false);
                if (isMounted) {
                    setData(allBookings);
                }
            }
        }
    };

    useEffect(() => {
        setIsMounted(true);

        return () => {
            fetchData();
            setIsMounted(false);
        };
    }, [currentUser, isMounted]);

    // Function for weekly query
    useEffect(() => {
        let isMounted = true;
        let earningsTotal = 0;
        let sumCardPayments = 0;
        let sumCashPayments = 0;
        let totalPayOut = 0;
        let totalReceive = 0;

        const fetchDataByWeek = async () => {
            if (currentUser && isMounted) {
                try {
                    const userRef = doc(db, "Companies", currentUser.uid);
                    const docs = await getDoc(userRef);
                    setLoading(true);

                    let startOfWeek, endOfWeek;

                    if (selectedFilter === "all") {
                        fetchData();
                    } else {
                        const today = new Date();

                        // Calculate the start and end dates based on the selected filter
                        if (selectedFilter === "7") {
                            // Last Week
                            startOfWeek = new Date(today);
                            startOfWeek.setDate(today.getDate() - today.getDay() - 6);
                        } else if (selectedFilter === "1") {
                            // Two Weeks Ago
                            startOfWeek = new Date(today);
                            startOfWeek.setDate(today.getDate() - today.getDay() - 13);
                        } else if (selectedFilter === "2") {
                            // Three Weeks Ago
                            startOfWeek = new Date(today);
                            startOfWeek.setDate(today.getDate() - today.getDay() - 20);
                        } else if (selectedFilter === "3") {
                            // Three Weeks Ago
                            startOfWeek = new Date(today);
                            startOfWeek.setDate(today.getDate() - today.getDay() - 27);
                        }

                        startOfWeek.setHours(0, 0, 0, 0);
                        endOfWeek = new Date(startOfWeek);
                        endOfWeek.setDate(startOfWeek.getDate() + 6);
                        // endOfWeek.setHours(23, 59, 59, 999);

                        // Use startOfWeek and endOfWeek in your Firestore query
                        const earningsQuery = query(
                            collection(db, "Earnings"),
                            where("Company", "==", docs.data().company),
                            where("DateCreated", ">=", startOfWeek.toISOString()),
                            where("DateCreated", "<=", endOfWeek.toISOString())
                        );

                        const earningsSnapshot = await getDocs(earningsQuery);
                        // const earningsData = earningsSnapshot.docs.map((doc) => doc.data());

                        // Collecting Bookings IDs
                        const bookingNumbers = earningsSnapshot.docs.map(
                            (bookingrDoc) => bookingrDoc.data().BookingID,
                        );

                        earningsSnapshot.forEach((doc) => {
                            const data = doc.data();
                            earningsTotal += parseFloat(data.Amount);
                        });

                        // Calculating 85% of the total earnings
                        const eightyFivePercent = earningsTotal * 0.85;
                        const roundPercentage = eightyFivePercent.toFixed(0);

                        // Calculating 15% of the total earnings
                        const fifteenPercent = earningsTotal * 0.15;
                        const roundFifteenPercent = fifteenPercent.toFixed(0);

                        const chunkSize = 30;
                        const bookingChunks = [];
                        for (let i = 0; i < bookingNumbers.length; i += chunkSize) {
                            const chunk = bookingNumbers.slice(i, i + chunkSize);
                            bookingChunks.push(chunk);
                        }

                        const allBookings = [];

                        for (const chunk of bookingChunks) {
                            const bookingsQuery = query(
                                collection(db, "Bookings"),
                                where("Booking Number", "in", chunk)
                            );

                            try {
                                const bookingsSnapshot = await getDocs(bookingsQuery);

                                if (!bookingsSnapshot.empty) {
                                    const bookings = bookingsSnapshot.docs.map((bookingDoc) => bookingDoc.data());
                                    // Separate amounts based on payment method and calculate the sum
                                    const cardPayments = bookings.filter((booking) => booking["Payment Method"] === "Card");
                                    const cashPayments = bookings.filter((booking) => booking["Payment Method"] === "Cash on Delivery");

                                    sumCardPayments += cardPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);
                                    sumCashPayments += cashPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);

                                    allBookings.push(...bookings);
                                } else {
                                    console.log("No bookings found with the given Booking Numbers in this chunk.");
                                }
                            } catch (error) {
                                console.error("Error fetching bookings:", error);
                                toast.error("Error fetching bookings. Please check the console for details.");
                            }
                        }

                        console.log("Total Card Payments:", sumCardPayments);
                        console.log("Total Cash Payments:", sumCashPayments);

                        if (sumCardPayments > roundFifteenPercent) {

                            totalReceive = sumCardPayments - roundFifteenPercent;

                            if (isMounted) {
                                setToReceive(totalReceive);
                                setPayOut(0);
                            }
                        } else if (sumCardPayments < roundFifteenPercent) {

                            totalPayOut = roundFifteenPercent - sumCardPayments;

                            if (isMounted) {
                                setPayOut(totalPayOut);
                                setToReceive(0);
                            }
                        } else {
                            totalPayOut = roundFifteenPercent - sumCardPayments;
                            totalReceive = sumCardPayments - roundFifteenPercent;

                            console.log('Total receive: ', totalReceive);
                            console.log('Total payout: ', totalPayOut);

                            if (isMounted) {
                                setToReceive(totalReceive);
                                setPayOut(totalPayOut);
                            }

                        }

                        setTotal(earningsTotal);
                        setInFlow(roundPercentage);
                        setOutFlow(roundFifteenPercent);
                        setCardPayments(sumCardPayments);
                        setCashPayments(sumCashPayments);

                        allBookings.sort(
                            (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                        );

                        if (isMounted) {
                            setData(allBookings); // Set the filtered data to the state
                        }
                    }
                } catch (error) {
                    toast.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDataByWeek();
        return () => {
            isMounted = false;
        };
    }, [currentUser, selectedFilter]);

    // Calendar filtering
    useEffect(() => {
        let isMounted = true;
        let queryStartDate;
        let queryEndDate;
        let earningsTotal = 0;
        let sumCardPayments = 0;
        let sumCashPayments = 0;
        let totalPayOut = 0;
        let totalReceive = 0;

        const fetchDataByDay = async () => {
            if (currentUser && isMounted) {
                try {
                    const userRef = doc(db, "Companies", currentUser.uid);
                    const docs = await getDoc(userRef);
                    setLoading(true);

                    const selectedDateFormatted = selectedDate.toISOString().slice(0, 23).replace('T', ' ');

                    queryStartDate = new Date(selectedDateFormatted);
                    queryStartDate.setHours(0, 0, 0, 0);
                    queryEndDate = new Date(selectedDateFormatted);
                    // queryEndDate.setHours(23, 59, 59, 999);
                    // console.log(queryStartDate)

                    // Use queryStartDate and queryEndDate in your Firestore query
                    const earningsQuery = query(
                        collection(db, "Earnings"),
                        where("Company", "==", docs.data().company),
                        where("timeStamp", ">=", queryStartDate),
                        where("timeStamp", "<=", queryEndDate)
                    );

                    const earningsSnapshot = await getDocs(earningsQuery);
                    // const earningsData = earningsSnapshot.docs.map((doc) => doc.data());

                    // Collecting Bookings IDs
                    const bookingNumbers = earningsSnapshot.docs.map(
                        (bookingrDoc) => bookingrDoc.data().BookingID,
                    );

                    earningsSnapshot.forEach((doc) => {
                        const data = doc.data();
                        earningsTotal += parseFloat(data.Amount);
                    });

                    // Calculating 85% of the total earnings
                    const eightyFivePercent = earningsTotal * 0.85;
                    const roundPercentage = eightyFivePercent.toFixed(0);

                    // Calculating 15% of the total earnings
                    const fifteenPercent = earningsTotal * 0.15;
                    const roundFifteenPercent = fifteenPercent.toFixed(0);


                    const chunkSize = 30;
                    const bookingChunks = [];
                    for (let i = 0; i < bookingNumbers.length; i += chunkSize) {
                        const chunk = bookingNumbers.slice(i, i + chunkSize);
                        bookingChunks.push(chunk);
                    }

                    const allBookings = [];

                    for (const chunk of bookingChunks) {
                        const bookingsQuery = query(
                            collection(db, "Bookings"),
                            where("Booking Number", "in", chunk)
                        );

                        try {
                            const bookingsSnapshot = await getDocs(bookingsQuery);

                            if (!bookingsSnapshot.empty) {
                                const bookings = bookingsSnapshot.docs.map((bookingDoc) => bookingDoc.data());

                                // Separate amounts based on payment method and calculate the sum
                                const cardPayments = bookings.filter((booking) => booking["Payment Method"] === "Card");
                                const cashPayments = bookings.filter((booking) => booking["Payment Method"] === "Cash on Delivery");

                                sumCardPayments += cardPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);
                                sumCashPayments += cashPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);

                                allBookings.push(...bookings);
                            } else {
                                console.log("No bookings found with the given Booking Numbers in this chunk.");
                            }
                        } catch (error) {
                            console.error("Error fetching bookings:", error);
                            toast.error("Error fetching bookings. Please check the console for details.");
                        }
                    }

                    if (sumCardPayments > roundFifteenPercent) {

                        totalReceive = sumCardPayments - roundFifteenPercent;

                        if (isMounted) {
                            setToReceive(totalReceive);
                            setPayOut(0);
                        }
                    } else if (sumCardPayments < roundFifteenPercent) {

                        totalPayOut = roundFifteenPercent - sumCardPayments;

                        if (isMounted) {
                            setPayOut(totalPayOut);
                            setToReceive(0);
                        }
                    } else {
                        totalPayOut = roundFifteenPercent - sumCardPayments;
                        totalReceive = sumCardPayments - roundFifteenPercent;

                        console.log('Total receive: ', totalReceive);
                        console.log('Total payout: ', totalPayOut);

                        if (isMounted) {
                            setToReceive(totalReceive);
                            setPayOut(totalPayOut);
                        }

                    }

                    setTotal(earningsTotal);
                    setInFlow(roundPercentage);
                    setOutFlow(roundFifteenPercent);
                    setCardPayments(sumCardPayments);
                    setCashPayments(sumCashPayments);
                    allBookings.sort(
                        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                    );

                    if (isMounted) {
                        setData(allBookings); // Set the filtered data to the state
                    }

                } catch (error) {
                    toast.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDataByDay();
        return () => {
            isMounted = false;
        };
    }, [currentUser, selectedDate]);



    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                    <div className="date-picker-container">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="custom-datepicker"
                        />
                    </div>

                    <div className="filter-select-container">
                        <select
                            className="chart-select"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="7">Last Week</option>
                            <option value="1">Two Weeks Ago</option>
                            <option value="2">Three Weeks Ago</option>
                            <option value="3">Four Weeks Ago</option>
                        </select>
                    </div>
                </div>

                <div className="total-top">
                    <div className="total-cal">
                        <h5>Total: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(total)
                            .replace(".00", "")}</h5>

                        <h5>In-Flow: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(inFlow)
                            .replace(".00", "")}</h5>

                        <h5>Out-Flow: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(outFlow)
                            .replace(".00", "")}</h5>
                    </div>

                    <br />

                    <div className="total-cal">
                        <h5>Card Payments: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(cardPayments)
                            .replace(".00", "")}</h5>

                        <h5>Cash Payment: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(cashPayments)
                            .replace(".00", "")}</h5>


                        <p>To Pay-Out: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(payOut)
                            .replace(".00", "")}
                        </p>

                        <p>To Receive: {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(toReceive)
                            .replace(".00", "")}
                        </p>
                    </div>
                </div>

                {!loading ? (<div className="b-table">
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
                                    <TableCell className="tableCell" width={80}>
                                        Date
                                    </TableCell>
                                    <TableCell className="tableCell" width={50}>
                                        Amount
                                    </TableCell>
                                    <TableCell className="tableCell" width={20}>
                                        Payment Method
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row["Booking Number"]}>
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

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                    </div>)}
            </div>
        </div>
    );
};

export default CompanyEarnings;
