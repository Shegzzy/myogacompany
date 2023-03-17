import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Edittable = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [files, setFiles] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, "Drivers", id);
        const snapshot = await getDoc(userRef);
        setUserProfile(snapshot.data());
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload new photo to Firebase Storage
      let photoUrl = userProfile["Profile Photo"];
      let docUrls = userProfile["Documents"] || [];
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

      // Update user profile with new photo URL
      const updatedProfile = {
        ...userProfile,
        "Profile Photo": photoUrl,
        Documents: docUrls,
      };
      const userRef = doc(db, "Drivers", id);
      await updateDoc(userRef, updatedProfile);
      toast.success("Driver updated");
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
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
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
                  {input.type === "select" ? (
                    <select
                      id={input.id}
                      value={userProfile?.[input.id] || input.options[0].value}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUserProfile((prevProfile) => ({
                          ...prevProfile,
                          [input.id]: value,
                        }));
                        if (input.id === "Verified") {
                          const userRef = doc(db, "Drivers", id);
                          updateDoc(userRef, { Verified: value });
                        }
                      }}
                    >
                      {input.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : input.type === "file" ? (
                    <input
                      id={input.id}
                      type="file"
                      onChange={(e) => setFiles([...files, ...e.target.files])}
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

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edittable;
