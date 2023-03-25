import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Table,
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
        <ModalTitle>Select a driver</ModalTitle>
      </ModalHeader>
      <ModalBody className="modal-content">
        <Table hover bordered className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Rider's ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {availableDrivers.map((driver) => (
              <tr
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={selectedDriverId === driver.id ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDriverId === driver.id}
                    readOnly
                  />
                </td>
                <td>{driver.id}</td>
                <td>{driver.FullName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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
