'use client';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const RelatedProducts = ({ currentProductId, data }) => {
  const [related, setRelated] = useState(data || []);

  useEffect(() => {
    if (data) {
      setRelated(data);
      return;
    }
    const fetchRelated = async () => {
      const res = await fetch(`/api/related?exclude=${currentProductId}`);
      const rdata = await res.json();
      setRelated(rdata.products || []);
    };
    fetchRelated();
  }, [currentProductId, data]);

  return (
    <div className="related-products">
      <h2>You may also like</h2>
      <div className="related-carousel">
        {related.map((item) => (
          <div key={item.id} className="related-card">
            {item.thumbnail ? (
              <LazyLoadImage
                src={item.thumbnail}
                alt={item.name}
                effect="blur"
                loading="lazy"
              />
            ) : (
              <div className="placeholder-image" aria-label="No image available" />
            )}
            <p>{item.name}</p>
            <strong>₹{item.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
