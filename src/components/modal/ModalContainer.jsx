import './modalContainer.scss';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OrderStatus from '../status/OrderStatus';

function ModalContainer(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div onClick={handleShow} className="assignButton">Track</div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title >Booking Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-wrap justify-center">
                        <OrderStatus id={props.id} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>Okay</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalContainer