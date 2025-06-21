import React, { useContext, useEffect, useState } from "react";
import { AddButton } from "../../components/common/ActionButtons";
import AddHomeSideBannerPage from './AddHomeSideBannerPage';

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";

import AdminPageLayout from "../../components/common/AdminPageLayout";
import BaseTable from "../../components/common/BaseTable";
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';

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
    if (!window.confirm("Delete this banner?")) return;
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

  if (showForm) {
    return (
      <AddHomeSideBannerPage
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
      title="Home Side Banner List"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ImageIcon fontSize="inherit" />, label: 'Banners', href: '/banners' },
      ]}
      actions={<AddButton onClick={() => setShowForm(true)} label="Add Home Side Banner" />}
    >
      <div className="card shadow border-0 p-3 mt-4">
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
            onEdit={(row) => (window.location.href = `/homeSideBanners/edit/${row.id}`)}
            onDelete={(row) => deleteSlide(row.id)}
          />
        </div>
    </AdminPageLayout>
  );
};

export default BannersList;
