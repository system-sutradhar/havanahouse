import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    postData("/api/user/forgot-password", { email }).then((res) => {
      if (res.token) {
        context.setAlertBox({ open: true, error: false, msg: "Reset link sent" });
        navigate(`/reset-password?token=${res.token}`);
      } else {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      }
    });
  };

  return (
    <section className="loginSection">
      <div className="loginBox">
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <TextField
              label="Email"
              variant="standard"
              className="w-100"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
