import "./profile.scss";
import { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        if (docs.exists) {
          setUser(docs.data());
        } else {
          toast.error("User does not exist");
        }
      }
    };

    return fetchUser();
  }, [currentUser]);

  if (!user) {
    return (
      <div className="single-container">
        <div className="loader">
          <div className="lds-dual-ring"></div>
          <div>Loading... </div>
        </div>
      </div>
    );
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="profile-page">
          <div className="profile-header">
            <div className="header-left">
              <div className="avatar">
                <img
                  src={user["Profile Photo"] || "https://picsum.photos/200"}
                  alt="User Avatar"
                />
              </div>
              <div className="user-info">
                <div className="name">{user.company}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
            <div className="header-right">
              <Link
                to={`/admin/${currentUser.uid}`}
                style={{ textDecoration: "none" }}
              >
                <button className="button" style={{ cursor: "pointer" }}>
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
          <div className="profile-body">
            <div className="card-container">
              <Card className="card">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Contact Info
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Phone:</strong> {user.phone}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Address:</strong> {user.address}
                  </Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Company Registered Number
                  </Typography>
                  <Typography variant="body2" component="p">
                    {user.regnumber}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
