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

const Datatable = () => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);

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
            setData(list);
          },
          (error) => {
            toast.error(error);
          }
        );
        return () => unsub();
      }
    };

    fetchData();
  }, [currentUser]);

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

  const handleView = async (id) => {
    try {
      const docRef = doc(db, "Drivers", id);
      const docSnap = await getDoc(docRef);
      const user = { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
      toast.error(err);
    }
  };

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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/${params.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton" onClick={() => handleView(params.id)}>
                View
              </div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDeleteConfirmation(params.row.id)}
            >
              Delete
            </div>

            {params.row.Verified === "1" ? (
              <div className="verifiedButton">Verified</div>
            ) : (
              <div
                className="verifyButton"
                onClick={() => handleVerify(params.row.id)}
              >
                Verify
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
    </div>
  );
};

export default Datatable;
