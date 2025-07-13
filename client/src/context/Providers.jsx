'use client'; 

import { AppProvider } from './AppContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { CompareProvider } from './CompareContext';
import ThemeProvider from './ThemeProvider';

// This component now correctly wraps only your application's context providers.
export function Providers({ children }) {
  return (
    <AppProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AppProvider>
  );
}