import "./datatable.scss";
import "../navbar/navbar.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { Button } from "react-bootstrap";
import MapModal from "../modal/mapModal";
import ImageViewModal from "../modal/image-view-modal";
import IdentificationModal from "../modal/verificationModal";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


const Datatable = () => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRiderLocation, setSelectedRiderLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [isIdentificationModalOpen, setIsIdentificationModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImagePath(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleIdentifyClick = (id) => {
    setSelectedRiderId(id);  
    setIsIdentificationModalOpen(true);
  };

  const handleCloseIdentificationModal = () => {
    setIsIdentificationModalOpen(false);
  };


  useEffect(() => {
    setIsMounted(true);

    fetchData();

    return () => {
      setIsMounted(false);
    };
  }, [currentUser, isMounted]);

  const fetchData = async () => {
    if (currentUser && isMounted) {
      try {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        setLoading(true);

        const unsub = onSnapshot(
          query(
            collection(db, "Drivers"),
            where("Company", "==", docs.data().company)
          ),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              list.push({ id: doc.id, documents: Array.isArray(doc.data().Documents) ? doc.data().Documents : [], ...doc.data() });
            });
            list.sort(
              (a, b) =>
                new Date(b["Date Created"]) - new Date(a["Date Created"])
            );

            if (isMounted) {
              setData(list);
            }
          },
          (error) => {
            toast.error(error);
          }
        );

        return () => {
          unsub();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to open the map modal and set the selected rider's location
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
  // const [idToDelete, setIdToDelete] = useState(null);

  // const handleDelete = async () => {
  //   try {
  //     await deleteDoc(doc(db, "Drivers", idToDelete));
  //     setData(data.filter((item) => item.id !== idToDelete));
  //     setIdToDelete(null);
  //     toast.success("Successfully deleted!");
  //   } catch (err) {
  //     toast.error("Something went wrong");
  //   }
  // };

  // const handleDeleteConfirmation = (id) => {
  //   setIdToDelete(id);
  //   // Show confirmation dialog box
  //   if (window.confirm("Are you sure you want to delete this item?")) {
  //     handleDelete();
  //   }
  // };

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

  // Function to identify riders
  const handleIdentification = async (id) => {
    try {
      const driverRef = doc(db, "Drivers", id);
      
      await setDoc(driverRef, { Identification: "identified" }, { merge: true });
  
      fetchData();
      toast.success("Rider identified!");
      handleCloseIdentificationModal();
    } catch (err) {
      console.error("Error identifying rider: ", err);
      toast.error("Something went wrong");
    }
  };
  


  // Function to unidentify riders
  const handleUnidentify = async (id) => {
    try {
      const driverRef = doc(db, "Drivers", id);
      await setDoc(driverRef, { Company: "" }, { merge: true });
      
      fetchData();
      toast.success("Rider Unverified!");
      handleCloseIdentificationModal();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Function to search for riders
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchData();
    } else {
      const filteredData = data.filter((driver) => {
        const name = driver.FullName?.toLowerCase() ?? "";
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

  const actionColumn = [
    {
      field: "Identification",
      headerName: "Identification",
      width: 250,
      renderCell: (params) => {
        const value = params.value;
        const id = params.row.id;
        if (value === '' || value === undefined) {
          return <div className="cellAction">
              <span>Unidentified</span>
              <Button
              className="trackButton"
              onClick={() => handleIdentifyClick(id)}
            >
              Identify
            </Button>
            </div>;
        } else if (value === 'identified') {
          return <span>Identified</span>;
        } else {
          return null;
        }
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 300,
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

            {/* <Button
              className="deleteButton"
              variant="danger"
              onClick={() => handleDeleteConfirmation(params.id)}
            >
              Delete
            </Button> */}

            {/* {params.row.Verified === "1" ? (
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
            )} */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="search">
        <input
          type="text"
          placeholder="Search Riders..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      {/* <div className="datatableTitle">
        Riders
        <Link to="/users/new" className="link">
          Add New Rider
        </Link>
      </div> */}
      {!loading ? (<DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns(handleImageClick).concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />) : (<div className="detailItem">
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

      {showMapModal && (
        <MapModal
          riderLocation={selectedRiderLocation}
          show={showMapModal}
          handleClose={handleCloseMapModal}
        />
      )}

      <ImageViewModal
        title={"Rider's Document"}
        show={isModalOpen}
        onHide={handleCloseModal}
        imagePath={selectedImagePath}
      />

      <IdentificationModal 
        id={selectedRiderId}
        isOpen={isIdentificationModalOpen}
        onClose={handleCloseIdentificationModal}
        onYes={handleIdentification}
        onNo={handleUnidentify}
      />
    </div>
  );
};

export default Datatable;
