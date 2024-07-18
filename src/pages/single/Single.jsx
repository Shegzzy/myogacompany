import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../components/table/table.scss";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
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
  TablePagination,
  TableRow,
} from "@mui/material";
import ModalContainer from "../../components/modal/ModalContainer";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import ImageViewModal from "../../components/modal/image-view-modal";
import { format } from "date-fns";
import { DarkModeContext } from "../../context/darkModeContext";
import { DateRangePicker } from "rsuite";
// import { toast } from "react-toastify";
// import { DisabledByDefault } from "@mui/icons-material";

const Single = () => {
  const { id } = useParams();
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [diff, setDiff] = useState(null);
  const [oData, setOData] = useState([]);
  const [lWData, setLWData] = useState([]);
  const [lMData, setLData] = useState([]);
  const [mData, setMData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [riderRatings, setRiderRatings] = useState({ averageRating: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState("all");



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

  // Fetching rider's rating
  useEffect(() => {
    let isMounted = true;

    const fetchRiderRatings = async () => {
      try {
        const userRef = doc(db, "Drivers", id);
        const ratingsQuerySnapshot = await getDocs(collection(userRef, "Ratings"));

        if (isMounted && !ratingsQuerySnapshot.empty) {
          // Extract ratings from the documents
          const ratings = ratingsQuerySnapshot.docs.map((doc) => doc.data().rating);

          // Calculate average rating
          const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

          // Set the user state with the average rating
          setRiderRatings({ averageRating });
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching rider ratings:", error);
      }
    };

    fetchRiderRatings();

    return () => {
      isMounted = false;
    };
  }, [id]);


  // Calculating rider's total earnings
  useEffect(() => {
    let isMounted = true;

    const earningsQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id)
    );
    const unsubscribe = onSnapshot(earningsQuery, (snapshot) => {
      let totalAmount = 0;
      snapshot.forEach((doc) => {
        const earnings = doc.data();
        totalAmount += parseFloat(earnings.Amount);
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

    // Function for weekly and monthly earnings query
  useEffect(() => {
    let isMounted = true;
    let startOfPeriod, endOfPeriod;


    const fetchDataByWeek = async () => {
      try {
        // let bookingsData = [];
        let totalAmount = 0;

        if (selectedFilter === "all") {
          const earningsQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", id)
          );

          const bookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", id)
          );

          // const completedBookingsQuery = query(
          //   collection(db, "Bookings"),
          //   where("Driver ID", "==", id),
          //   where("Status", "==", "completed")
          // );

        // Fetch Firestore data concurrently
        const [earningsDataSnapshot, bookingsDataSnapshot] = await Promise.all([
          getDocs(earningsQuery),
          getDocs(bookingsQuery)
        ]);

        // Process earnings data into a map for quick lookup
        const earningsMap = new Map();
        earningsDataSnapshot.forEach((doc) => {
          const earnings = doc.data();
          totalAmount += parseFloat(earnings.Amount);
          earningsMap.set(earnings.BookingID, format(new Date(earnings.DateCreated), "dd/MM/yyyy"));
        });

        // Process bookings data and map earnings date
        const combinedData = [];
        bookingsDataSnapshot.forEach((doc) => {
          const booking = doc.data();
          const bookingId = doc.id;
          const bookingNumber = booking['Booking Number'];

          const earningsDate = earningsMap.get(bookingNumber) || "-"; // Use dash if no earnings date is found

          combinedData.push({
            ...booking,
            id: bookingId,
            completedDate: earningsDate
          });
        });

          if (isMounted) {
            combinedData.sort(
              (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
            );
            setData(combinedData);
            setTotalTrips(combinedData.length);
            setTotalEarnings(totalAmount);
            setCompletedTrips(earningsDataSnapshot.docs.length);
          }
        } else {
          const today = new Date();

          // Calculate the start and end dates based on the selected filter
          if (selectedFilter === "0") {
            // Today
            startOfPeriod = new Date(today);
            startOfPeriod.setHours(0, 0, 0, 0); // Start of today
            endOfPeriod = new Date(today);
            endOfPeriod.setHours(23, 59, 59, 999); // End of today
        }else if (selectedFilter === "7") {
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



          const earningsQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", id),
            where("DateCreated", ">=", startOfPeriod.toISOString()),
            where("DateCreated", "<=", endOfPeriod.toISOString())
          );

          const bookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", id),
            // where("Date Created", ">=", startOfPeriod.toISOString()),
            // where("Date Created", "<=", endOfPeriod.toISOString())
          );

          // const completedBookingsQuery = query(
          //   collection(db, "Bookings"),
          //   where("Driver ID", "==", id),
          //   where("Status", "==", "completed"),
          //   where("Date Created", ">=", startOfPeriod.toISOString()),
          //   where("Date Created", "<=", endOfPeriod.toISOString())
          // );

          // Fetch Firestore data concurrently
          const [earningsDataSnapshot, bookingsDataSnapshot] = await Promise.all([
            getDocs(earningsQuery),
            getDocs(bookingsQuery)
          ]);
  
          // Process earnings data into a map for quick lookup
          const earningsMap = new Map();
          const filteredBookingIDs = new Set();
          
          earningsDataSnapshot.forEach((doc) => {
            const earnings = doc.data();
            totalAmount += parseFloat(earnings.Amount);
            earningsMap.set(earnings.BookingID, format(new Date(earnings.DateCreated), "dd/MM/yyyy"));
            filteredBookingIDs.add(earnings.BookingID);
          });
  
          // Process bookings data and map earnings date
          const combinedData = [];
          bookingsDataSnapshot.forEach((doc) => {
            const booking = doc.data();
            const bookingId = doc.id;
            const bookingNumber = booking['Booking Number'];
  
            const earningsDate = earningsMap.get(bookingNumber) || "-";
            combinedData.push({
              ...booking,
              id: bookingId,
              completedDate: earningsDate
            });
          });


          const filteredCombinedData = combinedData.filter((booking) =>
            filteredBookingIDs.has(booking['Booking Number'])
          );
  
            if (isMounted) {
              filteredCombinedData.sort(
                (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
              );
            setData(filteredCombinedData);
            setTotalTrips(combinedData.length);
            setTotalEarnings(totalAmount);
            setCompletedTrips(earningsDataSnapshot.docs.length);
          }

        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchDataByWeek();

  }, [selectedFilter]);

  // function for date range selection queries
  useEffect(() => {
    const fetchBookingsByDateRange = async () => {
      const [startDate, endDate] = dateRange;

      const startDateFirestore = new Date(startDate).toISOString();
      const endDateFirestore = new Date(endDate).toISOString();
      try{
        const earningsQuery = query(
          collection(db, "Earnings"),
          where("Driver", "==", id)
        );

        const bookingsQuery = query(
          collection(db, "Bookings"),
          where("Driver ID", "==", id),
          where("Date Created", ">=", startDateFirestore),
          where("Date Created", "<=", endDateFirestore)
        );

        // Fetch Firestore data concurrently
        const [earningsDataSnapshot, bookingsDataSnapshot] = await Promise.all([
          getDocs(earningsQuery),
          getDocs(bookingsQuery)
        ]);

        // Process earnings data into a map for quick lookup
        const earningsMap = new Map();
        earningsDataSnapshot.forEach((doc) => {
          const earnings = doc.data();
          earningsMap.set(earnings.BookingID, format(new Date(earnings.DateCreated), "dd/MM/yyyy"));
        });

        // Process bookings data and map earnings date
        const combinedData = [];
        bookingsDataSnapshot.forEach((doc) => {
          const booking = doc.data();
          const bookingId = doc.id;
          const bookingNumber = booking['Booking Number'];

          const earningsDate = earningsMap.get(bookingNumber) || "-";
          combinedData.push({
            ...booking,
            id: bookingId,
            completedDate: earningsDate
          });
        });

        combinedData.sort(
          (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
        );

        setData(combinedData);
        setTotalTrips(bookingsDataSnapshot.docs.length);

      } catch (e){
        console.log(e);
      }
    }

    fetchBookingsByDateRange();

  }, [dateRange, id]);

  // for last week and two weeks ago earnings
  useEffect(() => {
    getData();
  });


  // for last week and two weeks ago earnings
  const getData = async () => {
    let startOfPeriod, endOfPeriod;
    let startOfTwoWeeksPeriod, endOfTwoWeeksPeriod;
    const today = new Date();

    startOfPeriod = new Date(today);
    startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
    endOfPeriod = new Date(today);
    endOfPeriod.setDate(today.getDate() - today.getDay() - 1);

    startOfTwoWeeksPeriod = new Date(today);
    startOfTwoWeeksPeriod.setDate(today.getDate() - today.getDay() - 14);
    endOfTwoWeeksPeriod = new Date(today);
    endOfTwoWeeksPeriod.setDate(today.getDate() - today.getDay() - 8);

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
      where("DateCreated", ">=", startOfPeriod.toISOString()),
      where("DateCreated", "<=", endOfPeriod.toISOString())
    );

    //Two weeks ago
    const twoWeekQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", ">=", startOfTwoWeeksPeriod.toISOString()),
      where("DateCreated", "<=", endOfTwoWeeksPeriod.toISOString())
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

  // Function to render star icons based on the average rating
  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < Math.floor(averageRating) ? (
          <AiFillStar key={i} style={{ color: averageRating < 3.0 ? 'red' : 'green' }} />
        ) : (
          <AiOutlineStar key={i} style={{ color: averageRating < 3.0 ? 'red' : 'green' }} />
        )
      );
    }
    return stars;
  };


  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // page number
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // table paginators
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // function for setting date range
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // for clearing date range
  const handleDateRangeClean = async() => {
    try {
        const earningsQuery = query(
          collection(db, "Earnings"),
          where("Driver", "==", id)
        );

        const bookingsQuery = query(
          collection(db, "Bookings"),
          where("Driver ID", "==", id)
        );

      // Fetch Firestore data concurrently
      const [earningsDataSnapshot, bookingsDataSnapshot] = await Promise.all([
        getDocs(earningsQuery),
        getDocs(bookingsQuery)
      ]);

      // Process earnings data into a map for quick lookup
      const earningsMap = new Map();
      earningsDataSnapshot.forEach((doc) => {
        const earnings = doc.data();
        earningsMap.set(earnings.BookingID, format(new Date(earnings.DateCreated), "dd/MM/yyyy"));
      });

      // Process bookings data and map earnings date
      const combinedData = [];
      bookingsDataSnapshot.forEach((doc) => {
        const booking = doc.data();
        const bookingId = doc.id;
        const bookingNumber = booking['Booking Number'];

        const earningsDate = earningsMap.get(bookingNumber) || "-";
        combinedData.push({
          ...booking,
          id: bookingId,
          completedDate: earningsDate
        });
      });

        combinedData.sort(
          (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
        );
        setData(combinedData);
        setTotalTrips(bookingsDataSnapshot.docs.length);
    } catch (e) {
      console.log(e);
    }
  }

  const switchToAllBookings = () => {
    setTimeout(() => {
        setActiveTab("all")
    })
    
    handleDateRangeClean();
  }

const switchToAllActiveBookings = () => {
    setTimeout(() => {
        setActiveTab("active")
    })

    const filteredData = data.filter((bookingNumber) => {
      const name = bookingNumber['Status']?.toLowerCase() ?? "";
      return name.includes("active" ?? "");
    });

    if (filteredData.length === 0) {
      // toast.error('No search results found.');
    }

    setData(filteredData);
  }

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

              // Rider's details
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
                  <div className="detailItem">
                    <span className="itemKey">Ratings:</span>
                    <span style={{ color: user.averageRating > 3.0 ? 'green' : 'red' }}>
                      {riderRatings.averageRating.toFixed(1)}
                    </span>
                    <span className="itemValue">
                      {renderStars(riderRatings.averageRating.toFixed(1))}
                    </span>

                  </div>
                </div>

                {/* Vehicle details */}
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

                    <img
                      src={user.Documents}
                      alt="rider doc"
                      className="itemImg"
                      onClick={handleImageClick}
                      style={{ cursor: 'pointer' }}
                    />

                    <ImageViewModal
                      title={'Rider\'s Document'}
                      show={isModalOpen}
                      onHide={handleCloseModal}
                      imagePath={user.Documents}
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
                <select
                  className="chart-select"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Total Earnings</option>
                  <option value="0">Today's Earning</option>
                  <option value="7">Last Week</option>
                  <option value="1">Two Weeks Ago</option>
                  <option value="2">Three Weeks Ago</option>
                  <option value="3">Four Weeks Ago</option>
                  <option value="30">Last Month</option>
                  <option value="60">Two Months Ago</option>
                </select>
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

                    <div className="item">
                      <div className="itemTitle">Total Trips</div>
                      <div className="itemResult positive">
                        <div className="resultAmount">
                          {totalTrips}
                        </div>
                      </div>
                    </div>

                    <div className="item">
                      <div className="itemTitle">Completed Trips</div>
                      <div className="itemResult positive">
                        <div className="resultAmount">
                          {completedTrips}
                        </div>
                      </div>
                    </div>

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
          <div className="table-navs">
            
            <h1 className={`title ${activeTab === "all" ? "active" : ""}`} onClick={switchToAllBookings}>
                All Bookings
            </h1>

            <h1 className={`title ${activeTab === "active" ? "active" : ""}`} onClick={switchToAllActiveBookings}>
                Active Bookings
            </h1>

            <DateRangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        placeholder="select date range"
                        onClean={handleDateRangeClean}
                    />
          </div>
          
          <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Booking Number</TableCell>
                  <TableCell className="tableCell">Product</TableCell>
                  <TableCell className="tableCell">Customer</TableCell>
                  <TableCell className="tableCell">Date Created</TableCell>
                  <TableCell className="tableCell">Amount</TableCell>
                  <TableCell className="tableCell">Payment Method</TableCell>
                  <TableCell className="tableCell">Distance</TableCell>
                  <TableCell className="tableCell">Pick Up</TableCell>
                  <TableCell className="tableCell">Drop Off</TableCell>
                  <TableCell className="tableCell">Status</TableCell>
                  <TableCell className="tableCell">Date Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length !== 0 ? (data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                      {format(new Date(row["Date Created"]), "dd/MM/yyyy")}
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
                    <TableCell className="tableCell">
                      {row.completedDate}
                    </TableCell>
                  </TableRow>
                ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" className="tableCell">
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
          className="tableCell"
            rowsPerPageOptions={[10, 20, 30]}
            color={darkMode ? "white" : "black"}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Single;
