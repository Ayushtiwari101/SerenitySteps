import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';
import './Landing.css';

const Landing = () => {
  const typedRef = useRef(null);

  useEffect(() => {
    if (!typedRef.current) return;
    
    const options = {
      strings: ["Hello and Welcome to <br /><span class='heading'>Serenity Steps</span>"],
      typeSpeed: 70,
      loop: true,
      showCursor: false,
    };
  
    const typed = new Typed(typedRef.current, options);
  
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <>
      <nav>
        <div className='navbarL'>
          <h1 className='titleL'>Serenity Steps</h1>
          <Link to="/login">
            <button className='loginbtnL'>Login</button>
          </Link>
        </div>
      </nav>
      
      <img 
        src="./Bg_capstone.jpeg" 
        alt="Serene background" 
        id='bg-img'
      />
      
      <div id="typed-container">
        <span ref={typedRef}></span>
        <br />
        <div className='message1'>
          <h3>Begin your journey to mindfulness and peace</h3>
        </div>
      </div>
        <Link to="/signup">
          <button className='signupbtnL'>Signup</button>
        </Link>
    </>
  );
};

export default Landing;
