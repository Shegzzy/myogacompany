import "./navbar.scss";
import { useState, useContext, useEffect } from "react";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  const userId = auth.currentUser?.uid;
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  const fetchUser = async () => {
    try {
      if (currentUser && isMounted) {
        // console.log(currentUser.uid);
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);

        if (docs.exists && isMounted) {
          setUser(docs.data());
          // console.log(docs.data());
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    fetchUser();

    return () => {
      setIsMounted(false);
    };
  }, [currentUser]);


  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          {user && user.company ? (
            <h4>{user.company}</h4>
          ) : (
            <p>Loading company information...</p>
          )}
        </div>

        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <Link to={`/profile/${userId}`}>
              <img
                src={
                  user
                    ? user["Profile Photo"]
                    : "https://cdn-icons-png.flaticon.com/512/3033/3033143.png"
                }
                alt="User Avatar"
                className="avatar"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
