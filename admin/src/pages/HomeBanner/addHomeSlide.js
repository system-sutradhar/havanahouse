import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { MenuItem, Select } from "@mui/material";
import {
  deleteData,
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";
import { FaRegImages } from "react-icons/fa";
import { MyContext } from "../../App";

import CircularProgress from "@mui/material/CircularProgress";
import { IoCloseSharp } from "react-icons/io5";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddHomeSlide = ({ onSuccess, onClose , formId = "add-slide-form", hideActions = false}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formFields, setFormFields] = useState({
    images: [],
    overlayText: "",
    ctaUrl: "",
    position: "center",
  });

  const [previews, setPreviews] = useState([]);

  const formdata = new FormData();

  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/homeBanner/deleteImage?img=${img}`).then((res) => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });
  }, []);

  let img_arr = [];
  let uniqueArray = [];
  let selectedImages = [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;

      console.log(files);
      setUploading(true);

      //const fd = new FormData();
      for (var i = 0; i < files.length; i++) {
        // Validate file type
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp" ||
            files[i].type === "video/mp4" ||
            files[i].type === "video/webm")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`images`, file);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Please select a valid JPG, PNG, WEBP, MP4 or WEBM file.",
          });

          return false;
        }
      }

      formFields.images = selectedImages;
    } catch (error) {
      console.log(error);
    }

    uploadImage(apiEndPoint, formdata).then((res) => {
      console.log(selectedImages);
      fetchDataFromApi("/api/imageUpload").then((response) => {
        if (
          response !== undefined &&
          response !== null &&
          response !== "" &&
          response.length !== 0
        ) {
          response.length !== 0 &&
            response.map((item) => {
              item?.images.length !== 0 &&
                item?.images?.map((img) => {
                  img_arr.push(img);
                  //console.log(img)
                });
            });

          uniqueArray = img_arr.filter(
            (item, index) => img_arr.indexOf(item) === index
          );

          // const appendedArray = [...previews, ...uniqueArray];

          setPreviews(uniqueArray);
          setTimeout(() => {
            setUploading(false);
            img_arr = [];
            context.setAlertBox({
              open: true,
              error: false,
              msg: "Images Uploaded!",
            });
          }, 200);
        }
      });
    });
  };

  const removeImg = async (index, imgUrl) => {
    const imgIndex = previews.indexOf(imgUrl);

    deleteImages(`/api/homeBanner/deleteImage?img=${imgUrl}`).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Image Deleted!",
      });
    });

    if (imgIndex > -1) {
      // only splice array when item is found
      previews.splice(index, 1); // 2nd parameter means remove one item only
    }
  };

  const addHomeSlide = (e) => {
    e.preventDefault();

    const appendedArray = [...previews, ...uniqueArray];

    img_arr = [];

    formdata.append("images", appendedArray);

    formFields.images = appendedArray;

    if (previews.length !== 0) {
      setIsLoading(true);

      postData(`/api/homeBanner/create`, formFields).then((res) => {
        // console.log(res);
        setIsLoading(false);
        context.fetchCategory();

        deleteData("/api/imageUpload/deleteAllImages");

        if (onSuccess) onSuccess();
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return false;
    }
  };

  return (
    <>
      <form id={formId} className="form" onSubmit={addHomeSlide}>
          <div className="row">
            <div className="col-sm-9">
              <div className="card p-4 mt-0">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>OVERLAY TEXT</h6>
                      <input
                        type="text"
                        name="overlayText"
                        className="form-control"
                        value={formFields.overlayText}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>CTA URL</h6>
                      <input
                        type="text"
                        name="ctaUrl"
                        className="form-control"
                        value={formFields.ctaUrl}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>POSITION</h6>
                      <Select
                        value={formFields.position}
                        name="position"
                        onChange={handleChange}
                        className="w-100"
                        required
                      >
                        <MenuItem value="top-left">Top Left</MenuItem>
                        <MenuItem value="top-center">Top Center</MenuItem>
                        <MenuItem value="top-right">Top Right</MenuItem>
                        <MenuItem value="center-left">Center Left</MenuItem>
                        <MenuItem value="center">Center</MenuItem>
                        <MenuItem value="center-right">Center Right</MenuItem>
                        <MenuItem value="bottom-left">Bottom Left</MenuItem>
                        <MenuItem value="bottom-center">Bottom Center</MenuItem>
                        <MenuItem value="bottom-right">Bottom Right</MenuItem>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="imagesUploadSec">
                  <h5 className="mb-4">Media And Published</h5>

                  <div className="imgUploadBox d-flex align-items-center">
                    {previews?.length !== 0 &&
                      previews?.map((img, index) => {
                        return (
                          <div className="uploadBox" key={index}>
                            <span
                              className="remove"
                              onClick={() => removeImg(index, img)}
                            >
                              <IoCloseSharp />
                            </span>
                            <div className="box">
                              <div
                                className={`overlayPreview position-${formFields.position}`}
                              >
                                {formFields.overlayText && (
                                  <span>{formFields.overlayText}</span>
                                )}
                                {formFields.ctaUrl && (
                                  <a
                                    href={formFields.ctaUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="cta"
                                  >
                                    Visit
                                  </a>
                                )}
                              </div>
                              <LazyLoadImage
                                alt={"image"}
                                effect="blur"
                                className="w-100"
                                src={img}
                              />
                            </div>
                          </div>
                        );
                      })}

                    <div className="uploadBox">
                      {uploading === true ? (
                        <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                          <CircularProgress />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              onChangeFile(e, "/api/homeBanner/upload")
                            }
                            name="images"
                          />
                          <div className="info">
                            <FaRegImages />
                            <h5>image upload</h5>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <br />
{!hideActions && (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    className="mt-2"
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      className="btn-blue btn-lg btn-big"
                      fullWidth
                    >
                      <FaCloudUploadAlt /> &nbsp;
                      {isLoading === true ? (
                        <CircularProgress color="inherit" className="loader" />
                      ) : (
                        "PUBLISH AND VIEW"
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={onClose}
                      className="btn-blue btn-lg btn-big"
                      fullWidth
                    >
                      Close
                    </Button>
                  </Stack>
)}
                </div>
              </div>
            </div>
          </div>
        </form>
    </>
  );
};

export default AddHomeSlide;
