import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { Button } from "react-bootstrap";
import MapModal from "../modal/mapModal";

const Datatable = () => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRiderLocation, setSelectedRiderLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        const unsub = onSnapshot(
          query(
            collection(db, "Drivers"),
            where("Company", "==", docs.data().company)
          ),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            list.sort(
              (a, b) =>
                new Date(b["Date Created"]) - new Date(a["Date Created"])
            );
            setData(list);
          },
          (error) => {
            toast.error(error);
          }
        );
        return () => {
          unsub();
        };
      }
    };

    fetchData();
  }, [currentUser]);

  // Function to open the map modal and set the selected rider's location
  // const handleTrackButtonClick = async (id) => {
  //   try {
  //     const riderRef = doc(db, "Drivers", id);
  //     const riderDoc = await getDoc(riderRef);
  //     if (riderDoc.exists()) {
  //       const riderData = riderDoc.data();
  //       setSelectedRiderLocation(riderData);
  //       setShowMapModal(true);
  //       console.log("Latitude:", riderData["Driver Latitude"]);
  //       console.log("Longitude:", riderData["Driver Longitude"]);

  //     } else {
  //       toast.error("Rider data not found.");
  //     }
  //   } catch (error) {
  //     toast.error("Error fetching rider data.");
  //   }
  // };
  const handleTrackButtonClick = async (id) => {
    try {
      const riderRef = doc(db, "Drivers", id);

      // Set up a real-time listener for the rider's document
      const unsubscribe = onSnapshot(riderRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const riderData = docSnapshot.data();
          setSelectedRiderLocation(riderData);
          setShowMapModal(true);
        } else {
          toast.error("Rider data not found.");
        }
      });

      // Return a function to unsubscribe from the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    } catch (error) {
      toast.error("Error fetching rider data.");
    }
  };

  // Function to close the map modal
  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  // Function to delete rider
  const [idToDelete, setIdToDelete] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "Drivers", idToDelete));
      setData(data.filter((item) => item.id !== idToDelete));
      setIdToDelete(null);
      toast.success("Successfully deleted!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteConfirmation = (id) => {
    setIdToDelete(id);
    // Show confirmation dialog box
    if (window.confirm("Are you sure you want to delete this item?")) {
      handleDelete();
    }
  };

  // Function to view rider information
  const handleView = async (id) => {
    try {
      const docRef = doc(db, "Drivers", id);
      const docSnap = await getDoc(docRef);
      const user = { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
      toast.error(err);
    }
  };

  // Function to verify riders
  const handleVerify = async (id) => {
    try {
      const driverRef = doc(db, "Drivers", id);
      await updateDoc(driverRef, { Verified: "1" });
      setData(
        data.map((driver) => {
          if (driver.id === id) {
            return { ...driver, Verified: "1" };
          } else {
            return driver;
          }
        })
      );
      toast.success("Driver verified!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };


  // Function to unverify riders
  const handleUnVerify = async (id) => {
    try {
      const driverRef = doc(db, "Drivers", id);
      await updateDoc(driverRef, { Verified: "0" });
      setData(
        data.map((driver) => {
          if (driver.id === id) {
            return { ...driver, Verified: "0" };
          } else {
            return driver;
          }
        })
      );
      toast.success("Rider Unverified!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              className="viewButton-link"
              to={`/users/${params.id}`}
              style={{ textDecorationColor: "none", color: "white" }}
            >
              <Button
                className="viewButton"
                variant="primary"
                onClick={() => handleView(params.id)}
              >
                View
              </Button>
            </Link>

            <Button
              className="trackButton"
              onClick={() => handleTrackButtonClick(params.row.id)}
            >
              Track Rider
            </Button>

            <Button
              className="deleteButton"
              variant="danger"
              onClick={() => handleDeleteConfirmation(params.id)}
            >
              Delete
            </Button>

            {params.row.Verified === "1" ? (
              <div>
                <Button
                  className="verifyButton"
                  variant="secondary"
                  onClick={() => handleUnVerify(params.row.id)}
                >
                  Unverify
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  className="verifyButton"
                  variant="secondary"
                  onClick={() => handleVerify(params.row.id)}
                >
                  Verify
                </Button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Riders
        <Link to="/users/new" className="link">
          Add New Rider
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

      {showMapModal && (
        <MapModal
          riderLocation={selectedRiderLocation}
          show={showMapModal}
          handleClose={handleCloseMapModal}
        />
      )}

    </div>
  );
};

export default Datatable;
