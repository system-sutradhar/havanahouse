"use client";
import { useState, useContext } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import QuantityBox from "@/Components/QuantityBox";
import { MyContext } from "@/context/ThemeContext";
import AboutProductContent from "./AboutProductContent";

const ProductInfoSection = ({ product }) => {
  const [qty, setQty] = useState(1);
  const context = useContext(MyContext);

  const handleAdd = () => {
    if (!product) return;
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
    <div className="product-info-section">
      <div className="add-cart-box mb-4">
        <Typography variant="h6" className="price mb-2">
          {product.discount ? (
            <>
              <span className="old-price me-2">₹{product.oldPrice}</span>
              ₹{product.price}
            </>
          ) : (
            `₹${product.price}`
          )}
        </Typography>
        <div className="d-flex align-items-center gap-2 mb-2">
          <QuantityBox value={qty} onChange={setQty} item={product} />
          <Button
            variant="contained"
            className="add-cart-btn"
            onClick={handleAdd}
            disabled={product.countInStock <= 0}
          >
            {product.countInStock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
      <AboutProductContent product={product} />
    </div>
  );
};

export default ProductInfoSection;
