import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./responsive.css";

import dynamic from "next/dynamic";
import ThemeProvider from "@/context/ThemeProvider";
import WishlistProvider from "@/context/WishlistContext";
import CompareProvider from "@/context/CompareContext";

const Header = dynamic(() => import("@/Components/Header"));
const Footer = dynamic(() => import("@/Components/Footer"));

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Havana House | Premium Cigars & Accessories</title>
        <meta name="description" content="Discover premium cigars, accessories, and gifts at Havana House." />

        {/* ✅ Favicon & Meta Icons */}
        <link rel="icon" type="image/webp" sizes="32x32" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="192x192" href="/favicon.webp" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1b1a19" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
        <WishlistProvider>
          <CompareProvider>
            <ThemeProvider>
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </CompareProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
