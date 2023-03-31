import "./navbar.scss";
import { useState, useContext, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");
  //const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Fetch the data from Firestore
    const unsubscribe = onSnapshot(collection(db, "Drivers"), (snapshot) => {
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
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [searchTerm]);

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
                src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt=""
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
