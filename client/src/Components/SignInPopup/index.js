'use client';
import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Your existing utilities and context
import { MyContext } from '@/context/ThemeContext'; 
import { postData } from '@/utils/api';
import { auth, googleProvider } from '../../app/firebase'; // Corrected path
import { signInWithPopup } from "firebase/auth";
import { AppContext } from '@/context/AppContext';
// Your assets
import GoogleImg from "../../assets/images/googleImg.png";
import CircularProgress from "@mui/material/CircularProgress";
import './SignInPopup.css';

const SignInPopup = ({ isVisible, onClose }) => {
  const { isSignInPopupVisible, toggleSignInPopup, setAlertBox, setIsLogin, setisHeaderFooterShow } = useContext(MyContext);
   const { setUser } = useContext(AppContext);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!isVisible) {
    return null;
  }

  if (!isSignInPopupVisible) {
    return null;
  }
  
  const handleClose = () => {
    // Reset form and close popup
    setFormFields({ name: "", email: "", password: "" });
    toggleSignInPopup();
  };

  const onInputChange = (e) => {
    setFormFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleLoginSuccess = (res) => {
    localStorage.setItem("token", res.token);
    const user = {
      name: res.user?.name,
      email: res.user?.email,
      userId: res.user?.id,
    };
    localStorage.setItem("user", JSON.stringify(user));
    setAlertBox({ open: true, error: false, msg: res.msg });
    
    setTimeout(() => {
      setIsLogin(true);
      setIsLoading(false);
      setisHeaderFooterShow(true);
      handleClose();
      window.location.href = "/"; // Or use router.push('/')
    }, 1000);
  };

  // Handles both email sign-in and sign-up
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLoginView ? "/api/user/signin" : "/api/user/signup";
    
    postData(endpoint, formFields).then((res) => {
      if (res.error !== true) {
        handleLoginSuccess(res);
      } else {
        setAlertBox({ open: true, error: true, msg: res.msg });
        setIsLoading(false);
      }
    }).catch(error => {
        console.error("Auth error:", error);
        setAlertBox({ open: true, error: true, msg: "An unknown error occurred." });
        setIsLoading(false);
    });
  };

  // Your exact Google Sign-In logic
  const signInWithGoogle = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user.displayName,
          email: user.email,
          password: null, // As in your original code
          images: user.photoURL,
          phone: user.phoneNumber
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          if (res.error !== true) {
            handleLoginSuccess(res);
          } else {
            setAlertBox({ open: true, error: true, msg: res.msg });
            setIsLoading(false);
          }
        });
      })
      .catch((error) => {
        setAlertBox({ open: true, error: true, msg: error.message });
        setIsLoading(false);
      });
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-button" onClick={onClose}><FaTimes /></button>
        
        <h2>{isLoginView ? 'Sign In' : 'Create Account'}</h2>
        
        <form onSubmit={handleFormSubmit}>
          {!isLoginView && (
            <div className="form-group">
              <input type="text" name="name" placeholder="Full Name" onChange={onInputChange} required />
            </div>
          )}
          <div className="form-group">
            <input type="email" name="email" placeholder="Email Address" onChange={onInputChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" onChange={onInputChange} required />
          </div>
          
          <button type="submit" className="auth-button primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (isLoginView ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <button className="auth-button google" onClick={signInWithGoogle} disabled={isLoading}>
          <Image src={GoogleImg} alt="Google" width={20} height={20} />
          <span>Continue with Google</span>
        </button>

        <p className="toggle-view-link">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInPopup;