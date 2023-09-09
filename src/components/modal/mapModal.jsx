import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { reverseGeocode } from "../../geocodingUtils";

const MapModal = ({ riderLocation, show, handleClose }) => {
    const [location, setLocation] = useState({
        lat: parseFloat(riderLocation["Driver Latitude"]),
        lng: parseFloat(riderLocation["Driver Longitude"]),
    });

    const [address, setAddress] = useState(null);

    useEffect(() => {
        reverseGeocode(location.lat, location.lng)
            .then((result) => {
                setAddress(result);
            })
            .catch((error) => {
                toast.error("Location not found");
            });
    }, [location]);

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
                    <GoogleMap mapContainerStyle={mapStyles} zoom={17} center={location}>
                        {/* <Marker position={location} /> */}
                        {!isNaN(location.lat) && !isNaN(location.lng) ? (
                            <Marker position={location} />
                        ) : (
                            <>
                                <Marker position={{ lat: 0, lng: 0 }} />
                                {toast.error("Invalid latitude or longitude values")}
                            </>
                        )}

                    </GoogleMap>
                </LoadScript>
                <p>Address: {address}</p>
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
