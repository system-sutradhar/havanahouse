import dynamic from 'next/dynamic';
import ThemeProvider from '@/context/ThemeProvider';

const Header = dynamic(() => import('../Header'));
const Footer = dynamic(() => import('../Footer'));

const DefaultLayout = ({ children }) => (
  <ThemeProvider>
    <Header />
    {children}
    <Footer />
  </ThemeProvider>
);

export default DefaultLayout;
