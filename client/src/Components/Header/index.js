// "use client";
// import React, { useContext, useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { FaUser, FaHeart, FaShoppingBag, FaSearch, FaBars } from "react-icons/fa";
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// import { TextField, InputAdornment, IconButton, Drawer } from "@mui/material";
// import { MyContext } from "@/context/ThemeContext";
// import "../../app/header.css";

// const Header = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [cartCount, setCartCount] = useState(0);
//   const [showNotification, setShowNotification] = useState(true);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const headerRef = useRef();
//   const context = useContext(MyContext);
//   const router = useRouter();

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (headerRef.current) {
//         headerRef.current.classList.toggle("fixed", window.scrollY > 100);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const searchProducts = () => {
//     if (searchInput.trim()) {
//       context.setIsLoading(true);
//       fetch(`/api/search?q=${searchInput}`)
//         .then((res) => res.json())
//         .then((data) => {
//           context.setSearchData(data);
//           context.setIsLoading(false);
//           router.push("/search");
//         });
//     }
//   };

//   const mobileCategories = [
//     { label: "Home" },
//     { label: "New In" },
//     { label: "Cigars" },
//     { label: "Tobacco" },
//     { label: "Accessories" },
//     { label: "Drinks" },
//     { label: "Pipes" },
//     { label: "Gifts" },
//     { label: "Events" },
//   ];
//   return (
//     <header className="hh-header" ref={headerRef}>
//       {/* Top Notification */}
//       {showNotification && (
//         <div className="top-notification">
//           <div className="container-1366 notification-content">
//           <button
//             className="close-btn"
//             onClick={() => setShowNotification(false)}
//             aria-label="Close notification"
//           >
//             <CloseRoundedIcon className="close-icon" />
//           </button>

//             <p>Free shipping on orders above £50 | Enjoy premium cigars</p>
//           </div>
//         </div>
//       )}

//       {/* Header Middle Bar */}
//       <div className="header-middle-wrapper">
//         <div className="container-1366 top-links">
//           <ul>
//             <li><a href="#">Help</a></li>
//             <li><a href="#">Shipping & Returns</a></li>
//             <li><a href="#">Store Locator</a></li>
//             <li><a href="#">Contact Us</a></li>
//           </ul>
//         </div>
//       </div>

//       {/* Mobile Icon Bar */}
//       <div className="mobile-header">
//         <div className="icon-group">
//           <IconButton onClick={() => setIsDrawerOpen(true)} aria-label="Open navigation">
//             <FaBars />
//           </IconButton>

//           <Link href="/">
//             <svg width="180" height="70" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Havana House Cigar Merchant Logo">
//                 <path d="M20,60 C10,50 20,30 15,20 C25,30 15,50 25,60 Z" fill="var(--color-accent-gold)"/>
//                 <path d="M30,80 C20,70 30,50 25,40 C35,50 25,70 35,80 Z" fill="var(--color-accent-gold)"/>
//                 <text x="60" y="45" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HAVANA</text>
//                 <text x="60" y="75" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HOUSE</text>
//                 <text x="60" y="95" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="3" fill="var(--color-accent-gold)">CIGAR MERCHANT</text>
//               </svg>
//             </Link>
//         </div>

//         <div className="icon-group">
//           <IconButton aria-label="Search" onClick={searchProducts}>
//             <FaSearch />
//           </IconButton>

//           <IconButton aria-label="Login" onClick={() => router.push("/login")}> <FaUser /> </IconButton>
//           <IconButton aria-label="Wishlist"> <FaHeart /> </IconButton>
//           <IconButton aria-label="Cart"> <FaShoppingBag /> </IconButton>
//         </div>
//       </div>

//       {/* Main Header */}
//       <div className="main-header">
//         <div className="container-1366 d-flex align-items-center justify-content-between">
//           <div className="hamburger-menu" onClick={toggleSidebar} aria-label="Menu" role="button">
//             <span className="bar"></span>
//             <span className="bar"></span>
//             <span className="bar"></span>
//           </div>
//           {/* Logo */}
//           <div className="logo">
//             <Link href="/">
//             <svg width="180" height="70" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Havana House Cigar Merchant Logo">
//                 <path d="M20,60 C10,50 20,30 15,20 C25,30 15,50 25,60 Z" fill="var(--color-accent-gold)"/>
//                 <path d="M30,80 C20,70 30,50 25,40 C35,50 25,70 35,80 Z" fill="var(--color-accent-gold)"/>
//                 <text x="60" y="45" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HAVANA</text>
//                 <text x="60" y="75" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HOUSE</text>
//                 <text x="60" y="95" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="3" fill="var(--color-accent-gold)">CIGAR MERCHANT</text>
//               </svg>
//             </Link>
//           </div>

//           {/* Search Bar */}
//           <div className="search-bar">
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Search cigars, brands, or categories"
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") searchProducts();
//               }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={searchProducts} aria-label="search button">
//                       <FaSearch style={{ fontSize: "16px", color: "#333" }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 sx: {
//                   backgroundColor: "#fff",
//                   borderRadius: "30px",
//                   padding: "4px 8px",
//                   fontSize: "14px",
//                   height: "40px",
//                 },
//               }}
//             />
//           </div>

//           {/* Icons */}
//           <div className="action-icons">
//             <FaUser onClick={() => router.push("/login")} />
//             <FaHeart />
//             <FaShoppingBag />
//           </div>
//         </div>
//       </div>

//       {/* Drawer - Mobile Sidebar */}
//       <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
//         <div className="mobile-sidebar">
//           <div className="mobile-sidebar-header">
//             <span>Menu</span>
//             <IconButton onClick={() => setIsDrawerOpen(false)} aria-label="Close sidebar">
//               <CloseRoundedIcon />
//             </IconButton>
//           </div>

//           <div className="mobile-categories">
//             {mobileCategories.map((item, index) => (
//               <div className="mobile-category-item" key={index}>
//                 <span>{item.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Drawer>
//       {/* Navigation */}
//       <nav className="main-nav">
//         <div className="container-1366 d-flex justify-content-start">
//         <ul className="nav-list" role="menubar">
//           <li id="nav-sale-button" className="nav-item sale" role="menuitem">
//             Sale
//           </li>
//           <li className="nav-item" role="menuitem">
//             Cigars
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Types</h4>
//                 <ul>
//                   <li>Hand Rolled</li>
//                   <li>Machine Made</li>
//                   <li>Limited Editions</li>
//                   <li>Mini Cigars</li>
//                 </ul>
//               </div>

//               <div className="mega-column">
//                 <h4>Brands</h4>
//                 <ul>
//                   <li>Cohiba</li>
//                   <li>Romeo y Julieta</li>
//                   <li>Montecristo</li>
//                   <li>Partagas</li>
//                 </ul>
//               </div>

//               <div className="mega-column brand-gallery">
//                 <h4>Popular Brands</h4>
//                 <div className="brand-images">
//                   <div className="brand-item">
//                     <img src="https://upload.wikimedia.org/wikipedia/en/d/de/Cohiba_cigar_logo.png" alt="Cohiba" />
//                     <span>Cohiba</span>
//                   </div>
//                   <div className="brand-item">
//                     <img src="https://images.seeklogo.com/logo-png/43/1/montecristo-special-cuba-logo-png_seeklogo-435175.png" alt="Montecristo" />
//                     <span>Montecristo</span>
//                   </div>
//                   <div className="brand-item">
//                     <img src="https://findlogovector.com/wp-content/uploads/2019/08/flor-de-tabacos-de-partagas-habana-cuba-logo-vector.png" alt="Partagas" />
//                     <span>Partagas</span>
//                   </div>
//                 </div>
//                 </div>
//             </div>
//           </li>

//           <li className="nav-item" role="menuitem">
//             Tobacco
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Types</h4>
//                 <ul>
//                   <li>Pipe Tobacco</li>
//                   <li>Rolling Tobacco</li>
//                   <li>Chewing Tobacco</li>
//                 </ul>
//               </div>
//             </div>
//           </li>

//           <li className="nav-item" role="menuitem">
//             Accessories
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Categories</h4>
//                 <ul>
//                   <li>Cigar Cutters</li>
//                   <li>Lighters</li>
//                   <li>Cases</li>
//                   <li>Humidors</li>
//                 </ul>
//               </div>
//             </div>
//           </li>

//           <li className="nav-item" role="menuitem">
//             Drinks
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Spirits</h4>
//                 <ul>
//                   <li>Rum</li>
//                   <li>Whisky</li>
//                   <li>Gin</li>
//                   <li>Brandy</li>
//                 </ul>
//               </div>
//             </div>
//           </li>

//           <li className="nav-item" role="menuitem">
//             Pipes
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Categories</h4>
//                 <ul>
//                   <li>Briar Pipes</li>
//                   <li>Meerschaum Pipes</li>
//                   <li>Pipe Kits</li>
//                 </ul>
//               </div>
//             </div>
//           </li>

//           <li className="nav-item" role="menuitem">
//             Gifts
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Gift Types</h4>
//                 <ul>
//                   <li>Gift Boxes</li>
//                   <li>Gift Vouchers</li>
//                   <li>Personalized Gifts</li>
//                 </ul>
//               </div>
//             </div>
//           </li>

//           <li className="nav-item" role="menuitem">
//             Events
//             <div className="mega-menu">
//               <div className="mega-column">
//                 <h4>Upcoming</h4>
//                 <ul>
//                   <li>Tasting Events</li>
//                   <li>Launch Parties</li>
//                   <li>Workshops</li>
//                 </ul>
//               </div>
//             </div>
//           </li>
//         </ul>

//         </div>
//       </nav>
//     </header>
//   );
// };

'use client'
import React, { useContext, useState, useEffect, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaHeart, FaShoppingBag, FaSearch } from "react-icons/fa";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "@/context/ThemeContext";
import { getProductImage } from '@/utils/imageFallback';
import { fetchDataFromApi } from "@/utils/api";
import "../../app/header.css";


const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debouncedInput = useDebounce(searchInput, 300);
  const [showNotification, setShowNotification] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const headerRef = useRef();
  const sidebarRef = useRef();
  const context = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileNavOpen(false);
    };
  
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle("fixed", window.scrollY > 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/notification`)
      .then((res) => res.json())
      .then((data) => setNotificationMessage(data.message))
      .catch((err) => console.error("Failed to load notification", err));
  }, []);

  // fetch suggestions when search input changes
  useEffect(() => {
    if (!debouncedInput || debouncedInput.length < 2) {
      setSuggestions([]);
      return;
    }
    fetchDataFromApi(`/api/search/suggest?q=${encodeURIComponent(debouncedInput)}`)
      .then((res) => {
        if (Array.isArray(res)) setSuggestions(res);
      })
      .catch(() => setSuggestions([]));
  }, [debouncedInput]);

  const searchProducts = () => {
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <header ref={headerRef} className="hh-header">
      {/* Notification Bar */}
      {showNotification && notificationMessage && (
        <div className="top-notification" role="region" aria-label="site-wide announcement">
          <div className="container-1366 notification-content">
            <p>{notificationMessage}</p>
            <button
              className="close-btn"
              onClick={() => setShowNotification(false)}
              aria-label="Close notification"
            >
              <CloseRoundedIcon className="close-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Header Middle – Quick Links */}
      <div className="header-middle-wrapper" role="navigation" aria-label="quick access links">
        <div className="container-1366 top-links">
          <ul>
            <li><Link href="/help">Help</Link></li>
            <li><Link href="/shipping-returns">Shipping & Returns</Link></li>
            <li><Link href="/store-locator">Store Locator</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      {/* 🟡 Logo + Search + Icons */}
      <div className="main-header">
        <div className="container-1366 d-flex align-items-center justify-content-between">
          {/* Hamburger for Mobile */}
          <div className="mobile-hamburger" onClick={() => setIsMobileNavOpen(true)} aria-label="Open navigation" role="button" tabIndex="0">
            <span></span>
            <span></span>
            <span></span>
          </div>
          {/* Logo */}
          <div className="logo">
            <Link href="/" aria-label="Go to homepage">
              <svg width="180" height="70" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Havana House Logo">
                <path d="M20,60 C10,50 20,30 15,20 C25,30 15,50 25,60 Z" fill="var(--color-accent-gold)" />
                <path d="M30,80 C20,70 30,50 25,40 C35,50 25,70 35,80 Z" fill="var(--color-accent-gold)" />
                <text x="60" y="45" fontFamily="Georgia" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HAVANA</text>
                <text x="60" y="75" fontFamily="Georgia" fontSize="36" fontWeight="bold" fill="var(--color-accent-gold)">HOUSE</text>
                <text x="60" y="95" fontFamily="Arial" fontSize="12" letterSpacing="3" fill="var(--color-accent-gold)">CIGAR MERCHANT</text>
              </svg>
            </Link>
          </div>

          {/* Search */}
          <div className={`search-bar ${isSearchOpen ? "expanded" : ""}`}>
            <input
              className="search-input"
              type="text"
              placeholder="Search cigars, brands, categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchProducts();
              }}
              aria-label="Search products"
            />
            <button
              className="search-btn"
              onClick={() => {
                if (isSearchOpen && searchInput) {
                  searchProducts();
                } else {
                  setIsSearchOpen(true);
                }
              }}
              aria-label="Search"
            >
              {isLoading ? <CircularProgress size={18} /> : <FaSearch />}
            </button>
            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => { setSearchInput(s.name); setSuggestions([]); }}>
                    <img src={s.images?.[0]} alt={s.name} width="40" height="40" />
                    <span dangerouslySetInnerHTML={{__html: s.highlight || s.name}} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Icons */}
          <div className="action-icons">
          <Link href="/signIn" aria-label="Login">
            <FaUser />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist">
            <FaHeart />
          </Link>
          <Link href="/cart" aria-label="Cart">
            <FaShoppingBag />
          </Link>
        </div>
        </div>
      </div>
      <nav className="main-nav">
        <div className="container-1366 d-flex justify-content-around">
        <ul className="nav-list" role="menubar">
          <li id="nav-sale-button" className="nav-item sale" role="menuitem">
            Sale
          </li>
          <li className="nav-item" role="menuitem">
            Cigars
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Types</h4>
                <ul>
                  <li>Hand Rolled</li>
                  <li>Machine Made</li>
                  <li>Limited Editions</li>
                  <li>Mini Cigars</li>
                </ul>
              </div>

              <div className="mega-column">
                <h4>Brands</h4>
                <ul>
                  <li>Cohiba</li>
                  <li>Romeo y Julieta</li>
                  <li>Montecristo</li>
                  <li>Partagas</li>
                </ul>
              </div>

              <div className="mega-column brand-gallery">
                <h4>Popular Brands</h4>
                <div className="brand-images">
                  <div className="brand-item">
                    <img src="https://upload.wikimedia.org/wikipedia/en/d/de/Cohiba_cigar_logo.png" alt="Cohiba" />
                    <span>Cohiba</span>
                  </div>
                  <div className="brand-item">
                    <img src="https://images.seeklogo.com/logo-png/43/1/montecristo-special-cuba-logo-png_seeklogo-435175.png" alt="Montecristo" />
                    <span>Montecristo</span>
                  </div>
                  <div className="brand-item">
                    <img src="https://findlogovector.com/wp-content/uploads/2019/08/flor-de-tabacos-de-partagas-habana-cuba-logo-vector.png" alt="Partagas" />
                    <span>Partagas</span>
                  </div>
                </div>
                </div>
            </div>
          </li>

          <li className="nav-item" role="menuitem">
            Tobacco
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Types</h4>
                <ul>
                  <li>Pipe Tobacco</li>
                  <li>Rolling Tobacco</li>
                  <li>Chewing Tobacco</li>
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item" role="menuitem">
            Accessories
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Categories</h4>
                <ul>
                  <li>Cigar Cutters</li>
                  <li>Lighters</li>
                  <li>Cases</li>
                  <li>Humidors</li>
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item" role="menuitem">
            Drinks
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Spirits</h4>
                <ul>
                  <li>Rum</li>
                  <li>Whisky</li>
                  <li>Gin</li>
                  <li>Brandy</li>
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item" role="menuitem">
            Pipes
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Categories</h4>
                <ul>
                  <li>Briar Pipes</li>
                  <li>Meerschaum Pipes</li>
                  <li>Pipe Kits</li>
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item" role="menuitem">
            Gifts
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Gift Types</h4>
                <ul>
                  <li>Gift Boxes</li>
                  <li>Gift Vouchers</li>
                  <li>Personalized Gifts</li>
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item" role="menuitem">
            Events
            <div className="mega-menu">
              <div className="mega-column">
                <h4>Upcoming</h4>
                <ul>
                  <li>Tasting Events</li>
                  <li>Launch Parties</li>
                  <li>Workshops</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>

        </div>
      </nav>
      {/* 🔍 Mobile Search (Below Header) */}
        <div className="mobile-search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search cigars, brands, categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchProducts();
            }}
            aria-label="Search products"
          />
        <button
          className="search-btn"
          onClick={searchProducts}
          aria-label="Search"
        >
          {isLoading ? (
            <CircularProgress size={18} />
          ) : (
            <FaSearch onClick={() => setIsSearchOpen(!isSearchOpen)} />
          )}
        </button>
        {suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => { setSearchInput(s.name); setSuggestions([]); }}>
                <img src={s.images?.[0]} alt={s.name} width="40" height="40" />
                <span dangerouslySetInnerHTML={{__html: s.highlight || s.name}} />
              </li>
            ))}
          </ul>
        )}
        </div>

      {isMobileNavOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setIsMobileNavOpen(false)}></div>
          <aside
            ref={sidebarRef}
            className="mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <button className="close-sidebar" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation">
              &times;
            </button>

            {/* 🔸 Category List with Images */}
            <ul className="mobile-category-list">
              {[
                { label: "Cigars", image: "/images/categories/cat-cigar.webp" },
                { label: "Tobacco", image: "/images/categories/cat-tobacco.webp" },
                { label: "Accessories", image: "/images/categories/cat-accessories.webp" },
                { label: "Drinks", image: "/images/categories/cat-drinks.webp" },
                { label: "Pipes", image: "/images/categories/cat-pipes.webp" },
                { label: "Gifts", image: "/images/categories/cat-gifts.webp" },
                { label: "Events", image: "/images/categories/cat-events.webp" },
              ].map((item, i) => (
                <li key={i} className="mobile-category-item">
                  <img src={getProductImage(item.image)} alt={item.label} width="50" height="50" loading="lazy" />
                  <Link href="#">{item.label}</Link>
                </li>
              ))}
            </ul>

            {/* 🔸 Help & Info Section */}
            <div className="mobile-help-info">
              <Link href="/login">My Account</Link>
              <Link href="/orders">My Orders</Link>
              <Link href="/returns">Returns Information</Link>
              <Link href="/contact">Contact Preferences</Link>
            </div>

            {/* 🔸 Social Icons */}
            <div className="mobile-social-icons">
              <a href="#" aria-label="Facebook" className="fb"></a>
              <a href="#" aria-label="Instagram" className="ig"></a>
              <a href="#" aria-label="Snapchat" className="snap"></a>
            </div>
          </aside>
        </>
      )}

    </header>
  );
};

export default Header;
