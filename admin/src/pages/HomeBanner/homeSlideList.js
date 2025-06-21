import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLayout from "../../components/common/AdminPageLayout";
import BaseTable from "../../components/common/BaseTable";
import { AddButton } from "../../components/common/ActionButtons";
import AddHomeSlidePage from './AddHomeSlidePage';
import { MyContext } from "../../App";
import AddHomeSlide from "./addHomeSlide";
import HomeIcon from "@mui/icons-material/Home";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const HomeSlidesList = () => {
  const [slideList, setSlideList] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  if (showForm) {
    return (
      <AddHomeSlidePage
        onCancel={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          loadSlides();
        }}
      />
    );
  }

  return (
    <AdminPageLayout
      title="Home Banner Slide List"
      breadcrumbPath={[
        { icon: <HomeIcon />, label: "Dashboard", href: "/" },
        { icon: <SlideshowIcon />, label: "Home Slides", href: "/homeBannerSlide" },
      ]}
      actions={<AddButton label="Add Home Slide" onClick={() => setShowForm(true)} />}
    >
      <div className="card shadow border-0 p-3 mt-4">
        <BaseTable
          columns={columns}
          rows={slideList}
          onEdit={(row) => navigate(`/homeBannerSlide/edit/${row.id}`)}
          onDelete={(row) => deleteSlide(row.id)}
        />
      </div>
    </AdminPageLayout>
  );
};

export default HomeSlidesList;
