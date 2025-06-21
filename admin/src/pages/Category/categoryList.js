import React, { useContext, useEffect, useState } from "react";
import { AddButton, CancelButton } from '../../components/common/ActionButtons';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

import { MyContext } from "../../App";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import BaseTable from '../../components/common/BaseTable';

import { deleteData, fetchDataFromApi } from "../../utils/api";
import Skeleton from '@mui/material/Skeleton';
import CategoryForm from "./CategoryForm";
import AdminPageLayout from '../../components/common/AdminPageLayout';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

//breadcrumb code


const Category = () => {

    const [catData, setCatData] = useState([]);
    const [isLoadingBar, setIsLoadingBar] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const context = useContext(MyContext);

    const loadCategories = () => {
        setIsLoadingBar(true);
        context.setProgress(20)
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            context.setProgress(100);
            setIsLoadingBar(false);
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        loadCategories();
    }, []);

    const deleteCat = () => {
        if (!deleteId) return;
        setIsLoadingBar(true);
        context.setProgress(30);
        deleteData(`/api/category/${deleteId}`).then(res => {
            context.setProgress(100);
            loadCategories();
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Category Deleted!"
            })
            setIsLoadingBar(false);
        }).finally(() => {
            setConfirmOpen(false);
            setDeleteId(null);
        })
    }



    if (showForm) {
        return (
            <AdminPageLayout
                title="Add Category"
                breadcrumbPath={[
                    { icon: <HomeIcon fontSize='inherit' />, label: 'Dashboard', href: '/' },
                    { icon: <CategoryIcon fontSize='inherit' />, label: 'Categories', href: '/categories' },
                    { label: 'Add' },
                ]}
                actions={<CancelButton onClick={() => setShowForm(false)} />}
            >
                <CategoryForm
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => { setShowForm(false); loadCategories(); }}
                />
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout
            title="Category List"
            breadcrumbPath={[
                { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
                { icon: <CategoryIcon fontSize="inherit" />, label: 'Categories', href: '/categories' },
            ]}
            actions={<AddButton onClick={() => setShowForm(true)} label="Add Category" />}
        >
            <div className="card shadow border-0 p-3 mt-4">
                {isLoadingBar ? (
                    <Skeleton variant="rectangular" width="100%" height={200} />
                ) : (
                <BaseTable
                    columns={[
                        {
                            label: 'IMAGE',
                            field: 'images',
                            render: (row) => (
                                <div className="d-flex align-items-center" style={{ width: '150px' }}>
                                    <div className="imgWrapper" style={{ width: '50px', flex: '0 0 50px' }}>
                                        <div className="img card shadow m-0">
                                            <LazyLoadImage alt="image" effect="blur" className="w-100" src={row.images[0]} />
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                        { label: 'CATEGORY', field: 'name' },
                        { label: 'COLOR', field: 'color' },
                    ]}
                    rows={catData?.categoryList?.slice(0).reverse() || []}
                    onEdit={(row) => (window.location.href = `/category/edit/${row._id}`)}
                    onDelete={(row) => { setDeleteId(row._id); setConfirmOpen(true); }}
                />
                )}
            </div>
            <DeleteConfirmDialog
                open={confirmOpen}
                onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
                onConfirm={deleteCat}
            />
        </AdminPageLayout>
    );
}

export default Category;
