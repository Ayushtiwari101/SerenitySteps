import './Signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Corrected import
import {GoogleLogin , GoogleOAuthProvider} from "@react-oauth/google"

const clientID = "85462322080-3ie3vc4olh1oi5puuv4b3j3p71get9f6.apps.googleusercontent.com"

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userdata = { firstName, lastName,contactNumber, email, username, password }; // Simplified object creation
    console.log(userdata)
    try {
      const response = await axios.post("https://s55-ayush-capstone-serenitysteps.onrender.com/signup", userdata);
      console.log(response)
      alert(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      setSignupError(error.message);
    }
  };
  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! Current User: ", res.profileObj);
    alert("Google Signup Successful!");
    setIsLoggedIn(true);
    
    setTimeout(() => {
      
      navigate("/home"); 
    }, 2000);
  };

  return (
    <>
      <nav>
        <div className='navbar'>
          <Link to="/" className='title'><h1>Serenity Steps</h1></Link>
        </div>
      </nav>
      <img src="./Bg_capstone.jpeg" alt="" id='bg-img'/>
      <div className="sform-container">
        <form className="signupform" onSubmit={handleFormSubmit}>
          <label>First Name:</label>
          <input 
            type="text"
            className="Boxx"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <br />

          <label>Last Name:</label>
          <input 
            type="text"
            className="Boxx"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <br />

          <label>Contact Number:</label>
          <input 
            type="tel"
            className="Boxx"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          <br />

          <label>Email:</label>
          <input 
            className="Boxx"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />

          <label>Create Username:</label>
          <input 
            type="text"
            className="Boxx"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />

          <label>Create Password:</label>
          <input
            type="password"
            className="Boxx"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <br />

          <button type="submit" className="signup-btn">SIGNUP</button>
          <div className="google-auth">
          <GoogleOAuthProvider clientId={clientID} >
          <GoogleLogin onSuccess={onSuccess} text="signup_with"/>
          </GoogleOAuthProvider>
          </div>
          
        </form>
      </div>
    </>
  );
}

export default Signup;
