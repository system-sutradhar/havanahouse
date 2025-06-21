import React, { useContext, useEffect, useState } from "react";
import { AddButton } from "../../components/common/ActionButtons";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import AddHomeBottomBannerPage from './AddHomeBottomBannerPage';

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";

import AdminPageLayout from "../../components/common/AdminPageLayout";
import BaseTable from "../../components/common/BaseTable";
import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import Skeleton from "@mui/material/Skeleton";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

// breadcrumb code

const BannersList = () => {
  const [slideList, setSlideList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const context = useContext(MyContext);

  const loadSlides = () => {
    setLoading(true);
    context.setProgress(20);
    fetchDataFromApi("/api/homeBottomBanners").then((res) => {
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
    deleteData(`/api/homeBottomBanners/${deleteId}`).then((res) => {
      context.setProgress(100);
      context.setProgress({
        open: true,
        error: false,
        msg: "Banner Deleted!",
      });
      loadSlides();
    }).finally(() => {
      setConfirmOpen(false);
      setDeleteId(null);
      setLoading(false);
    });
  };

  if (showForm) {
    return (
      <AddHomeBottomBannerPage
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
      title="Home Bottom Banner List"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
      ]}
      actions={<AddButton onClick={() => setShowForm(true)} label="Add Home Bottom Banner" />}
    >
      <div className="card shadow border-0 p-3 mt-4">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
        <BaseTable
          columns={[
            {
                label: 'IMAGE',
                field: 'images',
                render: (row) => (
                  <div style={{ width: '200px' }}>
                    <LazyLoadImage alt="image" effect="blur" className="w-100" src={row.images[0]} />
                  </div>
                ),
              },
              { label: 'CATEGORY', field: 'catName' },
              { label: 'SUB CATEGORY', field: 'subCatName' },
            ]}
            rows={slideList}
            onEdit={(row) => (window.location.href = `/homeBottomBanners/edit/${row.id}`)}
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

export default BannersList;
