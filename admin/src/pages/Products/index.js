import { MdShoppingBag } from "react-icons/md";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AddButton, CancelButton, DeleteButton } from "../../components/common/ActionButtons";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MdCategory } from "react-icons/md";

import { IoShieldCheckmarkSharp } from "react-icons/io5";

import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";

import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddProduct from "./addProduct";

import AdminPageLayout from "../../components/common/AdminPageLayout";
import DashboardBox from "../Dashboard/components/dashboardBox";
import SearchBox from "../../components/SearchBox";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import BaseTable from "../../components/common/BaseTable";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';




const Products = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setshowBy] = useState(10);
  const [categoryVal, setcategoryVal] = useState("all");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState();
  const [totalCategory, setTotalCategory] = useState();
  const [totalSubCategory, setTotalSubCategory] = useState();
  const [isLoadingBar, setIsLoadingBar] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const open = Boolean(anchorEl);

  const context = useContext(MyContext);

  const [productList, setProductList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const ITEM_HEIGHT = 48;

  const loadProducts = async (pageVal = 1) => {
    setLoading(true);
    const query =
      categoryVal !== "all"
        ? `/api/products/catId?catId=${categoryVal}&page=${pageVal}&perPage=${perPage}`
        : `/api/products?page=${pageVal}&perPage=${perPage}`;
    try {
      const res = await fetchDataFromApi(query);
      if (res?.products) {
        setProductList(res);
        setError(null);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
      context.setProgress(100);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInitial = async () => {
      context.setProgress(40);
      try {
        await loadProducts(1);

        const count = await fetchDataFromApi("/api/products/get/count");
        setTotalProducts(count.productsCount);

        const catCount = await fetchDataFromApi("/api/category/get/count");
        setTotalCategory(catCount.categoryCount);

        const subCount = await fetchDataFromApi("/api/category/subCat/get/count");
        setTotalSubCategory(subCount.categoryCount);
      } catch (err) {
        setError("Failed to load products");
      }
    };
    fetchInitial();
  }, []);

  const deleteProduct = (id) => {
    context.setProgress(40);
    setIsLoadingBar(true);
    deleteData(`/api/products/${id}`).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Product Deleted!",
      });

      loadProducts(page);
      context.fetchCategory();
      setIsLoadingBar(false);
    });
  };

  const handleChange = (event, value) => {
    context.setProgress(40);
    loadProducts(value);
  };

  const showPerPage = (e) => {
    setshowBy(e.target.value);
    loadProducts(1);
  };

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    loadProducts(1);
  };


  const searchProducts = (keyword) => {
    if(keyword!==""){
      fetchDataFromApi(`/api/search?q=${keyword}&page=1&perPage=${10000}`).then((res) => {
        setProductList(res);
      })
    }else{
      fetchDataFromApi(`/api/products?page=${1}&perPage=${10}`).then((res) => {
        setProductList(res);
      })
    }
   
}


  return (
    <>
      <AdminPageLayout
        title="Product List"
        breadcrumbPath={[
          { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
          { icon: <StorefrontIcon fontSize="inherit" />, label: 'Products', href: '/products' },
        ]}
      >

        <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={<MdShoppingBag />}
                title="Total Products"
                count={totalProducts}
                grow={true}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={<MdCategory />}
                title="Total Categories"
                count={totalCategory}
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={<IoShieldCheckmarkSharp />}
                title="Total Sub Category"
                count={totalSubCategory}
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <h3 className="hd mb-0">Best Selling Products</h3>
            <Box>
              {!showForm && (
                <AddButton onClick={() => setShowForm(true)} label="Add Product" />
              )}
              {showForm && <CancelButton onClick={() => setShowForm(false)} />}
          </Box>
        </Box>

        {showForm && (
          <Box mt={3}>
            <AddProduct onSuccess={() => { setShowForm(false); loadProducts(); }} />
          </Box>
        )}

        <Grid container spacing={2} className="cardFilters mt-3">
          <Grid item xs={12} md={3}>
            <h4>SHOW BY</h4>
            <FormControl size="small" className="w-100">
              <Select
                value={showBy}
                onChange={showPerPage}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                labelId="demo-select-small-label"
                className="w-100"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={60}>60</MenuItem>
                <MenuItem value={70}>70</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack
              direction={isSmall ? "column" : "row"}
              spacing={2}
              alignItems={isSmall ? "stretch" : "flex-end"}
            >
              <Box flex={1}>
                <h4>CATEGORY BY</h4>
                <FormControl size="small" className="w-100">
                  <Select
                    value={categoryVal}
                    onChange={handleChangeCategory}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    className="w-100"
                  >
                    <MenuItem value="all">
                      <em>All</em>
                    </MenuItem>
                    {context.catData?.categoryList?.length !== 0 &&
                      context.catData?.categoryList?.map((cat, index) => (
                        <MenuItem
                          className="text-capitalize"
                          value={cat._id}
                          key={index}
                        >
                          {cat.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <Box flex={1} sx={{ display: "flex", justifyContent: isSmall ? "flex-start" : "flex-end" }}>
                <div className="searchWrap d-flex" style={{ width: "100%" }}>
                  <SearchBox searchProducts={searchProducts} />
                </div>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => loadProducts(page)}>
                Retry
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <div className="table-responsive mt-3">
            <BaseTable
              columns={[
                {
                  label: 'PRODUCT',
                  field: 'name',
                  render: (row) => (
                    <Box display="flex" alignItems="center">
                      <Avatar src={row.images[0]} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
                      <Box>
                        <h6>{row.name}</h6>
                        <p>{row.description}</p>
                      </Box>
                    </Box>
                  ),
                },
                { label: 'CATEGORY', field: 'category', render: (row) => row.category?.name },
                { label: 'SUB CATEGORY', field: 'subCatName' },
                { label: 'BRAND', field: 'brand' },
                {
                  label: 'PRICE',
                  field: 'price',
                  render: (row) => (
                    <div style={{ width: '70px' }}>
                      <del className="old">Rs {row.oldPrice}</del>
                      <span className="new text-danger">Rs {row.price}</span>
                    </div>
                  ),
                },
                {
                  label: 'RATING',
                  field: 'rating',
                  render: (row) => (
                    <Rating name="read-only" defaultValue={row.rating} precision={0.5} size="small" readOnly />
                  ),
                },
              ]}
              rows={productList?.products || []}
              onEdit={(row) => (window.location.href = `/product/edit/${row.id}`)}
              onDelete={(row) => deleteProduct(row.id)}
            />

            {productList?.totalPages > 1 && (
              <div className="d-flex tableFooter">
                <Pagination
                  count={productList?.totalPages}
                  color="primary"
                  className="pagination"
                  showFirstButton
                  showLastButton
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        )}
        </div>
      </AdminPageLayout>
    </>
  );
};

export default Products;
