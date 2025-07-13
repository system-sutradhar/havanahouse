import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = () => {
  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">Filter By</h3>
      
      <div className="filter-group">
        <h4>Category</h4>
        <ul>
          <li><label><input type="checkbox" /> Cuban</label></li>
          <li><label><input type="checkbox" /> New World</label></li>
          <li><label><input type="checkbox" /> Samplers</label></li>
          <li><label><input type="checkbox" /> Limited Edition</label></li>
        </ul>
      </div>
      
      <div className="filter-group">
        <h4>Brand</h4>
        <ul>
          <li><label><input type="checkbox" /> Cohiba</label></li>
          <li><label><input type="checkbox" /> Oliva</label></li>
          <li><label><input type="checkbox" /> Montecristo</label></li>
          <li><label><input type="checkbox" /> Arturo Fuente</label></li>
        </ul>
      </div>

      <div className="filter-group">
        <h4>Price Range</h4>
        <input type="range" min="1" max="500" className="price-slider" />
        <div className="price-range-display">
            <span>£1</span>
            <span>£500</span>
        </div>
      </div>

       <div className="filter-group">
        <h4>Strength</h4>
        <ul>
          <li><label><input type="checkbox" /> Mild</label></li>
          <li><label><input type="checkbox" /> Medium</label></li>
          <li><label><input type="checkbox" /> Full</label></li>
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;