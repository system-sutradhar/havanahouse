"use client";
import { useContext, useState } from "react";
import { MyContext } from "@/context/ThemeContext";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);

  const submit = (e) => {
    e.preventDefault();
    if (email === "") {
      context.setAlertBox({ open: true, error: true, msg: "email can not be blank!" });
      return;
    }
    setIsLoading(true);
    postData("/api/user/forgot-password", { email })
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: "If this email exists, reset link sent." });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="p-3" onSubmit={submit}>
      <h2 className="mb-4 text-center">Forgot Password</h2>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
        {isLoading ? <CircularProgress /> : "Send Reset Link"}
      </Button>
      <div className="text-center mt-3">
        <Link href="/signIn" className="link">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
