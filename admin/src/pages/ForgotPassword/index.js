import { useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { MyContext } from "../../App";
import ForgotPasswordForm from "../../components/Auth/ForgotPasswordForm";
import patern from "../../assets/images/pattern.webp";

const ForgotPassword = () => {
  const context = useContext(MyContext);
  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, []);

  return (
    <>
      <img src={patern} className="loginPatern" />
      <Dialog open={true} maxWidth="sm" fullWidth>
        <ForgotPasswordForm />
      </Dialog>
    </>
  );
};

export default ForgotPassword;
