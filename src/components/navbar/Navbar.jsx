import "./navbar.scss";
import { useState, useContext, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");
  //const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const userId = auth.currentUser?.uid;
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
          console.log("No such document!");
        }
      }
    };

    return fetchUser();
  }, [currentUser]);

  useEffect(() => {
    // Fetch the data from Firestore      if (currentUser) {
    const fetchData = async () => {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        const unsubscribe = onSnapshot(
          query(
            collection(db, "Drivers"),
            where("Company", "==", docs.data().company)
          ),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Filter the items array based on the search term
            const filtered = data.filter((driver) => {
              const name = driver.FullName?.toLowerCase() ?? "";
              return name.includes(searchTerm?.toLowerCase() ?? "");
            });
            setItems(data);
            setFilteredItems(filtered);
          }
        );

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      }
    };

    fetchData();
  }, [searchTerm, currentUser]);

  const handleSearch = () => {
    const filtered = items.filter((driver) => {
      const name = driver.FullName?.toLowerCase() ?? "";
      return name.includes(searchTerm?.toLowerCase() ?? "");
    });
    setFilteredItems(filtered);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
          />

          <SearchOutlinedIcon style={{ cursor: "pointer" }} />
          {searchTerm !== "" && filteredItems.length > 0 && (
            <div className="dropdown">
              {filteredItems.map((driver) => (
                <Link
                  key={driver.id}
                  to={`/users/${driver.id}`}
                  className="dropdown-item"
                >
                  {driver.FullName}
                </Link>
              ))}
            </div>
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
