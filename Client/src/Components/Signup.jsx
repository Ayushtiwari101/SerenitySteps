import './Signup.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const clientID = "85462322080-3ie3vc4olh1oi5puuv4b3j3p71get9f6.apps.googleusercontent.com";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactOrEmail, setContactOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Detect if the input is an email or a phone number
    const isEmail = /\S+@\S+\.\S+/.test(contactOrEmail);
    const userdata = { 
      firstName, 
      lastName, 
      username, 
      password, 
      ...(isEmail ? { email: contactOrEmail } : { contactNumber: contactOrEmail }) 
    };

    try {
      const response = await axios.post("https://serenitysteps.onrender.com/signup", userdata);
      alert(response.data);
      navigate("/");
    } catch (error) {
      setSignupError(error.message);
    }
  };

  const onSuccess = (res) => {
    alert("Google Signup Successful!");
    navigate("/home");
  };

  return (
    <>
      <nav>
        <div className='Snavbar'>
          <Link to="/" className='Stitle'>Serenity Steps</Link>
        </div>
      </nav>
      <img src="./Bg_capstone.jpeg" alt="" id='bg-img'/>
      
      <div className="Scontainer">
        <div className='Signup-side'>
          <h1 id='web-name'>Serenity Steps</h1>
          <h2>Serenity Steps helps users reach their wellness goals and improve overall health through a coordinated approach to well-being.</h2>
        </div>

        <div className="sform-container">
          <form className="signupform" onSubmit={handleFormSubmit}>
            <label>First Name:</label>
            <input type="text" className="Boxx" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

            <label>Last Name:</label>
            <input type="text" className="Boxx" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

            <label>Mobile Number or Email Address:</label>
            <input type="text" className="Boxx" value={contactOrEmail} onChange={(e) => setContactOrEmail(e.target.value)} required />

            <label>Create Username:</label>
            <input type="text" className="Boxx" value={username} onChange={(e) => setUsername(e.target.value)} required />

            <label>Create Password:</label>
            <input type="password" className="Boxx" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

            <button type="submit" className="signup-btn">SIGNUP</button>

            <div className="google-auth">
              <GoogleOAuthProvider clientId={clientID}>
                <GoogleLogin onSuccess={onSuccess} text="signup_with"/>
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
