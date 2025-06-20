'use client';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton image" />
      <div className="skeleton text short" />
      <div className="skeleton text long" />
    </div>
  );
};

export default SkeletonLoader;
