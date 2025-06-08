"use client";
import { useContext, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/ThemeContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    postData("/api/user/forgot-password", { email }).then((res) => {
      if (res.token) {
        context.setAlertBox({ open: true, error: false, msg: "Reset link sent" });
        router.push(`/resetPassword?token=${res.token}`);
      } else {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      }
    });
  };

  return (
    <section className="authSection">
      <div className="loginBox">
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <TextField label="Email" variant="standard" className="w-100" onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <Button type="submit" className="btn-blue btn-lg w-100 btn-big">Submit</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
