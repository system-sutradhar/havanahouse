import { useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { MyContext } from "../../App";
import LoginForm from "../../components/Auth/LoginForm";
import patern from "../../assets/images/pattern.webp";

const Login = () => {
  const context = useContext(MyContext);
  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, []);

  return (
    <>
      <img src={patern} className="loginPatern" />
      <Dialog open={true} maxWidth="sm" fullWidth>
        <LoginForm />
      </Dialog>
    </>
  );
};

export default Login;
