import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Edittable from "./pages/edit/edit";
  import { ToastContainer} from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import Bookings from "./pages/bookings/bookings";
import Bookingstatus from "./pages/bookings status/bookingstatus";


function App() {
  const { darkMode } = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext);

  const RequiredAuth = ({children}) => {
    return currentUser ? children : <Navigate to="/login" />;
    };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
      <ToastContainer position="top-right" />
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route index element={
            <RequiredAuth>
              <Home />
            </RequiredAuth>
          } />
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
                  <Edittable inputs={userInputs} title="Update Driver"/>
                </RequiredAuth>
              }
              />

              <Route
                path="bookings"
                element={
                <RequiredAuth>
                  <Bookings title="Bookings"/>
                </RequiredAuth>
              }
              />

              <Route
                path="bookingstatus"
                element={
                <RequiredAuth>
                  <Bookingstatus title="Bookings Status"/>
                </RequiredAuth>
              }
              />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
