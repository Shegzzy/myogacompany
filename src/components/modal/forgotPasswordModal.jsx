import { Button, Modal } from "react-bootstrap";
import Snakbar from "../snackbar/Snakbar";
import { useRef, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Form from 'react-bootstrap/Form';

function ForgotPasswordModal() {

    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");


    const handleClose = () => {
        setEmail('');
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const handlesResetPassword = async () => {
        // console.log(email);
        // let roleEmail = props.email;

        try {
            setLoadingReset(true);
            const auth = getAuth();
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    // console.log("Email sent");
                    setLoadingReset(false);
                    handleClose();
                    setMsg("A password reset link have been sent to your email");
                    setType("success");
                    snackbarRef.current.show();
                })
                .catch((error) => {
                    setLoadingReset(false);
                    setMsg("Unknown email address");
                    setType("error");
                    snackbarRef.current.show();
                    console.log(error);
                    handleClose();
                });
        } catch (error) {
            setLoadingReset(false);
            // setError('Failed to send password reset email');
            console.log(error);
        }
    };


    return (
        <>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />

            <button onClick={handleShow}>Forgot Password?</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handlesResetPassword();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">


                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email"
                                value={email}
                                placeholder="enter your email address"
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button
                        form='verifyForm'
                        type="submit"
                        className={loadingReset ? "spinner-btn" : "primaryBtn text-purple-600"}
                        disabled={loadingReset}
                    >
                        <span className={loadingReset ? "hidden" : ""}>Reset Password</span>
                        <span className={loadingReset ? "" : "hidden"}>
                            <div className="spinner"></div>
                        </span>
                        {loadingReset && <span>Resetting Password...</span>}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ForgotPasswordModal;