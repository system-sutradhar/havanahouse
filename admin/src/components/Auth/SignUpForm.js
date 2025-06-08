import { useContext, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import googleIcon from "../../assets/images/googleIcon.png";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUpForm = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true,
  });

  const history = useNavigate();
  const context = useContext(MyContext);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const signUp = (e) => {
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
      if (formfields.confirmPassword === "") {
        context.setAlertBox({ open: true, error: true, msg: "confirm password can not be blank!" });
        return false;
      }
      if (formfields.confirmPassword !== formfields.password) {
        context.setAlertBox({ open: true, error: true, msg: "password not match" });
        return false;
      }
      setIsLoading(true);
      postData("/api/user/signup", formfields)
        .then((res) => {
          if (res.status !== "FAILED") {
            context.setAlertBox({ open: true, error: false, msg: res?.msg });
            setTimeout(() => {
              setIsLoading(true);
              history("/login");
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
        <form onSubmit={signUp}>
          <div className={`form-group position-relative ${inputIndex === 0 && "focus"}`}>
            <span className="icon">
              <FaUserCircle />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="enter your name"
              onFocus={() => focusInput(0)}
              onBlur={() => setInputIndex(null)}
              autoFocus
              name="name"
              onChange={onchangeInput}
            />
          </div>

          <div className={`form-group position-relative ${inputIndex === 1 && "focus"}`}>
            <span className="icon">
              <MdEmail />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="enter your email"
              onFocus={() => focusInput(1)}
              onBlur={() => setInputIndex(null)}
              name="email"
              onChange={onchangeInput}
            />
          </div>

          <div className={`form-group position-relative ${inputIndex === 2 && "focus"}`}>
            <span className="icon">
              <FaPhoneAlt />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="enter your Phone"
              onFocus={() => focusInput(2)}
              onBlur={() => setInputIndex(null)}
              name="phone"
              onChange={onchangeInput}
            />
          </div>

          <div className={`form-group position-relative ${inputIndex === 3 && "focus"}`}>
            <span className="icon">
              <RiLockPasswordFill />
            </span>
            <input
              type={`${isShowPassword === true ? "text" : "password"}`}
              className="form-control"
              placeholder="enter your password"
              onFocus={() => focusInput(3)}
              onBlur={() => setInputIndex(null)}
              name="password"
              onChange={onchangeInput}
            />

            <span className="toggleShowPassword" onClick={() => setisShowPassword(!isShowPassword)}>
              {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          </div>

          <div className={`form-group position-relative ${inputIndex === 4 && "focus"}`}>
            <span className="icon">
              <IoShieldCheckmarkSharp />
            </span>
            <input
              type={`${isShowConfirmPassword === true ? "text" : "password"}`}
              className="form-control"
              placeholder="confirm your password"
              onFocus={() => focusInput(4)}
              onBlur={() => setInputIndex(null)}
              name="confirmPassword"
              onChange={onchangeInput}
            />

            <span className="toggleShowPassword" onClick={() => setisShowConfirmPassword(!isShowConfirmPassword)}>
              {isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          </div>

          <div className="form-group">
            <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
              {isLoading === true ? <CircularProgress /> : "Sign Up "}
            </Button>
          </div>

          <div className="form-group text-center mb-0">
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

        <span className="text-center d-block mt-3">
          Don't have an account?
          <Link to="/login" className="link color ml-2">
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignUpForm;
