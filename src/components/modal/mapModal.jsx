import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const MapModal = ({ riderLocation, show, handleClose }) => {
    const latitude = parseFloat(riderLocation["Driver Latitude"]);
    const longitude = parseFloat(riderLocation["Driver Longitude"]);

    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            className="modal"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Rider Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={17}
                        center={{
                            lat: latitude,
                            lng: longitude,
                        }}
                    >
                        {(() => {
                            if (!isNaN(latitude) && !isNaN(longitude)) {
                                return (
                                    <Marker
                                        position={{
                                            lat: latitude,
                                            lng: longitude,
                                        }}
                                    />
                                );
                            } else {
                                toast.error("Invalid latitude or longitude values");
                                return null;
                            }
                        })()}
                    </GoogleMap>
                </LoadScript>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default MapModal;
