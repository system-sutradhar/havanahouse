"use client";
import { useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { MyContext } from "@/context/ThemeContext";
import ForgotPasswordForm from "@/Components/Auth/ForgotPasswordForm";

const ForgotPassword = () => {
  const context = useContext(MyContext);
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <ForgotPasswordForm />
    </Dialog>
  );
};

export default ForgotPassword;
