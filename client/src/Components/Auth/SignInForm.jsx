"use client";
import { useContext, useState } from "react";
import { MyContext } from "@/context/ThemeContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GoogleImg from "../../assets/images/googleImg.png";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../app/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const history = useRouter();

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
      context.setAlertBox({ open: true, error: true, msg: "email can not be blank!" });
      return false;
    }

    if (formfields.password === "") {
      context.setAlertBox({ open: true, error: true, msg: "password can not be blank!" });
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

          context.setAlertBox({ open: true, error: false, msg: res.msg });

          setTimeout(() => {
            history.push("/");
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
                history.push("/");
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
    <form className="p-3" onSubmit={login}>
      <h2 className="mb-4 text-center">Sign In</h2>
      <div className="form-group">
        <TextField id="email" label="Email" type="email" required variant="standard" className="w-100" name="email" onChange={onchangeInput} />
      </div>
      <div className="form-group">
        <TextField id="password" label="Password" type="password" required variant="standard" className="w-100" name="password" onChange={onchangeInput} />
      </div>
      <Link href="/forgotPassword" className="border-effect cursor txt">Forgot Password?</Link>
      <div className="d-flex align-items-center mt-3 mb-3 ">
        <Button type="submit" className="btn-blue col btn-lg btn-big">
          {isLoading === true ? <CircularProgress /> : "Sign In"}
        </Button>
        <Button className="btn-lg btn-big col ml-3" variant="outlined" onClick={() => context.setisHeaderFooterShow(true)} href="/">
          Cancel
        </Button>
      </div>
      <p className="txt text-center">
        Not Registered? <Link href="/signUp" className="border-effect">Sign Up</Link>
      </p>
      <h6 className="mt-4 text-center font-weight-bold">Or continue with social account</h6>
      <Button className="loginWithGoogle mt-2" variant="outlined" onClick={signInWithGoogle}>
        <Image src={GoogleImg} alt="image" /> Sign In with Google
      </Button>
    </form>
  );
};

export default SignInForm;
