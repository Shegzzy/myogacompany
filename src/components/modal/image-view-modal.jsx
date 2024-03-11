import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageViewModal = ({ show, onHide, imagePath, title }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={imagePath} alt="Rider's documents" style={{ width: '100%' }} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageViewModal;