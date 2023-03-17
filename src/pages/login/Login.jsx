import "./login.scss"
import logo from "../../components/assets/images/myogaIcon2.png";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"; 
import { AuthContext } from "../../context/authContext";
import { type } from "@testing-library/user-event/dist/type";


const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [company, setcompany] = useState("");
  const [date, setdate] = useState("");
  const [regnumber, setregNum] = useState("");
  const [location, setloction] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [documents, setdocuments] = useState("");

  const [error, seterror] = useState(false);
  const [Errormsg, seterrormsg] = useState(false);
  const [newUser, setnewUser] = useState(false);

  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault();
    seterror(false);

    if(newUser){
      await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "Companies"), {
        company: company,
        date: date,
        regnumber: regnumber,
        location: location,
        address: address,
        phone: phone,
        timeStamp: serverTimestamp(),
      }, navigate("/"))
      .catch((error) => {
        seterror(true);
        const errormsg = error.message;
        seterrormsg(errormsg);
      })
      }else{
       signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        dispatch({type:"LOGIN", payload:user})
        navigate("/")
       }).catch((error) => {
        seterror(true);
        const errormsg = error.message;
        seterrormsg(errormsg);
       })
    }
  }


  return (
    <div className="login-page">
      <header>
        <span>
          MyOga Admin
        </span>
      </header>

      <img className="logo" src={logo} alt="Logo" />

      <form onSubmit={submit}>

        <div className="email">
          <input 
          onChange={(e) => setemail(e.target.value)} 
          id="email" 
          type="email" 
          placeholder="Email" 
          required/>
        </div>

        <div className="password">
          <input onChange={(e) => setpassword(e.target.value)} id="password" type="password" placeholder="Password" required/>
        </div>

        {newUser && 
        (<div className="password">
          <input 
          onChange={(e) => setpassword(e.target.value)}
           id="password"
            type="password" 
            placeholder="Repeat Password" required/>
        </div>)
        }

        {newUser && 
        (<div className="company">
          <input 
          onChange={(e) => setcompany(e.target.value)} 
          id="company" 
          type="text" 
          placeholder="Company Name" 
          required/>
        </div>)
        }

        {newUser && 
        (<div className="date">
          <input 
          onChange={(e) => setdate(e.target.value)} 
          id="date" 
          type="date" 
          placeholder="Date of Establishment" 
          required/>
        </div>)
        }

        {newUser && 
        (<div className="registration">
          <input 
          onChange={(e) => setregNum(e.target.value)} 
          id="reg" 
          type="text" 
          placeholder="Reg. Number" 
          required/>
        </div>)
        }

        {newUser && 
        (<div className="location">
          <input 
          onChange={(e) => setloction(e.target.value)} 
          id="location" 
          type="text" 
          placeholder="Location" 
          required/>
        </div>)
        }

        {newUser && 
        (<div className="addresss">
          <input 
          onChange={(e) => setaddress(e.target.value)} 
          id="company" 
          type="text" 
          placeholder="Address" 
          required/>
        </div>)
        }

        {newUser && 
        (<div className="phone">
          <input 
          onChange={(e) => setphone(e.target.value)} 
          id="phone" 
          type="text" 
          placeholder="Phone" 
          required/>
        </div>)
        }

        {/* {newUser && 
        (<div className="document">
          <input 
          onChange={(e) => setdocuments(e.target.value)} 
          id="document" 
          type="text" 
          placeholder="Documents" 
          required/>
        </div>)
        } */}

        {error && <span className="error">Process Failed!!</span>}
        {error && <span className="error">{Errormsg}</span>}

        <button type="submit">{newUser ? "Sing Up" : "Login"}</button>

        { newUser ?
          (<span className="user-stat">Already have an account? <b onClick={()=> {
            setnewUser(false);
            seterror(false);
          }}> Log in</b></span>):

          (<span className="user-stat">Don't have an account? <b onClick={()=>{
            setnewUser(true);
            seterror(false);
          }}> Sign Up</b></span>)
          }
      </form>
    </div>
  )
}

export default Login