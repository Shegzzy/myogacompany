import "../earnings/earnings.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
// import Snakbar from "../../components/snackbar/Snakbar";
import { AuthContext } from "../../context/authContext";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { Table } from "react-bootstrap";
// import TransactionDataTable from "../../components/datatable/transactionDatatable"

const TransactionList = ({verificationStatus}) => {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        let startOfPeriod, endOfPeriod;
        const companyId = currentUser.uid
        if (currentUser) {
            const fetchTransactionData = async () => {
                setLoading(true);
                try {
                    if (selectedFilter === "all") {
                        const querySnapshot = await getDocs(query(
                            collection(db, "Transactions"),
                            where("Company ID", "==", companyId),
                        ));
                        const transactionList = [];
                        querySnapshot.forEach((doc) => {
                            transactionList.push({ id: doc.id, ...doc.data() });
                        });

                        transactionList.sort(
                            (a, b) => new Date(b["Date Paid"]) - new Date(a["Date Paid"])
                        );
                        setTransactions(transactionList);
                    } else {
                        const today = new Date();

                        // Calculate the start and end dates based on the selected filter
                        if (selectedFilter === "7") {
                            // Last Week
                            startOfPeriod = new Date(today);
                            startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
                            startOfPeriod.setHours(0, 0, 0, 0);

                            endOfPeriod = new Date(today);
                            endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
                            endOfPeriod.setHours(23, 59, 59, 999);
                        } else if (selectedFilter === "1") {
                            // Two Weeks Ago
                            startOfPeriod = new Date(today);
                            startOfPeriod.setDate(today.getDate() - today.getDay() - 14);
                            startOfPeriod.setHours(0, 0, 0, 0);

                            endOfPeriod = new Date(today);
                            endOfPeriod.setDate(today.getDate() - today.getDay() - 8);
                            endOfPeriod.setHours(23, 59, 59, 999);
                        } else if (selectedFilter === "2") {
                            // Three Weeks Ago
                            startOfPeriod = new Date(today);
                            startOfPeriod.setDate(today.getDate() - today.getDay() - 21);
                            startOfPeriod.setHours(0, 0, 0, 0);

                            endOfPeriod = new Date(today);
                            endOfPeriod.setDate(today.getDate() - today.getDay() - 15);
                            endOfPeriod.setHours(23, 59, 59, 999);
                        } else if (selectedFilter === "3") {
                            // Four Weeks Ago
                            startOfPeriod = new Date(today);
                            startOfPeriod.setDate(today.getDate() - today.getDay() - 28);
                            startOfPeriod.setHours(0, 0, 0, 0);

                            endOfPeriod = new Date(today);
                            endOfPeriod.setDate(today.getDate() - today.getDay() - 22);
                            endOfPeriod.setHours(23, 59, 59, 999);
                        } else if (selectedFilter === "30") {
                            // Last Month
                            startOfPeriod = new Date(today);
                            startOfPeriod.setMonth(today.getMonth() - 1, 1);
                            startOfPeriod.setHours(0, 0, 0, 0);

                            endOfPeriod = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0);
                            endOfPeriod.setHours(23, 59, 59, 999);
                        } else if (selectedFilter === "60") {
                            // Two Months Ago
                            startOfPeriod = new Date(today);
                            startOfPeriod.setMonth(today.getMonth() - 2, 1);
                            startOfPeriod.setHours(0, 0, 0, 0);

                            endOfPeriod = new Date(today);
                            endOfPeriod.setMonth(today.getMonth() - 1, 0);
                            endOfPeriod.setHours(23, 59, 59, 999);


                        }


                        const querySnapshot = query(
                            collection(db, "Transactions"),
                            where("Company ID", "==", companyId),
                            where("Date Paid", ">=", startOfPeriod),
                            where("Date Paid", "<=", endOfPeriod),
                        );

                        const transactionQuery = await getDocs(querySnapshot);

                        const transactionList = [];
                        transactionQuery.forEach((doc) => {
                            transactionList.push({ id: doc.id, ...doc.data() });
                        });

                        transactionList.sort(
                            (a, b) => new Date(b["Date Paid"]) - new Date(a["Date Paid"])
                        );
                        setTransactions(transactionList);

                    }
                } catch (error) {
                    console.error("Error fetching transactions:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchTransactionData();
        }

    }, [currentUser, selectedFilter]);

    return (
        <div className="new">
            <Sidebar verificationStatus = {verificationStatus}/>
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <div className="datatableTitle">
                        <h1>Transaction Table</h1>
                    </div>
                    <div className="filter-select-container">
                        <select
                            className="chart-selects"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="7">Last Week</option>
                            <option value="1">Two Weeks Ago</option>
                            <option value="3">Three Weeks Ago</option>
                        </select>
                    </div>
                </div>

                {!loading ? (<div className="b-table">
                    <TableContainer component={Paper} className="table">
                        <Table sx={{ minWidth: 780 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="tableCell" width={50}>
                                        Amount
                                    </TableCell>

                                    <TableCell className="tableCell" width={50}>
                                        From
                                    </TableCell>

                                    <TableCell className="tableCell" width={50}>
                                        To
                                    </TableCell>

                                    <TableCell className="tableCell" width={50}>
                                        Date Paid
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.length !== 0 ? (transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row["id"]}>
                                        <TableCell className="tableCell">
                                            {new Intl.NumberFormat("en-NG", {
                                                style: "currency",
                                                currency: "NGN",
                                            })
                                                .format(row["Amount"])
                                                .replace(".00", "")}
                                        </TableCell>
                                        <TableCell className="tableCell">
                                            {row["From"]}
                                        </TableCell>
                                        <TableCell className="tableCell">
                                            {row["To"]}
                                        </TableCell>
                                        <TableCell className="tableCell">
                                            {new Date(row["Date Paid"].seconds * 1000).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            No data available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30]}
                        component="div"
                        count={transactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
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
    )
}

export default TransactionList