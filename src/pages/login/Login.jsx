import "./login.scss";
import logo from "../../components/assets/images/myogaIcon2.png";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "react-bootstrap";

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
// import { Button } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { DatePicker } from "rsuite";
// import { gridColumnVisibilityModelSelector } from "@mui/x-data-grid";


const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [company, setcompany] = useState("");
  const [date, setdate] = useState("");
  const [regnumber, setregNum] = useState("");
  const [location, setloction] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [bank, setBank] = useState("");
  const [account, setaccount] = useState("");
  const [accountName, setaccountName] = useState("");
  const [utilityBill, setUtilityBill] = useState([]);
  const [cac, setCAC] = useState([]);
  const [courierLicense, setCourierLicense] = useState([]);
  const [amac, setAmac] = useState([]);
  const [documents, setdocuments] = useState([]);

  const [error, seterror] = useState(false);
  const [Errormsg, seterrormsg] = useState('');
  const [newUser, setnewUser] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);


  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // company name field validator function
  const handleCompanyInputChange = (e) => {
    const inputCompany = e.target.value;
    const validCompanyRegex = /^[a-zA-Z0-9\s'-]+$/;
    if (inputCompany && !validCompanyRegex.test(inputCompany)) {
      setCompanyError(
        "Invalid company name. Please enter only letters, number, spaces, and special characters."
      );
    } else if (inputCompany && inputCompany.length > 150) {
      setCompanyError(
        "Company name is too long. Please limit to 150 characters."
      );
    } else {
      setcompany(inputCompany);
      setCompanyError("");
    }
  };

  // Form submission
  const handleAuthentication = async (e) => {
    e.preventDefault();
    setLoading(true);
    seterror(false);

    if (newUser) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        const documentsUrls = await Promise.all(
          documents.map(async (file) => {
            const storageRef = ref(storage, "company_documents/" + file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            return await getDownloadURL(uploadTask.ref);
          })
        );


        const cacDocumentsUrls = await Promise.all(
          cac.map(async (file) => {
            const storageRef = ref(storage, "company_documents/" + file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            return await getDownloadURL(uploadTask.ref);
          })
        );

        const utilityDocumentsUrls = await Promise.all(
          utilityBill.map(async (file) => {
            const storageRef = ref(storage, "company_documents/" + file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            return await getDownloadURL(uploadTask.ref);
          })
        );

        const courierLicenseDocumentsUrls = await Promise.all(
          courierLicense.map(async (file) => {
            const storageRef = ref(storage, "company_documents/" + file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            return await getDownloadURL(uploadTask.ref);
          })
        );

        const amacDocumentsUrls = await Promise.all(
          amac.map(async (file) => {
            const storageRef = ref(storage, "company_documents/" + file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            return await getDownloadURL(uploadTask.ref);
          })
        );

        await setDoc(doc(db, "Companies", user.uid), {
          email: email,
          password: password,
          company: company,
          date: date,
          regnumber: regnumber,
          location: location,
          address: address,
          phone: phone,
          bank: bank,
          account: account,
          accountName: accountName,
          documents: documentsUrls || [],
          cacDocuments: cacDocumentsUrls || [],
          utilityBill: utilityDocumentsUrls || [],
          courierLicense: courierLicenseDocumentsUrls || [],
          amacDocuments: amacDocumentsUrls || [],
          timeStamp: serverTimestamp(),
        });

        navigate("/");

      } catch (error) {
        seterror(true);
        const errormsg = error.message;
        console.log(errormsg);
        seterrormsg(errormsg);
        setLoading(false);
      }
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

          if (isMounted.current) {
            navigate("/");
          }

        } else {
          seterror(true);
          const errormsg = Errormsg;
          seterrormsg(errormsg);
        }
      } catch (error) {
        console.log(error)
        toast.error(error);
        const errormsg = error.message;
        console.log(errormsg);

        seterrormsg(errormsg);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
      setLoading(false);
      seterror(false);
    };
  }, []);


  return (
    <>
      <div className="login-body">
        <div className="myoga-div">
          <img className="myoga-image" src={logo} alt="" />
        </div>
        <div className="login-page">
          <header>
            <span>MyOga Company Admin</span>
          </header>

          <img className="logo" src={logo} alt="Logo" />

          <form onSubmit={handleAuthentication}>
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
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />

              {showPassword ? <BsEyeSlash color="white" size={20} onClick={togglePasswordVisibility} /> : <BsEye color="white" size={20} onClick={togglePasswordVisibility} />}
            </div>

            {newUser && (
              <>
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

                <div className="date">
                  {/* <input
                    onChange={(e) => setdate(e.target.value)}
                    id="date"
                    type="date"
                    placeholder="Date of Establishment"
                    color="white"
                    required
                  /> */}
                  <DatePicker
                    selected={date}
                    onChange={(date) => setdate(date)}
                    placeholder="Date of establishment"
                    className="custom_datepicker" />
                </div>

                <div className="registration">
                  <input
                    onChange={(e) => setregNum(e.target.value)}
                    id="reg"
                    type="text"
                    placeholder="Reg. Number"
                    required
                  />
                </div>

                <div className="locations">
                  <input
                    onChange={(e) => setloction(e.target.value)}
                    id="location"
                    type="text"
                    placeholder="Location"
                    required
                  />
                </div>

                <div className="addresss">
                  <input
                    onChange={(e) => setaddress(e.target.value)}
                    id="address"
                    type="text"
                    placeholder="Address"
                    required
                  />
                </div>

                <div className="phone">
                  <input
                    onChange={(e) => setphone(e.target.value)}
                    id="phone"
                    type="text"
                    placeholder="Phone"
                    required
                  />
                </div>

                <div className="bank">
                  <input
                    onChange={(e) => setBank(e.target.value)}
                    id="bank"
                    type="text"
                    placeholder="Bank Name"
                    required
                  />
                </div>

                <div className="account">
                  <input
                    onChange={(e) => setaccount(e.target.value)}
                    id="account"
                    type="text"
                    placeholder="Account Number"
                    required
                  />
                </div>

                <div className="account">
                  <input
                    onChange={(e) => setaccountName(e.target.value)}
                    id="accountNumber"
                    type="text"
                    placeholder="Account Name"
                    required
                  />
                </div>

                <div className="document">
                  <label className="field-label">
                    ID Card
                  </label>

                  <input
                    onChange={(e) => setdocuments([...documents, ...e.target.files])}
                    id="documents"
                    type="file"
                    multiple
                    placeholder="Documents"
                    required
                  />
                </div>

                <div className="document">
                  <label className="field-label">
                    CAC Document
                  </label>
                  <input
                    onChange={(e) => setCAC([...cac, ...e.target.files])}
                    id="cac"
                    type="file"
                    placeholder="CAC Documents"
                    required
                  />
                </div>


                <div className="document">
                  <label className="field-label">
                    Utility Bill
                    <span> (proof of address)</span>
                  </label>
                  <input
                    onChange={(e) => setUtilityBill([...utilityBill, ...e.target.files])}
                    id="utilityBill"
                    type="file"
                    placeholder="Utility Bill"
                    required
                  />
                </div>

                <div className="document">
                  <label className="field-label">
                    Courier License
                    <span> (optional)</span>
                  </label>
                  <input
                    onChange={(e) => setCourierLicense([...courierLicense, ...e.target.files])}
                    id="courierLicense"
                    type="file"
                    placeholder="Courier License"
                  />
                </div>

                <div className="document">
                  <label className="field-label">
                    AMAC
                    <span> (optional)</span>
                  </label>
                  <input
                    onChange={(e) => setAmac([...amac, ...e.target.files])}
                    id="amac"
                    type="file"
                    placeholder="AMAC Documents"
                  />
                </div>
              </>
            )}

            {error && <span className="error">Process Failed. Invalid email or password</span>}
            {/* {error && <span className="error">{Errormsg}</span>} */}

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
                    setpassword('');
                    setemail('');
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
      </div>
    </>
  );
};

export default Login;
