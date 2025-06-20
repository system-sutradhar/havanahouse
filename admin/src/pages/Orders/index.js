import React, { useContext } from "react";
import { editData, fetchDataFromApi } from "../../utils/api";
import { useState } from "react";
import { useEffect } from "react";

import AdminPageLayout from "../../components/common/AdminPageLayout";
import Pagination from "@mui/material/Pagination";
import BaseModal from "../../components/common/BaseModal";
import { CancelButton } from "../../components/common/ActionButtons";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MyContext } from "../../App";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

//breadcrumb code

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [products, setproducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [singleOrder, setSingleOrder] = useState();
  const [statusVal, setstatusVal] = useState(null);

  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/orders`).then((res) => {
      setOrders(res);
    });
  }, []);

  const showProducts = (id) => {
    fetchDataFromApi(`/api/orders/${id}`).then((res) => {
      setIsOpenModal(true);
      setproducts(res.products);
    });
  };

  const handleChangeStatus = (e, orderId) => {
    setstatusVal(e.target.value);
    setIsLoading(true);
    context.setProgress(40);
    fetchDataFromApi(`/api/orders/${orderId}`).then((res) => {
      const order = {
        name: res.name,
        phoneNumber: res.phoneNumber,
        address: res.address,
        pincode: res.pincode,
        amount: parseInt(res.amount),
        paymentId: res.paymentId,
        email: res.email,
        userid: res.userId,
        products: res.products,
        status: e.target.value,
      };

      editData(`/api/orders/${orderId}`, order).then((res) => {
        fetchDataFromApi(`/api/orders`).then((res) => {
          setOrders(res);
          // window.scrollTo({
          //   top: 200,
          //   behavior: "smooth",
          // });
        });
        context.setProgress(100);
        setIsLoading(false);
      });

      setSingleOrder(res.products);
    });
  };

  //   const orderStatus = (orderStatus, id) => {
  //     fetchDataFromApi(`/api/orders/${id}`).then((res) => {
  //       const order = {
  //         name: res.name,
  //         phoneNumber: res.phoneNumber,
  //         address: res.address,
  //         pincode: res.pincode,
  //         amount: parseInt(res.amount),
  //         paymentId: res.paymentId,
  //         email: res.email,
  //         userid: res.userId,
  //         products: res.products,
  //         status: orderStatus,
  //       };

  //       editData(`/api/orders/${id}`, order).then((res) => {
  //         fetchDataFromApi(`/api/orders`).then((res) => {
  //           setOrders(res);
  //           window.scrollTo({
  //             top: 200,
  //             behavior: "smooth",
  //           });
  //         });
  //       });

  //       setSingleOrder(res.products);
  //     });
  //   };

  return (
    <>
      <AdminPageLayout
        title="Orders List"
        breadcrumbPath={[
          { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
          { icon: <ListAltIcon fontSize="inherit" />, label: 'Orders', href: '/orders' },
        ]}
      >

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3 orderTable">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th>Order Id</th> 
                  <th>Paymant Id</th>
                  <th>Products</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Total Amount</th>
                  <th>Email</th>
                  <th>User Id</th>
                  <th>Order Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders?.length !== 0 &&
                  orders?.map((order, index) => {
                    return (
                      <>
                        <tr key={index}>
                        <td>
                        <span className="text-blue fonmt-weight-bold">
                          {order?._id}
                        </span>
                      </td>
                          <td>
                            <span className="text-blue fonmt-weight-bold">
                              {order?.paymentId}
                            </span>
                          </td>
                          <td>
                            <span
                              className="text-blue fonmt-weight-bold cursor"
                              onClick={() => showProducts(order?._id)}
                            >
                              Click here to view
                            </span>
                          </td>
                          <td>{order?.name}</td>
                          <td>
                            <FaPhoneAlt /> {order?.phoneNumber}
                          </td>
                          <td>{order?.address}</td>
                          <td>{order?.pincode}</td>
                          <td>
                            <MdOutlineCurrencyRupee /> {order?.amount}
                          </td>
                          <td>
                            <MdOutlineEmail /> {order?.email}
                          </td>
                          <td>{order?.userid}</td>
                          <td>
                            <Select
                            disabled={isLoading===true ? true: false}
                              value={
                                order?.status !== null
                                  ? order?.status
                                  : statusVal
                              }
                              onChange={(e) =>
                                handleChangeStatus(e, order?._id)
                              }
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              size="small"
                              className="w-100"
                            >
                              <MenuItem value={null}>
                                <em value={null}>None</em>
                              </MenuItem>

                              <MenuItem value="pending">Pending</MenuItem>

                              <MenuItem value="confirm">Confirm</MenuItem>

                              <MenuItem value="delivered">Delivered</MenuItem>
                            </Select>
                          </td>
                          <td>
                            <MdOutlineDateRange /> {order?.date?.split("T")[0]}
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

      <BaseModal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Products"
        actions={<CancelButton onClick={() => setIsOpenModal(false)} />}
      >
        <div className="table-responsive orderTable">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Product Id</th>
                <th>Product Title</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>SubTotal</th>
              </tr>
            </thead>

            <tbody>
              {products?.length !== 0 &&
                products?.map((item, index) => {
                  return (
                    <tr>
                      <td>{item?.productId}</td>
                      <td style={{ whiteSpace: "inherit" }}>
                        <span>{item?.productTitle?.substr(0, 30) + "..."}</span>
                      </td>
                      <td>
                        <div className="img">
                          <img src={item?.image} />
                        </div>
                      </td>
                      <td>{item?.quantity}</td>
                      <td>{item?.price}</td>
                      <td>{item?.subTotal}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </BaseModal>
    </AdminPageLayout>
    </>
  );
};

export default Orders;
