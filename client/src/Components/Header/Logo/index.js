'use client';
import Link from 'next/link';
import Image from 'next/image';
import './Logo.css';
import LogoImage from "../../../assets/images/logo_new.png"; // Update with your logo path
const Logo = () => {
  return (
    <div className="logo-container">
      <Link href="/">
        <Image
          src={LogoImage} // Update with your logo path
          alt="Havana House - The Cigar Merchant"
          width={150}
          height={50}
          priority
        />
      </Link>
    </div>
  );
};

export default Logo;
