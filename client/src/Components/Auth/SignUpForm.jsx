"use client";
import { useContext, useState } from "react";
import { MyContext } from "@/context/ThemeContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GoogleImg from "../../assets/images/googleImg.png";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../app/firebase";
import Image from "next/image";
import Link from "next/link";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });

  const context = useContext(MyContext);
  const history = useRouter();

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const register = (e) => {
    e.preventDefault();
    try {
      if (formfields.name === "") {
        context.setAlertBox({ open: true, error: true, msg: "name can not be blank!" });
        return false;
      }
      if (formfields.email === "") {
        context.setAlertBox({ open: true, error: true, msg: "email can not be blank!" });
        return false;
      }
      if (formfields.phone === "") {
        context.setAlertBox({ open: true, error: true, msg: "phone can not be blank!" });
        return false;
      }
      if (formfields.password === "") {
        context.setAlertBox({ open: true, error: true, msg: "password can not be blank!" });
        return false;
      }
      setIsLoading(true);
      postData("/api/user/signup", formfields)
        .then((res) => {
          if (res.error !== true) {
            context.setAlertBox({ open: true, error: false, msg: "Register Successfully!" });
            setTimeout(() => {
              setIsLoading(true);
              history.push("/signIn");
            }, 2000);
          } else {
            setIsLoading(false);
            context.setAlertBox({ open: true, error: true, msg: res.msg });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error posting data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
        };

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

              context.setAlertBox({ open: true, error: false, msg: res.msg });

              setTimeout(() => {
                history.push("/signIn");
                context.setIsLogin(true);
                setIsLoading(false);
                context.setisHeaderFooterShow(true);
              }, 2000);
            } else {
              context.setAlertBox({ open: true, error: true, msg: res.msg });
              setIsLoading(false);
            }
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        });

        context.setAlertBox({ open: true, error: false, msg: "User authentication Successfully!" });
      })
      .catch((error) => {
        context.setAlertBox({ open: true, error: true, msg: error.message });
      });
  };

  return (
    <form className="p-3" onSubmit={register}>
      <h2 className="mb-3 text-center">Sign Up</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <TextField label="Name" name="name" onChange={onchangeInput} type="text" variant="standard" className="w-100" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <TextField label="Phone No." name="phone" onChange={onchangeInput} type="number" variant="standard" className="w-100" />
          </div>
        </div>
      </div>
      <div className="form-group">
        <TextField label="Email" type="email" name="email" onChange={onchangeInput} variant="standard" className="w-100" />
      </div>
      <div className="form-group">
        <TextField label="Password" name="password" onChange={onchangeInput} type="password" variant="standard" className="w-100" />
      </div>
      <Link href="/forgotPassword" className="border-effect cursor txt">Forgot Password?</Link>
      <div className="d-flex align-items-center mt-3 mb-3 ">
        <div className="row w-100">
          <div className="col-md-6">
            <Button type="submit" disabled={isLoading === true} className="btn-blue w-100 btn-lg btn-big">
              {isLoading === true ? <CircularProgress /> : "Sign Up"}
            </Button>
          </div>
          <div className="col-md-6 pr-0">
            <Button className="btn-lg btn-big w-100" variant="outlined" onClick={() => context.setisHeaderFooterShow(true)} href="/">
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <p className="txt text-center">
        Not Registered? <Link href="/signIn" className="border-effect">Sign In</Link>
      </p>
      <h6 className="mt-4 text-center font-weight-bold">Or continue with social account</h6>
      <Button className="loginWithGoogle mt-2" variant="outlined" onClick={signInWithGoogle}>
        <Image src={GoogleImg} alt="image" /> Sign In with Google
      </Button>
    </form>
  );
};

export default SignUpForm;
