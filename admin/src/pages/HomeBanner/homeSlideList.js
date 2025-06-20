import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseModal from "../../components/common/BaseModal";
import AdminPageLayout from "../../components/common/AdminPageLayout";
import BaseTable from "../../components/common/BaseTable";
import { AddButton, CancelButton } from "../../components/common/ActionButtons";
import { MyContext } from "../../App";
import AddHomeSlide from "./addHomeSlide";
import HomeIcon from "@mui/icons-material/Home";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const HomeSlidesList = () => {
  const [slideList, setSlideList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const context = useContext(MyContext);

  const loadSlides = () => {
    context.setProgress(20);
    fetchDataFromApi("/api/homeBanner").then((res) => {
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
    deleteData(`/api/homeBanner/${id}`).then(() => {
      context.setProgress(100);
      loadSlides();
      context.setProgress({
        open: true,
        error: false,
        msg: "Slide Deleted!",
      });
    });
  };

  const columns = [
    {
      label: "Image",
      render: (row) => (
        <LazyLoadImage alt="slide" effect="blur" src={row.images[0]} style={{ width: 150 }} />
      ),
    },
    { label: "Overlay Text", field: "overlayText" },
    { label: "CTA URL", field: "ctaUrl" },
    { label: "Position", render: (row) => row.position && row.position.replace(/-/g, " ") },
  ];

  return (
    <AdminPageLayout
      title="Home Banner Slide List"
      breadcrumbPath={[
        { icon: <HomeIcon />, label: "Dashboard", href: "/" },
        { icon: <SlideshowIcon />, label: "Home Slides", href: "/homeBannerSlide" },
      ]}
      actions={<AddButton label="Add Home Slide" onClick={() => setOpenModal(true)} />}
    >
      <BaseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Home Slide"
        actions={
          <>
            <CancelButton onClick={() => setOpenModal(false)} />
            <AddButton label="Publish" form="add-slide-form" type="submit" />
          </>
        }
      >
        <AddHomeSlide
          onSuccess={() => {
            setOpenModal(false);
            loadSlides();
          }}
          onClose={() => setOpenModal(false)}
          formId="add-slide-form"
          hideActions
        />
      </BaseModal>

      <BaseTable
        columns={columns}
        rows={slideList}
        onEdit={(row) => navigate(`/homeBannerSlide/edit/${row.id}`)}
        onDelete={(row) => deleteSlide(row.id)}
      />
    </AdminPageLayout>
  );
};

export default HomeSlidesList;
