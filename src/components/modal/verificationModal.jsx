import { Button, Modal } from "react-bootstrap";
import "./terms.scss";

const IdentificationModal = ({ isOpen, onClose, onYes, onNo, id}) => {

    return (
      <Modal
        show={isOpen}
        onHide={onClose}
        backdrop="static"
        contentLabel="Terms and Conditions"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Modal.Header closeButton>
          <Modal.Title>  
            Identify Rider
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="terms-content">
            <p><strong>Do you identify this rider as one of your riders?</strong></p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() => onYes(id)}>
                Yes
            </Button>
            <Button variant="secondary" onClick={() => onNo(id)}>
                No
            </Button>
        </Modal.Footer>
        
      </Modal>
    );
  };
  
  export default IdentificationModal;