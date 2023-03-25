import {
  Modal,
  Button,
  ListGroup,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

import "./modal.scss";

const DriverSelectionModal = ({
  show,
  onHide,
  availableDrivers,
  selectedDriverId,
  setSelectedDriverId,
  assignDriver,
  cancelDriverSelection,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ModalHeader closeButton className="close">
        <ModalTitle>Select a Rider</ModalTitle>
      </ModalHeader>
      <ModalBody className="modal-content">
        <ListGroup>
          {availableDrivers.map((driver) => (
            <ListGroup.Item
              key={driver.id}
              active={selectedDriverId === driver.id}
              onClick={() => setSelectedDriverId(driver.id)}
              className="list"
            >
              {driver.id}
              {driver["FullName"]}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={cancelDriverSelection}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={assignDriver}
          disabled={!selectedDriverId}
        >
          Assign
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DriverSelectionModal;
