import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
//import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
//import InsertChartIcon from "@mui/icons-material/InsertChart";
//import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
//import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
//import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
//import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import lightLogo from "../assets/images/myogaIcon2.png";
import { auth } from "../../firebase";
import darkLogo from "../assets/images/myogaIcon1.png";

const Sidebar = () => {
  const { dispatch: darkModeDispatch } = useContext(DarkModeContext);
  const { darkMode } = useContext(DarkModeContext);
  const { logout } = useContext(AuthContext);
  const userId = auth.currentUser?.uid;

  const logoSrc = darkMode ? lightLogo : darkLogo;

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img className="logoImg" src={logoSrc} alt="Logo" />
          </span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          {/* <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link> */}
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <LocalShippingIcon className="icon" />
              <span>Riders</span>
            </li>
          </Link>

          <Link to="/bookings" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Bookings</span>
            </li>
          </Link>

          <Link to="/delivery" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Pending Orders</span>
            </li>
          </Link>

          <p className="title">USEFUL</p>
          {/* <Link to="/bookingstatus" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Booking Status</span>
            </li>
          </Link> */}

          <Link to="/report" style={{ textDecoration: "none" }}>
            <li>
              <ContentPasteIcon className="icon" />
              <span>Reports</span>
            </li>
          </Link>

          <p className="title">USER</p>
          <Link to={`/profile/${userId}`} style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link>

          <li onClick={logout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => darkModeDispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => darkModeDispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
