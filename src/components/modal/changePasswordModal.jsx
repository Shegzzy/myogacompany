import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { auth, db } from '../../firebase';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { InputGroup } from 'react-bootstrap';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Snakbar from '../snackbar/Snakbar';


function ChangePasswordModal() {
    const [userID, setUserID] = useState('');
    const [item, setItems] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleCloseChangePassword = () => {
        setError('');
        setOldPassword('');
        setNewPassword('');
        setShowChangePassword(false)
    };
    const handleShowChangePassword = () => {
        setShowChangePassword(true);
    }

    useEffect(() => {
        const fetchID = () => {
            const items = JSON.parse(localStorage.getItem('user'));
            if (items) {
                setItems(items);
                setUserID(items.uid);

            }
        }

        fetchID();
    }, [])

    const handleChangePassword = () => {
        setLoading(true);
        // const user = auth.currentUser;
        // console.log(user.email);
        // console.log(oldPassword)
        if (currentUser) {
            // Reauthenticate the user with their old password
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            reauthenticateWithCredential(currentUser, credential)
                .then(() => {
                    // Update the user's password
                    updatePassword(currentUser, newPassword)
                        .then(() => {
                            // Password updated successfully
                            setLoading(false);
                            setMsg("Password updated successfully. Please login!!");
                            setType("success");
                            snackbarRef.current.show();
                            handleCloseChangePassword();
                            handleSignOut();

                        })
                        .catch((error) => {
                            // Handle password update error
                            // setError(error);
                            // console.error('Error updating password:', error);
                            setLoading(false);
                            handleChangePassword();
                            setMsg("Password update failed. Please try again");
                            setType("error");
                            snackbarRef.current.show();
                        });
                })
                .catch((error) => {
                    // Handle reauthentication error
                    setError("Incorrect old password");
                    setLoading(false);
                    console.error('Error reauthenticating user:', error);
                });
        } else {
            // User not signed in
            setError('User not signed in');
        }
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                localStorage.removeItem("user");
                currentUser({ type: "LOGOUT" });
                navigate("/login");
            })
            .catch((error) => {
                // An error happened.
                console.log(error);
                // setMsg(error.message);
                // setType("error");
                // snackbarRef.current.show();
            });
    };

    return (
        <>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />

            <button className="button" onClick={handleShowChangePassword} >Change Password</button>

            {/* change password modal */}
            <Modal
                show={showChangePassword}
                onHide={handleCloseChangePassword}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleChangePassword();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">


                            <Form.Label>Old Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder='enter old password'
                                    required
                                />
                                <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </InputGroup>

                            <Form.Label>New Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='enter new password'
                                    required
                                />
                                <Button variant="outline-secondary" onClick={toggleNewPasswordVisibility}>
                                    {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </InputGroup>
                            {error && (<p style={{ color: 'red' }}>{error}</p>)}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseChangePassword}>
                        Close
                    </Button>
                    <button
                        form='verifyForm'
                        type="submit"
                        className={loading ? "spinner-btn" : "primaryBtn text-purple-600"}
                        disabled={loading}
                    >
                        <span className={loading ? "hidden" : ""}>Submit</span>
                        <span className={loading ? "" : "hidden"}>
                            <div className="spinner"></div>
                        </span>
                        {loading && <span>Submitting...</span>}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ChangePasswordModal