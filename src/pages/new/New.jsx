import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const New = ({ inputs, title, verificationStatus }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(0);
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        console.log(docs.data().company);
        if (docs.exists) {
          setData({
            Company: docs.data().company,
          });
        } else {
          toast.error("User does not exist");
        }
      }
    };

    return fetchUser();
  }, [currentUser]);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          let progres = null;

          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadLoading(true);
          progres = progress;
          if (progres === 100) {
            setUploadLoading(false);
            setUploaded(true);
          }
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (error) => {
          toast.error("Something went wrong");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, "Profile Photo": downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  useEffect(() => {
    const uploadDocuments = async () => {
      const promises = files.map((file) => {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return uploadTask;
      });

      const snapshots = await Promise.all(promises);

      const downloadURLs = await Promise.all(
        snapshots.map((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
      );

      setData((prev) => ({ ...prev, Documents: downloadURLs }));
    };
    files.length > 0 && uploadDocuments();
  }, [files]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const handleAdd = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.Email,
        data.Password
      );
      await setDoc(doc(db, "Drivers", res.user.uid), {
        ...data,
        Documents: data.Documents || [],
        timeStamp: serverTimestamp(),
        "Date Created": Date.now().toString(),
      });
      toast.success("Rider added successfully!!");
      navigate(-1);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="new">
      <Sidebar verificationStatus = {verificationStatus}/>
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
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
            {uploadLoading ? (
              <p className="uploading-message">Uploading {parseInt(per)}%</p>
            ) : uploaded ? (
              <p className="uploaded-message">Uploaded</p>
            ) : null}
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
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
                      value={input.value}
                      onChange={handleInput}
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
                  ) :
                    (
                      <input
                        id={input.id}
                        type={input.type}
                        value={data[input.id] || input.value}
                        placeholder={input.placeholder}
                        onChange={handleInput}
                        disabled={input.id === "Company"}
                      />
                    )}
                </div>
              ))}
              {/* <button disabled={per !== null && per < 100} type="submit">
                Send
              </button> */}
              <button
                type="submit"
                className={loading ? "spinner-btn" : ""}
                disabled={loading}
              >
                <span className={loading ? "hidden" : ""}>Save</span>
                <span className={loading ? "" : "hidden"}>
                  <div className="spinner"></div>
                </span>
                {loading && <span>Saving...</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
