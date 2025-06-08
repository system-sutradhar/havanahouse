import { useContext, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../../assets/images/googleIcon.png";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const LoginForm = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useNavigate();
  const context = useContext(MyContext);

  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
    isAdmin: true,
  });

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const signIn = (e) => {
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

          if (res.user?.isAdmin === true) {
            const user = {
              name: res.user?.name,
              email: res.user?.email,
              userId: res.user?.id,
              isAdmin: res.user?.isAdmin,
            };

            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(user));

            context.setAlertBox({ open: true, error: false, msg: "User Login Successfully!" });

            setTimeout(() => {
              context.setIsLogin(true);
              history("/dashboard");
              setIsLoading(false);
            }, 2000);
          } else {
            context.setAlertBox({ open: true, error: true, msg: "you are not a admin" });
            setIsLoading(false);
          }
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
          isAdmin: true,
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
                context.setIsLogin(true);
                history("/dashboard");
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
    <div className="loginBox">
      <Link to="/" className="d-flex align-items-center flex-column logo">
        <img src={Logo} />
        <span className="ml-2">ECOMMERCE</span>
      </Link>
      <div className="wrapper mt-3 card border">
        <form onSubmit={signIn}>
          <div className={`form-group position-relative ${inputIndex === 0 && "focus"}`}>
            <span className="icon">
              <MdEmail />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="enter your email"
              onFocus={() => focusInput(0)}
              onBlur={() => setInputIndex(null)}
              autoFocus
              name="email"
              onChange={onchangeInput}
            />
          </div>

          <div className={`form-group position-relative ${inputIndex === 1 && "focus"}`}>
            <span className="icon">
              <RiLockPasswordFill />
            </span>
            <input
              type={`${isShowPassword === true ? "text" : "password"}`}
              className="form-control"
              placeholder="enter your password"
              onFocus={() => focusInput(1)}
              onBlur={() => setInputIndex(null)}
              name="password"
              onChange={onchangeInput}
            />

            <span className="toggleShowPassword" onClick={() => setisShowPassword(!isShowPassword)}>
              {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          </div>

          <div className="form-group">
            <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
              {isLoading === true ? <CircularProgress /> : "Sign In "}
            </Button>
          </div>

          <div className="form-group text-center mb-0">
            <Link to="/forgot-password" className="link">
              FORGOT PASSWORD
            </Link>
            <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
              <span className="line"></span>
              <span className="txt">or</span>
              <span className="line"></span>
            </div>

            <Button variant="outlined" className="w-100 btn-lg btn-big loginWithGoogle" onClick={signInWithGoogle}>
              <img src={googleIcon} width="25px" /> &nbsp; Sign In with Google
            </Button>
          </div>
        </form>
      </div>

      <div className="wrapper mt-3 card border footer p-3">
        <span className="text-center">
          Don't have an account?
          <Link to="/signUp" className="link color ml-2">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
