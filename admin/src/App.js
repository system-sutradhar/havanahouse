import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import React, { createContext, useEffect, useState, useRef } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Products from "./pages/Products";
import Category from "./pages/Category/categoryList";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/Products/addProduct";
import EditProduct from "./pages/Products/editProduct";
import CategoryAdd from "./pages/Category/addCategory";
import EditCategory from "./pages/Category/editCategory";
import SubCatAdd from "./pages/Category/addSubCat";
import SubCatList from "./pages/Category/subCategoryList";
import AddProductRAMS from "./pages/Products/addProductRAMS";
import ProductWeight from "./pages/Products/addProductWeight";
import ProductSize from "./pages/Products/addProductSize";
import Orders from "./pages/Orders";
import HomeBannerSlideList from "./pages/HomeBanner/homeSlideList";
import EditHomeBannerSlide from "./pages/HomeBanner/editSlide";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "./utils/api";

import axios from "axios";
import logger from "./utils/logger";
import BannersList from "./pages/Banners/bannerList";
import EditBanner from "./pages/Banners/editHomeBanner";

import HomeSideBannersList from "./pages/HomeSideBanners/bannerList";
import EditHomeSideBanner from "./pages/HomeSideBanners/editHomeSideBanner";

import HomeBottomBannersList from "./pages/HomeBottomBanners/bannerList";
import EditHomeBottomBanner from "./pages/HomeBottomBanners/editHomeBottomBanner";
import AppSettingsList from "./pages/AppSettings/list";
import MyAccount from "./pages/MyAccount";
import Notifications from "./pages/Notifications";

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [catData, setCatData] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

  const [isOpenNav, setIsOpenNav] = useState(false);

  const [baseUrl, setBaseUrl] = useState("http://localhost:4000");

  const [progress, setProgress] = useState(0);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState("");

  const muiTheme = createTheme({
    palette: { mode: theme },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#fff' : 'inherit',
            '& fieldset': {
              borderColor: theme === 'dark' ? '#444' : '#ccc',
            },
            '&:hover fieldset': {
              borderColor: '#888',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: theme === 'dark' ? '#ccc' : 'inherit',
            '&.Mui-focused': {
              color: '#1976d2',
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  useEffect(() => {
    const controller = new AbortController();
    getCountry(
      "https://countriesnow.space/api/v0.1/countries/",
      controller.signal
    );
    return () => controller.abort();
  }, []);

  const getCountry = async (url, signal) => {
    try {
      const res = await axios.get(url, { signal });
      setCountryList(res.data.data);
    } catch (err) {
      if (err.name !== "CanceledError") {
        logger.error(err);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  useEffect(() => {
    setProgress(20);
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res);
      setProgress(100);
    });
  };

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    setUser,
    user,
    countryList,
    selectedCountry,
    setselectedCountry,
    windowWidth,
    openNav,
    setIsOpenNav
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <MyContext.Provider value={values}>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
        />

        <Snackbar
          open={alertBox.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            autoHideDuration={6000}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        {isHideSidebarAndHeader !== true && <Header />}
        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <>
              <div
                className={`sidebarOverlay d-none ${
                  isOpenNav === true && "show"
                }`}
                onClick={() => setIsOpenNav(false)}
              ></div>
              <div
                className={`sidebarWrapper ${
                  isToggleSidebar === true ? "toggle" : ""
                } ${isOpenNav === true ? "open" : ""}`}
              >
                <Sidebar />
              </div>
            </>
          )}

          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${
              isToggleSidebar === true ? "toggle" : ""
            }`}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/product/details/:id"
               
                element={<ProductDetails />}
              />
              <Route
                path="/product/upload"
               
                element={<ProductUpload />}
              />
              <Route
                path="/product/edit/:id"
               
                element={<EditProduct />}
              />
              <Route path="/category" element={<Category />} />
              <Route
                path="/category/edit/:id"
               
                element={<EditCategory />}
              />
              <Route
                path="/subCategory/"
               
                element={<SubCatList />}
              />
              <Route
                path="/productRAMS/add"
               
                element={<AddProductRAMS />}
              />
              <Route
                path="/productWEIGHT/add"
               
                element={<ProductWeight />}
              />
              <Route
                path="/productSIZE/add"
               
                element={<ProductSize />}
              />
              <Route path="/orders/" element={<Orders />} />
              <Route
                path="/homeBannerSlide"
               
                element={<HomeBannerSlideList />}
              />
              <Route
                path="/homeBannerSlide/edit/:id"
               
                element={<EditHomeBannerSlide />}
              />

              <Route path="/banners" element={<BannersList />} />
              <Route
                path="/banners/edit/:id"
               
                element={<EditBanner />}
              />

              <Route path="/homeSideBanners" element={<HomeSideBannersList />} />
              <Route
                path="/homeSideBanners/edit/:id"
               
                element={<EditHomeSideBanner />}
              />

              <Route path="/homeBottomBanners" element={<HomeBottomBannersList />} />
              <Route
                path="/homeBottomBanners/edit/:id"
               
                element={<EditHomeBottomBanner />}
              />
              <Route path="/appSettings" element={<AppSettingsList />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/notifications" element={<Notifications />} />

            </Routes>
          </div>
        </div>
      </MyContext.Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };

