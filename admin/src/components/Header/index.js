import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/HHlogo.webp";
import Button from "@mui/material/Button";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { MdNightlightRound } from "react-icons/md";

import { MdDarkMode } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoMenu } from "react-icons/io5";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { IoShieldHalfSharp } from "react-icons/io5";
import Divider from "@mui/material/Divider";
import { MyContext } from "../../App";
import UserAvatarImgComponent from "../userAvatarImg";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMyAcc = Boolean(anchorEl);

  const context = useContext(MyContext);

  const history = useNavigate();

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };


  const changeTheme = () => {
    if (context.theme === "dark") {
      context.setTheme("light");
    } else {
      context.setTheme("dark");
    }
  };

  const logout = () => {
    localStorage.clear();

    setAnchorEl(null);

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Logout successfull",
    });

    setTimeout(() => {
      history("/login");
    }, 2000);
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            {/* Logo Wraooer */}
            <div className="col-sm-2 part1 pr-0">
              <Link to={"/"} className="d-flex align-items-center logo">
                <img src={logo} />
                {/* <span className="ml-2">ECOMMERCE</span> */}
              </Link>
            </div>

            {context.windowWidth > 992 && (
              <div className="col-sm-3 d-flex align-items-center part2">
                <Button
                  className="rounded-circle mr-3"
                  onClick={() =>
                    context.setIsToggleSidebar(!context.isToggleSidebar)
                  }
                >
                  {context.isToggleSidebar === false ? (
                    <MdMenuOpen />
                  ) : (
                    <MdOutlineMenu />
                  )}
                </Button>
                
              </div>
            )}

            <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
              <Button className="rounded-circle mr-3" onClick={changeTheme}>
                {context.theme === "light" ? (
                  <MdNightlightRound />
                ) : (
                  <MdOutlineLightMode />
                )}
              </Button>

              {context.windowWidth < 992 && (
                <Button
                  className="rounded-circle mr-3"
                  onClick={() => context.openNav()}
                >
                  <IoMenu />
                </Button>
              )}

              {context.isLogin !== true ? (
                <Link to={"/login"}>
                  <Button className="btn-blue btn-lg btn-round">Sign In</Button>
                </Link>
              ) : (
                <div className="myAccWrapper">
                  <Button
                    className="myAcc d-flex align-items-center"
                    onClick={handleOpenMyAccDrop}
                  >
                    <div className="userImg">
                      <span className="rounded-circle">
                        {context.user?.name?.charAt(0)}
                      </span>
                    </div>

                    <div className="userInfo res-hide">
                      <h4>{context.user?.name}</h4>
                      <p className="mb-0">{context.user?.email}</p>
                    </div>
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMyAcc}
                    onClose={handleCloseMyAccDrop}
                    onClick={handleCloseMyAccDrop}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleCloseMyAccDrop}>
                    <Link to="/my-account">
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      My Account
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMyAccDrop}>
                      <ListItemIcon>
                        <IoShieldHalfSharp />
                      </ListItemIcon>
                      Reset Password
                    </MenuItem>
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
