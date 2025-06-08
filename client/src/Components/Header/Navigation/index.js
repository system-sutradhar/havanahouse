import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
import { useState } from "react";
import Link from "next/link";

const Navigation = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLinkClick = () => {
    closeSidebar(); // Close the sidebar when a link is clicked
  };

  return (
    <nav>
      <div className="container">
        <div className="row">
          {/* Sidebar Toggle Button */}
          <div className="col-sm-2 navPart1">
            <div className="catWrapper">
              <Button
                className="allCatTab align-items-center res-hide"
                onClick={toggleSidebar}
              >
                <span className="icon1 mr-2">
                  <IoIosMenu />
                </span>
              </Button>
            </div>
          </div>

          {/* Sidebar Drawer */}
          {isSidebarOpen && (
            <>
              <div className="sidebarOverlay" onClick={closeSidebar}></div>
              <div className={`sidebarDrawer open`}>
                <div className="sidebarHeader">
                  <button className="closeButton" onClick={closeSidebar}>
                    <IoMdClose />
                  </button>
                </div>
                <div className="sidebarContent">
                  <ul>
                    {props.navData?.map((item, index) => (
                      <li key={index}>
                        <Link href={`/category/${item?._id}`} onClick={handleLinkClick}>
                          <Button>
                            {item?.name} <FaAngleRight className="ml-auto" />
                          </Button>
                        </Link>
                        {item?.children?.length > 0 && (
                          <ul className="submenu">
                            {item?.children?.map((subCat, key) => (
                              <li key={key}>
                                <Link
                                  href={`/category/subCat/${subCat?._id}`}
                                  onClick={handleLinkClick}
                                >
                                  <Button>{subCat?.name}</Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;