import "./orderStatus.scss";
import React from "react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const OrderStatus = (props) => {
  const bookID = props.id;
  const [CusID, setCusID] = useState();
  const [DriverID, setDriverID] = useState();
  const [Ddata, setDdata] = useState([]);
  const [Bdata, setBdata] = useState([]);
  const [Cdata, setCdata] = useState([]);
  const [orderA, setOrderA] = useState();
  const [outPick, setOutPick] = useState();
  const [parcelP, setParcelP] = useState();
  const [goingD, setGoingD] = useState();
  const [arrivedD, setArrivedD] = useState();
  const [arrivedP, setArrivedP] = useState();
  const [complete, setComplete] = useState();

  useEffect(() => {
    const fetchBooking = async () => {
      console.log(bookID);
      try {
        const booking = [];
        const docRef = doc(db, "Order_Status", bookID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCusID(docSnap.data()["Customer ID"]);
          setDriverID(docSnap.data()["Driver ID"]);
          setOrderA(docSnap.data()["Order Assigned"]);
          setOutPick(docSnap.data()["Out For PickUp"]);
          setArrivedP(docSnap.data()["Arrive at PickUp"]);
          setParcelP(docSnap.data()["Parcel Picked"]);
          setGoingD(docSnap.data()["Going to DropOff"]);
          setArrivedD(docSnap.data()["Arrive DropOff"]);
          setComplete(docSnap.data().Completed);
          booking.push({
            bookN: docSnap.data()["Booking Number"],
            orderA: docSnap.data()["Order Assigned"],
            outPick: docSnap.data()["Out For PickUp"],
            parcelP: docSnap.data()["Parcel Picked"],
            goingD: docSnap.data()["Going to DropOff"],
            arrivedP: docSnap.data()["Arrive at PickUp"],
            arrivedD: docSnap.data()["Arrive DropOff"],
            complete: docSnap.data().Completed,
          });
          setBdata(booking);
          console.log(
            "Document BOOKING data:",
            docSnap.data()["Booking Number"]
          );
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUser = async () => {
      // Check if CusID is defined
      if (CusID) {
        try {
          const userData = [];
          const docRef = doc(db, "Users", CusID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            userData.push({
              name: docSnap.data().FullName,
              email: docSnap.data().Email,
              phone: docSnap.data().Phone,
              gender: docSnap.data().Gender,
              img: docSnap.data()["Profile Photo"],
            });
            setCdata(userData);
            //console.log("Document USER data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchDriver = async () => {
      // Check if DriverID is defined
      if (DriverID) {
        try {
          const DriverData = [];
          const docRef = doc(db, "Drivers", DriverID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            DriverData.push({
              name: docSnap.data().FullName,
              email: docSnap.data().Email,
              company: docSnap.data().Company,
              phone: docSnap.data().Phone,
              gender: docSnap.data().Gender,
              img: docSnap.data()["Profile Photo"],
              vehicleT: docSnap.data()["Vehicle Type"],
              vehicleN: docSnap.data()["Vehicle Number"],
              vehicleC: docSnap.data()["Vehicle Color"],
            });
            setDdata(DriverData);
            //console.log("Document DRIVER data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchBooking();
    fetchUser();
    fetchDriver();
  }, [bookID, CusID, DriverID]);

  return (
    <div className="container mx-auto">
      <div className="contents flex flex-wrap justify-center">
        <div className="flex-1">
          <div className="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <img
              className="object-cover w-full h-64 rounded-md"
              src={Ddata.map((Ddata) => Ddata.img)}
              alt="Driver"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "300px",
                borderRadius: "10px",
              }}
            />
            <div className="text-center space-y-2 sm:text-left">
              <div className="space-y-0.5">
                <p className="text-lg text-black font-semibold">
                  {Ddata.map((Ddata) => Ddata.name)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Ddata.map((Ddata) => Ddata.phone)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Ddata.map((Ddata) => Ddata.company)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Ddata.map((Ddata) => Ddata.vehicleT)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Ddata.map((Ddata) => Ddata.vehicleC)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Ddata.map((Ddata) => Ddata.vehicleN)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <img
              className="object-cover rounded-full h-[100px] w-[100px] block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
              src={Cdata.map((Cdata) => Cdata.img)}
              alt="Customer"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "300px",
                borderRadius: "10px",
              }}
            />
            <div className="text-center space-y-2 sm:text-left">
              <div className="space-y-0.5">
                <p className="text-lg text-black font-semibold">
                  {Cdata.map((Cdata) => Cdata.name)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Cdata.map((Cdata) => Cdata.email)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Cdata.map((Cdata) => Cdata.phone)}
                </p>
                <p className="text-slate-500 font-medium">
                  {Cdata.map((Cdata) => Cdata.gender)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid py-8 px-8">
        <div>
          {orderA === "1" ? (
            <div className="m-4">
              <CheckCircleIcon className="icon-active text-green" /> Order
              Assigned
            </div>
          ) : (
            <div className="m-4">
              <CheckCircleIcon className="icon-inactive" /> Order Not Assigned
            </div>
          )}
        </div>
        <div>
          {outPick === "1" ? (
            <div className="m-4">
              <TwoWheelerIcon className="icon-active text-green" /> Rider on his
              way
            </div>
          ) : (
            <div className="m-4">
              <TwoWheelerIcon className="icon-inactive" /> Waiting...
            </div>
          )}
        </div>
        <div>
          {arrivedP === "1" ? (
            <div className="m-4">
              <FlightLandIcon className="icon-active text-green" /> Rider
              Arrived at Pick Up
            </div>
          ) : (
            <div className="m-4">
              <FlightLandIcon className="icon-inactive" /> Waiting...
            </div>
          )}
        </div>
        <div>
          {parcelP === "1" ? (
            <div className="m-4">
              <LocalShippingIcon className="icon-active text-green" /> Parcel
              Picked{" "}
            </div>
          ) : (
            <div className="m-4">
              <LocalShippingIcon className="icon-inactive" /> Waiting...{" "}
            </div>
          )}
        </div>
        <div>
          {goingD === "1" ? (
            <div className="m-4">
              <LocalPostOfficeIcon className="icon-active text-green" /> Rider
              going delivery
            </div>
          ) : (
            <div className="m-4">
              <LocalPostOfficeIcon className="icon-inactive" /> Waiting...
            </div>
          )}
        </div>
        <div>
          {arrivedD === "1" ? (
            <div className="m-4">
              <FlightLandIcon className="icon-active text-green" /> Rider
              Arrived at Drop
            </div>
          ) : (
            <div className="m-4">
              <FlightLandIcon className="icon-inactive" /> Waiting...
            </div>
          )}
        </div>
        <div>
          {complete === "1" ? (
            <div className="m-4">
              <HowToRegIcon className="icon-active text-green" /> Order
              Completed
            </div>
          ) : (
            <div className="m-4">
              <HowToRegIcon className="icon-inactive" /> Waiting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
