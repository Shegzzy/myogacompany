import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AccountBox from "./pages/login/loginIndex";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Report from "./pages/report/report";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Edittable from "./pages/edit/edit";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Bookings from "./pages/bookings/bookings";
import Bookingstatus from "./pages/bookings status/bookingstatus";
import Delivery from "./pages/delivery/delivery";
import '../node_modules/bootstrap/scss/bootstrap.scss';
import AdminProfile from "./pages/profile/profile";
import EdittableAdmin from "./pages/adminEdit/editAdmin";
import { companyInputs } from "./companyEditFormSource";
import styled from "styled-components";
import "./styles.css";
import CompanyEarnings from "./pages/earnings/earnings";





function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const RequiredAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

//  const AppContainer = styled.div`
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// ` ;


  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* <AppContainer> */}
        <BrowserRouter>
        <ToastContainer position="top-right" />
        <Routes>
          <Route path="/">
            {/* Login page */}
            <Route path="login" element={<Login />} />

            {/* Home page */}
            <Route index element={
              <RequiredAuth>
                <Home />
              </RequiredAuth>
            } />

            {/* User page */}
            <Route path="users">
              <Route index element={
                <RequiredAuth>
                  <List />
                </RequiredAuth>
              } />
              <Route path="/users/:id" element={
                <RequiredAuth>
                  <Single />
                </RequiredAuth>
              } />
              <Route
                path="new"
                element={
                  <RequiredAuth>
                    <New inputs={userInputs} title="Add New Driver" />
                  </RequiredAuth>
                }
              />
            </Route>
            <Route
              path="edit/:id"
              element={
                <RequiredAuth>
                  <Edittable inputs={userInputs} title="Update Driver" />
                </RequiredAuth>
              }
            />

              {/* Booking page */}
            <Route
              path="bookings"
              element={
                <RequiredAuth>
                  <Bookings title="Bookings" />
                </RequiredAuth>
              }
            />
            
            {/* Bokking status page */}
            <Route
              path="bookingstatus"
              element={
                <RequiredAuth>
                  <Bookingstatus title="Bookings Status" />
                </RequiredAuth>
              }
            />

            {/* Reports page */}
            <Route
              path="report"
              element={
                <RequiredAuth>
                  <Report title="Report Page" />
                </RequiredAuth>
              }
            />

            {/* Earnings page */}
            <Route
              path="earnings"
              element={
                <RequiredAuth>
                  <CompanyEarnings title="Earnings" />
                </RequiredAuth>
              }
            />

            {/* Delivery Page */}
            <Route
              path="delivery"
              element={
                <RequiredAuth>
                  <Delivery title="Pending Orders" />
                </RequiredAuth>
              }
            />

            {/* Profile page */}
            <Route
              path="profile/:id"
              element={
                <RequiredAuth>
                  <AdminProfile title="Admin Profile" />
                </RequiredAuth>
              }
            />

            {/* Admin page */}
            <Route path="admin/:id"
              element={
                <RequiredAuth>
                  <EdittableAdmin inputs={companyInputs} title="Update Profile" />
                </RequiredAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* </AppContainer> */}
    </div>
  );
}

export default App;
