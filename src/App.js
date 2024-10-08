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
import { useContext, useEffect, useState } from "react";
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
import TransactionList from "./pages/transactions/transactions";
import VerificationPage from "./pages/awaiting-verification/awaiting_verification";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";





function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [verificationStatus, setVerificationStatus] = useState('');

  const RequiredAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  // const uid = currentUser.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyDocRef = doc(db, "Companies", currentUser.uid);
        const companyDocSnapshot = await getDoc(companyDocRef);

        if (companyDocSnapshot.exists()) {
          // console.log(companyDocSnapshot.data().verification);
          setVerificationStatus(companyDocSnapshot.data().verification);
          // console.log(verificationStatus);
        }

      }catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [currentUser]);

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
                  <Home verificationStatus = {verificationStatus}/>
                </RequiredAuth>
              } />

            {verificationStatus &&(
            <>
              {/* Home page */}
              <Route index element={
                <RequiredAuth>
                  <Home verificationStatus = {verificationStatus}/>
                </RequiredAuth>
              } />

              {/* User page */}
              <Route path="users">
                <Route index element={
                  <RequiredAuth>
                    <List verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                } />
                <Route path="/users/:id" element={
                  <RequiredAuth>
                    <Single verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                } />
                <Route
                  path="new"
                  element={
                    <RequiredAuth>
                      <New inputs={userInputs} title="Add New Driver" verificationStatus = {verificationStatus}/>
                    </RequiredAuth>
                  }
                />
              </Route>
              <Route
                path="edit/:id"
                element={
                  <RequiredAuth>
                    <Edittable inputs={userInputs} title="Update Driver" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

                {/* Booking page */}
              <Route
                path="bookings"
                element={
                  <RequiredAuth>
                    <Bookings title="Bookings" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

              <Route path="transactions">
                <Route index element={
                  <RequiredAuth>
                    <TransactionList verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
                />
              </Route>
              
              {/* Bokking status page */}
              <Route
                path="bookingstatus"
                element={
                  <RequiredAuth>
                    <Bookingstatus title="Bookings Status" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

              {/* Reports page */}
              <Route
                path="report"
                element={
                  <RequiredAuth>
                    <Report title="Report Page" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

              {/* Earnings page */}
              <Route
                path="earnings"
                element={
                  <RequiredAuth>
                    <CompanyEarnings title="Earnings" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

              {/* Delivery Page */}
              <Route
                path="delivery"
                element={
                  <RequiredAuth>
                    <Delivery title="Pending Orders" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

              {/* Profile page */}
              <Route
                path="profile/:id"
                element={
                  <RequiredAuth>
                    <AdminProfile title="Admin Profile" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />

              {/* Admin edit page */}
              <Route path="admin/:id"
                element={
                  <RequiredAuth>
                    <EdittableAdmin inputs={companyInputs} title="Update Profile" verificationStatus = {verificationStatus}/>
                  </RequiredAuth>
                }
              />
            </>
            )}
            {/* Profile page */}
            <Route
                path="profile/:id"
                element={
                  <RequiredAuth>
                    <AdminProfile title="Admin Profile"/>
                  </RequiredAuth>
                }
              />

              {/* Admin edit page */}
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
