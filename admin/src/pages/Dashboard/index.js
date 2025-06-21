import DashboardBox from "./components/dashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from "@mui/material/Menu";
import SearchBox from "../../components/SearchBox";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";

import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import BaseTable from "../../components/common/BaseTable";

import AdminPageLayout from "../../components/common/AdminPageLayout";

import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

import Rating from "@mui/material/Rating";
import { deleteData, fetchDataFromApi } from "../../utils/api";

export const data = [
  ["Year", "Sales", "Expenses"],
  ["2013", 1000, 400],
  ["2014", 1170, 460],
  ["2015", 660, 1120],
  ["2016", 1030, 540],
];

export const options = {
  backgroundColor: "transparent",
  chartArea: { width: "100%", height: "100%" },
};

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setshowBy] = useState(10);
  const [showBysetCatBy, setCatBy] = useState("");
  const [productList, setProductList] = useState([]);
  const [categoryVal, setcategoryVal] = useState("all");

  const [totalUsers, setTotalUsers] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [totalProductsReviews, setTotalProductsReviews] = useState();
  const [totalSales, setTotalSales] = useState();
  const [perPage, setPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const open = Boolean(anchorEl);

  const ITEM_HEIGHT = 48;

  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    context.setProgress(40);
    fetchDataFromApi(`/api/products?page=1&perPage=${perPage}`).then((res) => {
      setProductList(res);
      context.setProgress(100);
    });

    fetchDataFromApi("/api/user/get/count").then((res) => {
      setTotalUsers(res.userCount);
    });

    fetchDataFromApi("/api/orders/get/count").then((res) => {
      setTotalOrders(res.orderCount);
    });

    let sales = 0;
    fetchDataFromApi("/api/orders/").then((res) => {
      res?.length !== 0 &&
        res?.map((item) => {
          sales += parseInt(item.amount);
        });

      setTotalSales(sales);
    });

    fetchDataFromApi("/api/products/get/count").then((res) => {
      setTotalProducts(res.productsCount);
    });

    fetchDataFromApi("/api/productReviews/get/count").then((res) => {
      setTotalProductsReviews(res.productsReviews);
    });
  }, []);

  const deleteProduct = () => {
    if (!deleteId) return;
    context.setProgress(40);
    deleteData(`/api/products/${deleteId}`).then(() => {
        context.setProgress(100);
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Product Deleted!",
        });
        fetchDataFromApi(`/api/products?page=${1}&perPage=${perPage}`).then((res) => {
            setProductList(res);
        });
    }).finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
    });
  };

  const handleChange = (event, value) => {
    context.setProgress(40);
    if (categoryVal !== "all") {
      fetchDataFromApi(
        `/api/products/catId?catId=${categoryVal}&page=${value}&perPage=${perPage}`
      ).then((res) => {
        setProductList(res);
        context.setProgress(100);
      });
    } else {
      fetchDataFromApi(`/api/products?page=${value}&perPage=${perPage}`).then(
        (res) => {
          setProductList(res);
          context.setProgress(100);
        }
      );
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const showPerPage = (e) => {
    setshowBy(e.target.value);
    fetchDataFromApi(`/api/products?page=${1}&perPage=${e.target.value}`).then(
      (res) => {
        setProductList(res);
        context.setProgress(100);
      }
    );
  };

  const handleChangeCategory = (event) => {
    if (event.target.value !== "all") {
      setcategoryVal(event.target.value);
      fetchDataFromApi(
        `/api/products/catId?catId=${
          event.target.value
        }&page=${1}&perPage=${perPage}`
      ).then((res) => {
        setProductList(res);
        context.setProgress(100);
      });
    }
    if (event.target.value === "all") {
      setcategoryVal("all");
      setcategoryVal(event.target.value);
      fetchDataFromApi(`/api/products?page=${1}&perPage=${perPage}`).then(
        (res) => {
          setProductList(res);
          context.setProgress(100);
        }
      );
    }
  };



  const searchProducts = (keyword) => {
    if(keyword!==""){
      fetchDataFromApi(`/api/search?q=${keyword}&page=1&perPage=${100000}`).then((res) => {
        setProductList(res);
      })
    }else{
      fetchDataFromApi(`/api/products?page=${1}&perPage=${10}`).then((res) => {
        setProductList(res);
      })
    }
   
}


  return (
    <AdminPageLayout title="Dashboard">
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={<FaUserCircle />}
                grow={true}
                title="Total Users"
                count={totalUsers}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={<IoMdCart />}
                title="Total Orders"
                count={totalOrders}
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={<MdShoppingBag />}
                title="Total Products"
                count={totalProducts}
              />
              <DashboardBox
                color={["#e1950e", "#f3cd29"]}
                icon={<GiStarsStack />}
                title="Total Reviews"
                count={totalProductsReviews}
              />
            </div>
          </div>

          <div className="col-md-4 pl-0 d-none">
            <div className="box graphBox">
              <div className="d-flex align-items-center w-100 bottomEle">
                <h6 className="text-white mb-0 mt-0">Total Sales</h6>
              </div>

              <h3 className="text-white font-weight-bold">
                {totalSales?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </h3>

              <Chart
                chartType="PieChart"
                width="100%"
                height="170px"
                data={data}
                options={options}
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Best Selling Products</h3>

          <div className="row cardFilters mt-3">
            <div className="col-md-3">
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
            </div>

            <div className="col-md-3">
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
                    context.catData?.categoryList?.map((cat, index) => {
                      return (
                        <MenuItem
                          className="text-capitalize"
                          value={cat._id}
                          key={index}
                        >
                          {cat.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>

            <div className="col-md-6 d-flex justify-content-end">
              <div className="searchWrap d-flex">
                <SearchBox searchProducts={searchProducts}/>
              </div>
            </div>
          </div>

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
              onDelete={(row) => { setDeleteId(row.id); setConfirmOpen(true); }}
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
        </div>
      </div>
      <DeleteConfirmDialog
        open={confirmOpen}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={deleteProduct}
      />
    </AdminPageLayout>
  );
};

export default Dashboard;
