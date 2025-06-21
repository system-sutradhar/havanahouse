"use client";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/ThemeContext";

const QuantityBox = ({ value = 1, onChange, quantity, selectedItem, item }) => {
  const [inputVal, setInputVal] = useState(value);
  const context = useContext(MyContext);

  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      setInputVal(parseInt(value));
    }
  }, [value]);

  const propagateChange = (val) => {
    if (onChange) onChange(val);
    if (quantity) quantity(val);
    if (selectedItem) selectedItem(item, val);
  };

  const minus = () => {
    if (inputVal > 1) {
      const newVal = inputVal - 1;
      setInputVal(newVal);
      propagateChange(newVal);
    }
    context.setAlertBox({ open: false });
  };

  const plus = () => {
    const stock = item?.countInStock ? parseInt(item.countInStock) : Infinity;
    if (inputVal < stock) {
      const newVal = inputVal + 1;
      setInputVal(newVal);
      propagateChange(newVal);
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "The quantity is greater than product count in stock",
      });
    }
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setInputVal(val);
    propagateChange(val);
  };

  useEffect(() => {
    if (!item?.countInStock) return;
    const countInStock = parseInt(item.countInStock);
    if (inputVal > countInStock) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "The quantity is greater than product count in stock",
      });
    } else {
      context.setAlertBox({ open: false });
    }
  }, [inputVal, item]);

  return (
    <div className="quantityDrop d-flex align-items-center">
      <Button onClick={minus} aria-label="Decrease quantity">
        <FaMinus />
      </Button>
      <input type="text" value={inputVal} onChange={handleChange} />
      <Button onClick={plus} aria-label="Increase quantity">
        <FaPlus />
      </Button>
    </div>
  );
};

export default QuantityBox;
