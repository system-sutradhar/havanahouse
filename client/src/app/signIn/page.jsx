"use client"
import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.jpg";
import { MyContext } from "@/context/ThemeContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


import GoogleImg from "../../assets/images/googleImg.png";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
import Head from "next/head";


import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const history = useRouter();

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
  });

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const login = (e) => {
    e.preventDefault();

    if (formfields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "email can not be blank!",
      });
      return false;
    }

    if (formfields.password === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "password can not be blank!",
      });
      return false;
    }

    setIsLoading(true);
    postData("/api/user/signin", formfields).then((res) => {
      try {
        if (res.error !== true) {
          localStorage.setItem("token", res.token);

          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id,
          };

          localStorage.setItem("user", JSON.stringify(user));

          context.setAlertBox({
            open: true,
            error: false,
            msg: res.msg,
          });

          setTimeout(() => {
            history.push("/");
            context.setIsLogin(true);
            setIsLoading(false);
            context.setisHeaderFooterShow(true);
            //window.location.href = "/";
          }, 2000);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    });
  };

  const signInWithGoogle = () => {
    
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        const fields={
            name:user.providerData[0].displayName,
            email: user.providerData[0].email,
            password: null,
            images:user.providerData[0].photoURL,
            phone:user.providerData[0].phoneNumber
        }

        postData("/api/user/authWithGoogle", fields).then((res) => {
            try {
              if (res.error !== true) {
                localStorage.setItem("token", res.token);
      
                const user = {
                  name: res.user?.name,
                  email: res.user?.email,
                  userId: res.user?.id,
                };
      
                localStorage.setItem("user", JSON.stringify(user));
      
                context.setAlertBox({
                  open: true,
                  error: false,
                  msg: res.msg,
                });
      
                setTimeout(() => {
                    history.push("/");
                  context.setIsLogin(true);
                  setIsLoading(false);
                  context.setisHeaderFooterShow(true);
                  //window.location.href = "/";
                }, 2000);
              } else {
                context.setAlertBox({
                  open: true,
                  error: true,
                  msg: res.msg,
                });
                setIsLoading(false);
              }
            } catch (error) {
              console.log(error);
              setIsLoading(false);
            }
          });

        context.setAlertBox({
          open: true,
          error: false,
          msg: "User authentication Successfully!",
        });

       // window.location.href = "/";
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: errorMessage,
        });
        // ...
      });
  };

  return (
    <>
      <Head>
        <title>Sign In | Havana House</title>
        <meta name="description" content="Access your Havana House account." />
      </Head>
      <section className="section signInPage">
      <div className="shape-bottom">
        <svg
          fill="#fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
        >
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          ></path>
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            {/* <Image src={Logo} alt="image" /> */}
            <Link href="/" aria-label="Go to homepage">
              <svg width="180" height="70" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Havana House Logo">
                <path d="M20,60 C10,50 20,30 15,20 C25,30 15,50 25,60 Z" fill="var(--color-accent-gold)" />
                <path d="M30,80 C20,70 30,50 25,40 C35,50 25,70 35,80 Z" fill="var(--color-accent-gold)" />
                <text x="60" y="45" fontFamily="Georgia" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HAVANA</text>
                <text x="60" y="75" fontFamily="Georgia" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HOUSE</text>
                <text x="60" y="95" fontFamily="Arial" fontSize="12" letterSpacing="3" fill="var(--color-accent-gold)">CIGAR MERCHANT</text>
              </svg>
            </Link>
          </div>

          <form className="mt-3" onSubmit={login}>
            <h2 className="mb-4">Sign In</h2>

            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                required
                variant="standard"
                className="w-100"
                name="email"
                onChange={onchangeInput}
              />
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Password"
                type="password"
                required
                variant="standard"
                className="w-100"
                name="password"
                onChange={onchangeInput}
              />
            </div>

            <a className="border-effect cursor txt">Forgot Password?</a>

            <div className="d-flex align-items-center mt-3 mb-3 ">
              <Button type="submit" className="btn-blue col btn-lg btn-big">
                {isLoading === true ? <CircularProgress /> : "Sign In"}
              </Button>
              <Link href="/">
                <Button
                  className="btn-lg btn-big col ml-3"
                  variant="outlined"
                  onClick={() => context.setisHeaderFooterShow(true)}
                >
                  Cancel
                </Button>
              </Link>
            </div>

            <p className="txt">
              Not Registered?{" "}
              <Link href="/signUp" className="border-effect">
                Sign Up
              </Link>
            </p>

            <h6 className="mt-4 text-center font-weight-bold">
              Or continue with social account
            </h6>

            <Button
              className="loginWithGoogle mt-2"
              variant="outlined"
              onClick={signInWithGoogle}
            >
              <Image src={GoogleImg} alt="image" /> Sign In with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
    </>
  );
};

export default SignIn;
