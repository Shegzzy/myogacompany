import "./login.scss";
import logo from "../../components/assets/images/myogaIcon2.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import { auth, db, storage } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [company, setcompany] = useState("");
  const [date, setdate] = useState("");
  const [regnumber, setregNum] = useState("");
  const [location, setloction] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [documents, setdocuments] = useState([]);

  const [error, seterror] = useState(false);
  const [Errormsg, seterrormsg] = useState(false);
  const [newUser, setnewUser] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleFileInputChange = (e) => {
    const fileList = e.target.files;
    const fileArray = Array.from(fileList).map((file) =>
      URL.createObjectURL(file)
    );
    setdocuments(fileArray);
  };

  const handleCompanyInputChange = (e) => {
    const inputCompany = e.target.value;
    const validCompanyRegex = /^[a-zA-Z0-9\s'-]+$/; // Only allow letters, spaces, and special characters like hyphens or apostrophes
    if (inputCompany && !validCompanyRegex.test(inputCompany)) {
      setCompanyError(
        "Invalid company name. Please enter only letters, number, spaces, and special characters."
      );
    } else if (inputCompany && inputCompany.length > 50) {
      setCompanyError(
        "Company name is too long. Please limit to 50 characters."
      );
    } else {
      setcompany(inputCompany);
      setCompanyError("");
    }
  };

  useEffect(() => {
    const uploadDocuments = async () => {
      const promises = documents.map((file) => {
        const storageRef = ref(storage, "company_documents/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return uploadTask;
      });

      const snapshots = await Promise.all(promises);

      const downloadURLs = await Promise.all(
        snapshots.map((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
      );

      setdocuments((prev) => ({ ...prev, Documents: downloadURLs }));
    };
    documents.length > 0 && uploadDocuments();
  }, [documents]);

  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    seterror(false);

    if (newUser) {
      await createUserWithEmailAndPassword(auth, email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "Companies", user.uid), {
        email: email,
        password: password,
        company: company,
        date: date,
        regnumber: regnumber,
        location: location,
        address: address,
        phone: phone,
        documents: documents || [],
        timeStamp: serverTimestamp(),
      }).catch((error) => {
        seterror(true);
        const errormsg = error.message;
        seterrormsg(errormsg);
      });
      navigate("/");
    } else {
      try {
        // Query the Companies collection to check if the email and password are valid
        const companiesCollection = collection(db, "Companies");
        const q = query(
          companiesCollection,
          where("email", "==", email),
          where("password", "==", password)
        );
        const querySnapshot = await getDocs(q);

        // If the query returns a document, the email and password are valid
        if (!querySnapshot.empty) {
          // Sign in with the email and password
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          // Update the state to indicate that the user is logged in
          dispatch({ type: "LOGIN", payload: user });

          // Navigate to the dashboard
          navigate("/");
        } else {
          // If the query doesn't return a document, the email and password are invalid
          seterror(true);
          const errormsg = Errormsg;
          seterrormsg(errormsg);
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <div className="login-page">
      <header>
        <span>MyOga Admin</span>
      </header>

      <img className="logo" src={logo} alt="Logo" />

      <form onSubmit={submit}>
        <div className="email">
          <input
            onChange={(e) => setemail(e.target.value)}
            id="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>

        <div className="password">
          <input
            onChange={(e) => setpassword(e.target.value)}
            id="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        {newUser && (
          <div className="company">
            <input
              onChange={handleCompanyInputChange}
              id="company"
              type="text"
              placeholder="Company Name"
              required
            />
            {companyError && <span className="error">{companyError}</span>}
          </div>
        )}

        {newUser && (
          <div className="date">
            <input
              onChange={(e) => setdate(e.target.value)}
              id="date"
              type="date"
              placeholder="Date of Establishment"
              required
            />
          </div>
        )}

        {newUser && (
          <div className="registration">
            <input
              onChange={(e) => setregNum(e.target.value)}
              id="reg"
              type="text"
              placeholder="Reg. Number"
              required
            />
          </div>
        )}

        {newUser && (
          <div className="location">
            <input
              onChange={(e) => setloction(e.target.value)}
              id="location"
              type="text"
              placeholder="Location"
              required
            />
          </div>
        )}

        {newUser && (
          <div className="addresss">
            <input
              onChange={(e) => setaddress(e.target.value)}
              id="address"
              type="text"
              placeholder="Address"
              required
            />
          </div>
        )}

        {newUser && (
          <div className="phone">
            <input
              onChange={(e) => setphone(e.target.value)}
              id="phone"
              type="text"
              placeholder="Phone"
              required
            />
          </div>
        )}

        {newUser && (
          <div className="document">
            <input
              onChange={handleFileInputChange}
              id="documents"
              type="file"
              multiple
              placeholder="Documents"
              required
            />
          </div>
        )}

        {error && <span className="error">Process Failed!!</span>}
        {error && <span className="error">{Errormsg}</span>}

        <button
          type="submit"
          className={loading ? "spinner-btn" : ""}
          disabled={loading}
        >
          <span className={loading ? "hidden" : ""}>
            {newUser ? "Sign Up" : "Login"}
          </span>
          <span className={loading ? "" : "hidden"}>
            <div className="spinner"></div>
          </span>
          {loading && <span>Signing In...</span>}
        </button>

        {newUser ? (
          <span className="user-stat">
            Already have an account?{" "}
            <b
              onClick={() => {
                setnewUser(false);
                seterror(false);
              }}
            >
              {" "}
              Log in
            </b>
          </span>
        ) : (
          <span className="user-stat">
            Don't have an account?{" "}
            <b
              onClick={() => {
                setnewUser(true);
                seterror(false);
              }}
            >
              {" "}
              Sign Up
            </b>
          </span>
        )}
      </form>
    </div>
  );
};

export default Login;
