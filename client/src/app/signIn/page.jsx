"use client";
import { useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { MyContext } from "@/context/ThemeContext";
import SignInForm from "@/Components/Auth/SignInForm";

const SignIn = () => {
  const context = useContext(MyContext);
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <SignInForm />
    </Dialog>
  );
};

export default SignIn;
