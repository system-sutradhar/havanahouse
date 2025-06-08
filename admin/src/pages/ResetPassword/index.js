import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      context.setAlertBox({ open: true, error: true, msg: "Passwords do not match" });
      return;
    }
    postData("/api/user/reset-password", { token, password }).then((res) => {
      if (res.error) {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      } else {
        context.setAlertBox({ open: true, error: false, msg: res.msg });
        navigate("/login");
      }
    });
  };

  return (
    <section className="loginSection">
      <div className="loginBox">
        <h3 className="text-center mb-4">Reset Password</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <TextField
              type="password"
              label="New Password"
              variant="standard"
              className="w-100"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              type="password"
              label="Confirm Password"
              variant="standard"
              className="w-100"
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
              Reset
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
