import "./delivery.scss";
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
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
//import { toast } from "react-toastify";
import DriverSelectionModal from "../../components/modal/modal";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Delivery = ({ title }) => {
  const [data, setData] = useState([]);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const assignDriver = async () => {
    // update the booking document in the database
    await updateDoc(doc(db, "Bookings", selectedBookingId), {
      "Driver ID": selectedDriverId,
    });

    // update the driver's status in the database
    // await updateDoc(doc(db, "Drivers", selectedDriverId), {
    //   Online: "0",
    // });

    toast.success(`Rider have been assigned to booking ${selectedBookingId}`);
    setSelectedBookingId(null);
    setSelectedDriverId(null);
  };

  const cancelDriverSelection = () => {
    setSelectedDriverId(null);
  };

  useEffect(() => {
    const fetchAvailableDrivers = async () => {
      // fetch the list of available drivers from the database
      const driversQuery = query(
        collection(db, "Drivers"),
        where("Online", "==", "1")
      );
      const driversSnapshot = await getDocs(driversQuery);
      const driversData = driversSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      // set the availableDrivers state variable to the fetched data
      setAvailableDrivers(driversData);
    };

    if (selectedBookingId) {
      fetchAvailableDrivers();
    }
  }, [selectedBookingId]);

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "Bookings"),
      where("Driver ID", "==", null)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((doc) => {
        const booking = doc.data();
        bookingsData.push({
          id: doc.id,
          ...booking,
        });
      });
      // Sort the bookingsData array in descending order by Timestamp
      bookingsData.sort((a, b) => b.Timestamp - a.Timestamp);
      setData(bookingsData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="b-table">
          {data.lenght > 0 ? (
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 700 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tableCell" width={80}>
                      Booking Number
                    </TableCell>

                    <TableCell className="tableCell" width={80}>
                      Package
                    </TableCell>

                    <TableCell className="tableCell" width={200}>
                      Customer Name
                    </TableCell>

                    <TableCell className="tableCell" width={130}>
                      Phone
                    </TableCell>

                    <TableCell className="tableCell" width={300}>
                      Pickup Location
                    </TableCell>

                    <TableCell className="tableCell" width={130}>
                      Dropoff Location
                    </TableCell>

                    <TableCell className="tableCell" width={130}>
                      Distance
                    </TableCell>

                    <TableCell className="tableCell" width={50}>
                      Amount
                    </TableCell>

                    <TableCell className="tableCell" width={130}>
                      Date
                    </TableCell>

                    <TableCell className="tableCell" width={20}>
                      Payment Method
                    </TableCell>

                    <TableCell className="tableCell" width={130}>
                      Ride Type
                    </TableCell>

                    <TableCell className="tableCell" width={200}>
                      Driver ID
                    </TableCell>

                    <TableCell className="tableCell" width={130}>
                      Status
                    </TableCell>
                    <TableCell className="tableCell" width={300}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(
                    ({
                      id,
                      "Booking Number": bookingNumber,
                      "Package Type": packageType,
                      "Customer Name": customerName,
                      "Customer Phone": customerPhone,
                      "PickUp Address": pickupAddress,
                      "DropOff Address": dropOffAddress,
                      Distance,
                      Amount,
                      "Date Created": dateCreated,
                      "Payment Method": paymentMethod,
                      "Ride Type": rideType,
                      "Driver ID": driverID,
                      Status,
                    }) => (
                      <TableRow key={id}>
                        <TableCell className="tableCell" width={100}>
                          {bookingNumber}
                        </TableCell>

                        <TableCell className="tableCell">
                          {packageType}
                        </TableCell>

                        <TableCell className="tableCell" width={200}>
                          {customerName}
                        </TableCell>

                        <TableCell className="tableCell">
                          {customerPhone}
                        </TableCell>

                        <TableCell className="tableCell" width={300}>
                          {pickupAddress}
                        </TableCell>

                        <TableCell className="tableCell" width={300}>
                          {dropOffAddress}
                        </TableCell>

                        <TableCell className="tableCell">{Distance}</TableCell>

                        <TableCell className="tableCell">{Amount}</TableCell>

                        <TableCell className="tableCell">
                          {new Date(dateCreated).toLocaleDateString("en-US")}
                        </TableCell>

                        <TableCell className="tableCell">
                          {paymentMethod}
                        </TableCell>

                        <TableCell className="tableCell">{rideType}</TableCell>

                        <TableCell className="tableCell">{driverID}</TableCell>

                        <TableCell className="tableCell">
                          <span className="status">{Status}</span>
                        </TableCell>

                        <TableCell className="tableCell" width={300}>
                          <Button
                            variant="primary"
                            onClick={() => setSelectedBookingId(id)}
                            size="sm"
                          >
                            <span>Assign</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="no-data-message">No pending orders</div>
          )}
        </div>
      </div>
      <DriverSelectionModal
        show={selectedBookingId !== null}
        onHide={() => setSelectedBookingId(null)}
        availableDrivers={availableDrivers}
        selectedDriverId={selectedDriverId}
        setSelectedDriverId={setSelectedDriverId}
        assignDriver={assignDriver}
        cancelDriverSelection={cancelDriverSelection}
      />
    </div>
  );
};

export default Delivery;
