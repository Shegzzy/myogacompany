import "./profile.scss";
import { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ImageViewModal from "../../components/modal/image-view-modal";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import ChangePasswordModal from "../../components/modal/changePasswordModal";


const AdminProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const [companyRating, setCompanyRating] = useState(0);


  useEffect(() => {
    const fetchUser = async () => {
      // console.log(currentUser)
      if (currentUser) {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);
        if (docs.exists) {
          const userData = docs.data() || {};
          setUser({
            ...userData,
            documents: Array.isArray(userData.documents) ? userData.documents : [],
            utilityBill: Array.isArray(userData.utilityBill) ? userData.utilityBill : [],
            cacDocuments: Array.isArray(userData.cacDocuments) ? userData.cacDocuments : [],
            courierLicense: Array.isArray(userData.courierLicense) ? userData.courierLicense : [],
            amacDocuments: Array.isArray(userData.amacDocuments) ? userData.amacDocuments : [],
          });
        } else {
          toast.error("User does not exist");
        }
      }
    };

    return fetchUser();
  }, [currentUser]);

  const fetchCompanyRatings = async () => {
    if (currentUser && isMounted) {
      try {
        const userRef = doc(db, "Companies", currentUser.uid);
        const docs = await getDoc(userRef);

        const companyId = docs.data().company;

        const driversQuery = query(
          collection(db, "Drivers"),
          where("Company", "==", companyId)
        );

        const driversSnapshot = await getDocs(driversQuery);
        const totalRiders = driversSnapshot.size;

        let totalRatings = 0;

        // Creating an array of promises to fetch Ratings for each Driver
        const ratingPromises = driversSnapshot.docs.map(async (driverDoc) => {
          const ratingsQuerySnapshot = await getDocs(
            collection(db, "Drivers", driverDoc.id, "Ratings")
          );

          let riderTotalRatings = 0;
          let riderTotalReviews = 0;

          // Iterating through the ratings and calculating the total for each rider
          ratingsQuerySnapshot.forEach((ratingDoc) => {
            const ratingData = ratingDoc.data();
            riderTotalRatings += ratingData.rating;
            riderTotalReviews++;
          });

          const riderAverageRating =
            riderTotalReviews > 0 ? riderTotalRatings / riderTotalReviews : 0;

          // console.log(`Rider ${driverDoc.id} Average Rating:`, riderAverageRating);

          // Adding rider's average rating to the total
          totalRatings += riderAverageRating;
        });

        await Promise.all(ratingPromises);

        // Calculating the overall average rating for the company
        const averageRating = totalRiders > 0 ? totalRatings / totalRiders : 0;

        setCompanyRating(averageRating);
        // console.log("Total Riders:", totalRiders);
        // console.log("Total Rating:", totalRatings);
        // console.log("Overall Average Rating:", averageRating);

      } catch (error) {
        toast.error("Error fetching data:");
      } finally {
        setIsMounted(false);
      }
    }
  };

  useEffect(() => {
    fetchCompanyRatings();
    return () => {
      setIsMounted(false);
    }
  })

  // Function to render star icons based on the average rating
  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 0; i < 5.0; i++) {
      stars.push(
        i < Math.floor(averageRating) ? (
          <AiFillStar key={i} style={{ color: averageRating < 3.0 ? 'red' : 'green' }} />
        ) : (
          <AiOutlineStar key={i} style={{ color: averageRating < 3.0 ? 'red' : 'green' }} />
        )
      );
    }
    return stars;
  };

  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImagePath(imageUrl);
    setIsModalOpen(true); // Open the modal when an image is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  if (!user) {
    return (
      <div className="single-container">
        <div className="loader">
          <div className="lds-dual-ring"></div>
          <div>Loading... </div>
        </div>
      </div>
    );
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="profile-page">
          <div className="profile-header">
            <div className="header-left">
              <div className="avatar">
                <img
                  src={
                    user["Profile Photo"] != null && user["Profile Photo"] !== ""
                      ? user["Profile Photo"]
                      : "https://cdn-icons-png.flaticon.com/512/3033/3033143.png"
                  }
                  alt="User Avatar"
                />
              </div>
              <div className="user-info">
                <div className="name">{user.company}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
            <div className="header-right">
              <Link
                to={`/admin/${currentUser.uid}`}
                style={{ textDecoration: "none" }}
              >
                <button className="button" style={{ cursor: "pointer" }}>
                  Edit Profile
                </button>
              </Link>

              <ChangePasswordModal />
            </div>
          </div>
          <div className="profile-body">
            <div className="card-container">
              <Card className="card">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Contact Info
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Phone:</strong> {user.phone}
                  </Typography>

                  <Typography variant="body2" component="p">
                    <strong>Address:</strong> {user.address}
                  </Typography>

                  <Typography variant="body2" component="p">
                    <span className="itemKey"><strong>Ratings: </strong></span>
                    <span style={{ color: user.averageRating > 3.0 ? 'green' : 'red' }}>
                      {companyRating.toFixed(1)}
                    </span>
                    <span className="itemValue">
                      {renderStars(companyRating)}
                    </span>
                    {/* <strong>Rating:</strong> {companyRating.toFixed(1)} */}
                  </Typography>
                </CardContent>
              </Card>

              <Card className="card">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Company Registered Number
                  </Typography>
                  <Typography variant="body2" component="p">
                    Registered Number: {user.regnumber}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Account Name: {user.accountName || ''}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Bank Name: {user.bank || ''}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Account Number: {user.account}
                  </Typography>

                </CardContent>
              </Card>
            </div>
            <Card className="card">
              <CardContent>
                <Typography variant="body2" component="p">

                  <div className="documents-container">
                    <span className="itemKey">ID Card: </span>

                    {user.documents && user.documents.length > 0 ? (
                      user.documents.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`Company's Documents ${index + 1}`}
                            className="documents-itemImg"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{ cursor: 'pointer' }}
                          />

                          <ImageViewModal
                            title={'Company\'s Document'}
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            imagePath={selectedImagePath}
                          />
                        </div>
                      ))
                    ) : (
                      <p> No documents available.</p>
                    )}


                  </div>

                  <div className="documents-container">
                    <span className="itemKey">Utility Bill: </span>

                    {user.utilityBill && user.utilityBill.length > 0 ? (
                      user.utilityBill.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`Company's Documents ${index + 1}`}
                            className="documents-itemImg"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{ cursor: 'pointer' }}
                          />

                          <ImageViewModal
                            title={'Company\'s Document'}
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            imagePath={selectedImagePath}
                          />
                        </div>
                      ))
                    ) : (
                      <p> No documents available.</p>
                    )}


                  </div>

                  <div className="documents-container">
                    <span className="itemKey">Courier License: </span>

                    {user.courierLicense && user.courierLicense.length > 0 ? (
                      user.courierLicense.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`Company's Documents ${index + 1}`}
                            className="documents-itemImg"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{ cursor: 'pointer' }}
                          />

                          <ImageViewModal
                            title={'Company\'s Document'}
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            imagePath={selectedImagePath}
                          />
                        </div>
                      ))
                    ) : (
                      <p> No documents available.</p>
                    )}


                  </div>

                  <div className="documents-container">
                    <span className="itemKey">CAC Documents: </span>

                    {user.cacDocuments && user.cacDocuments.length > 0 ? (
                      user.cacDocuments.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`Company's Documents ${index + 1}`}
                            className="documents-itemImg"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{ cursor: 'pointer' }}
                          />

                          <ImageViewModal
                            title={'Company\'s Document'}
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            imagePath={selectedImagePath}
                          />
                        </div>
                      ))
                    ) : (
                      <p> No documents available.</p>
                    )}


                  </div>

                  <div className="documents-container">
                    <span className="itemKey">AMAC Documents: </span>

                    {user.amacDocuments && user.amacDocuments.length > 0 ? (
                      user.amacDocuments.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`Company's Documents ${index + 1}`}
                            className="documents-itemImg"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{ cursor: 'pointer' }}
                          />

                          <ImageViewModal
                            title={'Company\'s Document'}
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            imagePath={selectedImagePath}
                          />
                        </div>
                      ))
                    ) : (
                      <p> No documents available.</p>
                    )}


                  </div>
                </Typography>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminProfile;
