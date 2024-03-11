import "./editAdmin.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const EdittableAdmin = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [files, setFiles] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [utilityBill, setUtilityBill] = useState([]);
  const [cac, setCAC] = useState([]);
  const [courierLicense, setCourierLicense] = useState([]);
  const [amac, setAmac] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, "Companies", id);
        const snapshot = await getDoc(userRef);
        setUserProfile(snapshot.data());
      } catch (error) {
        toast.error("Error fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Upload new photo to Firebase Storage
      let photoUrl = userProfile["Profile Photo"] || "";
      let docUrls = userProfile["documents"] || [];
      let utilityBillUrls = userProfile["utilityBill"] || [];
      let cacUrls = userProfile["cacDocuments"] || [];
      let courierLicenseUrls = userProfile["courierLicense"] || [];
      let amacUrls = userProfile["amacDocuments"] || [];

      if (file) {
        const storageRef = ref(storage, file.name);
        const snapshot = await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      if (files.length > 0) {
        const docUrlsPromises = files.map(async (docFile) => {
          const storageRef = ref(storage, docFile.name);
          const snapshot = await uploadBytes(storageRef, docFile);
          return await getDownloadURL(snapshot.ref);
        });
        docUrls = await Promise.all(docUrlsPromises);
      }

      if (utilityBill.length > 0) {
        const docUrlsPromises = utilityBill.map(async (docFile) => {
          const storageRef = ref(storage, docFile.name);
          const snapshot = await uploadBytes(storageRef, docFile);
          return await getDownloadURL(snapshot.ref);
        });
        utilityBillUrls = await Promise.all(docUrlsPromises);
      }

      if (cac.length > 0) {
        const docUrlsPromises = cac.map(async (docFile) => {
          const storageRef = ref(storage, docFile.name);
          const snapshot = await uploadBytes(storageRef, docFile);
          return await getDownloadURL(snapshot.ref);
        });
        cacUrls = await Promise.all(docUrlsPromises);
      }

      if (courierLicense.length > 0) {
        const docUrlsPromises = courierLicense.map(async (docFile) => {
          const storageRef = ref(storage, docFile.name);
          const snapshot = await uploadBytes(storageRef, docFile);
          return await getDownloadURL(snapshot.ref);
        });
        courierLicenseUrls = await Promise.all(docUrlsPromises);
      }

      if (amac.length > 0) {
        const docUrlsPromises = amac.map(async (docFile) => {
          const storageRef = ref(storage, docFile.name);
          const snapshot = await uploadBytes(storageRef, docFile);
          return await getDownloadURL(snapshot.ref);
        });
        amacUrls = await Promise.all(docUrlsPromises);
      }

      // Update user profile with new photo URL
      const updatedProfile = {
        ...userProfile,
        "Profile Photo": photoUrl,
        documents: docUrls,
        utilityBill: utilityBillUrls,
        cacDocuments: cacUrls,
        courierLicense: courierLicenseUrls,
        amacDocuments: amacUrls,
      };

      const userRef = doc(db, "Companies", id);
      await updateDoc(userRef, updatedProfile);

      toast.success("Profile Updated");
    } catch (error) {
      toast.error(error.message);
    }

    navigate(-1);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">

        <Navbar />

        <div className="top">
          <h1>{title}</h1>
        </div>

        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : userProfile?.["Profile Photo"] ||
                  "https://cdn-icons-png.flaticon.com/512/3033/3033143.png"
              }
              alt="User Avatar"
            />
          </div>

          <div className="right">
            <form onSubmit={handleFormSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "file" ? (
                    <input
                      id={input.id}
                      type="file"
                      onChange={(e) => {
                        const selectedFiles = e.target.files;
                        switch (input.id) {
                          case "documents":
                            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
                            break;
                          case "utilityBill":
                            setUtilityBill(Array.from(selectedFiles));
                            break;
                          case "cacDocuments":
                            setCAC(Array.from(selectedFiles));
                            break;
                          case "courierLicense":
                            setCourierLicense(Array.from(selectedFiles));
                            break;
                          case "amacDocuments":
                            setAmac(Array.from(selectedFiles));
                            break;
                          default:
                            break;
                        }
                      }}
                      multiple
                    />
                  ) : (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      value={userProfile?.[input.id] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUserProfile((prevProfile) => ({
                          ...prevProfile,
                          [input.id]: value,
                        }));
                      }}
                      disabled={input.disabled}
                    />
                  )}{" "}
                </div>
              ))}

              <button
                type="submit"
                className={loading ? "spinner-btn" : ""}
                disabled={loading}
              >
                <span className={loading ? "hidden" : ""}>Update</span>
                <span className={loading ? "" : "hidden"}>
                  <div className="spinner"></div>
                </span>
                {loading && <span>Updating...</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdittableAdmin;
