import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLayout from "../../components/common/AdminPageLayout";
import BaseTable from "../../components/common/BaseTable";
import { AddButton } from "../../components/common/ActionButtons";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import AddHomeSlidePage from './AddHomeSlidePage';
import { MyContext } from "../../App";
import HomeIcon from "@mui/icons-material/Home";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Skeleton from "@mui/material/Skeleton";

const HomeSlidesList = () => {
  const [slideList, setSlideList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const context = useContext(MyContext);

  const loadSlides = () => {
    setLoading(true);
    context.setProgress(20);
    fetchDataFromApi("/api/homeBanner").then((res) => {
      setSlideList(res);
      context.setProgress(100);
      setLoading(false);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSlides();
  }, []);

  const deleteSlide = () => {
    if (!deleteId) return;
    setLoading(true);
    context.setProgress(30);
    deleteData(`/api/homeBanner/${deleteId}`).then(() => {
      context.setProgress(100);
      loadSlides();
      context.setProgress({
        open: true,
        error: false,
        msg: "Slide Deleted!",
      });
    }).finally(() => {
      setConfirmOpen(false);
      setDeleteId(null);
      setLoading(false);
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
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
        <BaseTable
          columns={columns}
          rows={slideList}
          onEdit={(row) => navigate(`/homeBannerSlide/edit/${row.id}`)}
          onDelete={(row) => { setDeleteId(row.id); setConfirmOpen(true); }}
        />
        )}
      </div>
      <DeleteConfirmDialog
        open={confirmOpen}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={deleteSlide}
      />
    </AdminPageLayout>
  );
};

export default HomeSlidesList;
