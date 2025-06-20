import React, { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { AddButton } from '../../components/common/ActionButtons';

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";

import { Link } from "react-router-dom";

import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import BaseTable from '../../components/common/BaseTable';

import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import AddCategory from "./addCategory";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

//breadcrumb code


const Category = () => {

    const [catData, setCatData] = useState([]);
    const [isLoadingBar, setIsLoadingBar] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const context = useContext(MyContext);

    const loadCategories = () => {
        context.setProgress(20)
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            context.setProgress(100);
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        loadCategories();
    }, []);

    const deleteCat = (id) => {
        
        setIsLoadingBar(true);
        context.setProgress(30);
        deleteData(`/api/category/${id}`).then(res => {
            context.setProgress(100);
            loadCategories();
            context.setProgress({
                open: true,
                error: false,
                msg: "Category Deleted!"
            })
            setIsLoadingBar(false);
        })
    }



    return (
        <>
            <Container className="right-content" maxWidth={false}>
                <div className="card shadow border-0 w-100 p-4">
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <h5 className="mb-0">Category List</h5>
                        <Box display="flex" alignItems="center">
                            <AppBreadcrumbs title="Category" path={[{ label: 'Dashboard', href: '/' }]} />
                            <AddButton
                                onClick={() => setShowForm(!showForm)}
                                label={showForm ? 'Close' : 'Add Category'}
                            />
                        </Box>
                    </Box>
                </div>

                {showForm && (
                    <div className="card shadow border-0 p-3 mt-4">
                        <AddCategory onSuccess={() => { setShowForm(false); loadCategories(); }} />
                    </div>
                )}

                <div className="card shadow border-0 p-3 mt-4">
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
                        onDelete={(row) => deleteCat(row._id)}
                    />
                </div>


        </Container>

        </>
    )
}

export default Category;
