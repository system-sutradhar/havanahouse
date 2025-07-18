import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AddButton } from "../../components/common/ActionButtons";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import AddHomeBannerPage from './AddHomeBannerPage';

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";

import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import Skeleton from "@mui/material/Skeleton";
import BaseTable from "../../components/common/BaseTable";
import AdminPageLayout from "../../components/common/AdminPageLayout";
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';

const label = { inputProps: { "aria-label": "Checkbox demo" } };

//breadcrumb code

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
    fetchDataFromApi("/api/banners").then((res) => {
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
    deleteData(`/api/banners/${deleteId}`).then(() => {
      context.setProgress(100);
      context.setAlertBox({
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
      <AddHomeBannerPage
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
      title="Banner Slide List"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
      ]}
      actions={<AddButton onClick={() => setShowForm(true)} label="Add Home Banner" />}
    >
      <div className="card shadow border-0 p-3 mt-4">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
        <BaseTable
            columns={[
              {
                label: "IMAGE",
                field: "images",
                render: (row) => (
                  <div className="d-flex align-items-center" style={{ width: "200px" }}>
                    <div className="imgWrapper" style={{ width: "200px", flex: "0 0 200px" }}>
                      <div className="img card shadow m-0">
                        <LazyLoadImage alt="image" effect="blur" className="w-100" src={row.images[0]} />
                      </div>
                    </div>
                  </div>
                ),
              },
              { label: "CATEGORY", field: "catName" },
              { label: "SUB CATEGORY", field: "subCatName" },
            ]}
            rows={slideList}
            onEdit={(row) => (window.location.href = `/banners/edit/${row.id}`)}
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
