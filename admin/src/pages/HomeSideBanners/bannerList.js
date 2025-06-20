import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AddButton } from "../../components/common/ActionButtons";

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";
import AddHomeSideBanner from "./addHomeSideBanner";

import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

//breadcrumb code

const BannersList = () => {
  const [slideList, setSlideList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const context = useContext(MyContext);

  const loadSlides = () => {
    context.setProgress(20);
    fetchDataFromApi("/api/homeSideBanners").then((res) => {
      setSlideList(res);
      context.setProgress(100);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSlides();
  }, []);

  const deleteSlide = (id) => {
    context.setProgress(30);
    deleteData(`/api/homeSideBanners/${id}`).then((res) => {
      context.setProgress(100);
      context.setProgress({
        open: true,
        error: false,
        msg: "Banner Deleted!",
      });
      loadSlides();
    });
   
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Home Side Banner List</h5>

          <div className="ml-auto d-flex align-items-center">
            <AppBreadcrumbs title="Banners" path={[{ label: 'Dashboard', href: '/' }]} />

            <AddButton
              onClick={() => setShowForm(!showForm)}
              label={showForm ? 'Close' : 'Add Home Side Banner'}
            />
          </div>
        </div>

        {showForm && (
          <div className="card shadow border-0 p-3 mt-4">
            <AddHomeSideBanner onSuccess={() => { setShowForm(false); loadSlides(); }} />
          </div>
        )}

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th style={{ width: "200px" }}>IMAGE</th>
                  <th>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {slideList?.length !== 0 &&
                  slideList?.map((item, index) => {
                    return (
                      <tr>
                        <td>
                          <div
                            className="d-flex align-items-center "
                            style={{ width: "200px" }}
                          >
                            <div
                              className="imgWrapper"
                              style={{ width: "200px", flex: "0 0 200px" }}
                            >
                              <div className="img card shadow m-0">
                                <LazyLoadImage
                                  alt={"image"}
                                  effect="blur"
                                  className="w-100"
                                  src={item.images[0]}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{item.catName}</td>
                        <td>{item.subCatName}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Link to={`/homeSideBanners/edit/${item.id}`}>
                              {" "}
                              <Button className="success" color="success">
                                <FaPencilAlt />
                              </Button>
                            </Link>

                            <Button
                              className="error"
                              color="error"
                              onClick={() => deleteSlide(item.id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannersList;
