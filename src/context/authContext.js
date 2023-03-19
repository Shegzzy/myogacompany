import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./authReducer";
import { auth } from "../firebase"; // import your firebase instance here

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: user });
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut(); // sign out the user using firebase auth
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
