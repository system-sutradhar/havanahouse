"use client";
import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import QuantityBox from "@/Components/QuantityBox";
import { MyContext } from "@/context/ThemeContext";

const StickyAddToCart = ({ product }) => {
  const [qty, setQty] = useState(1);
  const context = useContext(MyContext);

  if (!product) return null;

  const handleAdd = () => {
    const data = {
      productId: product.id,
      userId: context.user?.userId,
      quantity: qty,
      price: product.price,
      productTitle: product.name,
      image: product.images?.[0] || "",
    };
    context.addToCart(data);
  };

  return (
    <div className="sticky-add-cart d-md-none">
      <div className="d-flex justify-content-between align-items-center gap-2">
        <div>
          <Typography variant="subtitle2" className="sticky-title">
            {product.name}
          </Typography>
          <Typography variant="subtitle1" className="sticky-price fw-bold">
            ₹{product.price}
          </Typography>
        </div>
        <div className="d-flex align-items-center gap-2">
          <QuantityBox value={qty} onChange={setQty} item={product} />
          <Button variant="contained" className="add-cart-btn" onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;
