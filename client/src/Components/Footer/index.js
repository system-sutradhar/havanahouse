"use client"
import React,{useState, useEffect} from 'react';
import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { CiBadgeDollar } from "react-icons/ci";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import newsLetterImg from '../../assets/images/newsletter.png';
import Button from '@mui/material/Button';
import { IoMailOutline } from "react-icons/io5";
import Image from "next/image";

import { MyContext } from "@/context/ThemeContext";
import { useContext } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ProductModal from "../ProductModal";
import { fetchDataFromApi } from "@/utils/api";


const Footer = () => {
 
    const context = useContext(MyContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        context.setAlertBox({
            open: false
        });
    };


    return (
        <>

            <Snackbar open={context.alertBox.open} autoHideDuration={6000} onClose={handleClose} className="snackbar">
                <Alert
                    onClose={handleClose}
                    autoHideDuration={6000}
                    severity={context.alertBox.error === false ? "success" : 'error'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {context.alertBox.msg}
                </Alert>
            </Snackbar>



            {
                context.isHeaderFooterShow === true &&
                <>
                    <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="text-white mb-1">5% discount for your first order</p>
                                    <h3 className="text-white">Join our newsletter and get...</h3>
                                    <p className="text-light">Join our email subscription now to get updates on<br /> promotions and coupons.</p>


                                    <form className="mt-4">
                                        <IoMailOutline />
                                        <input type="text" placeholder="Your Email Address" />
                                        <Button>Subscribe</Button>
                                    </form>

                                </div>

                                <div className="col-md-6">
                                    <Image src={newsLetterImg} alt="image" />
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer>
                        <div className="container">
                            <div className="topInfo row">
                            
                                <div className="col d-flex align-items-center">
                                    <span><TbTruckDelivery /></span>
                                    <span className="ml-2">Free delivery for order over £50</span>
                                </div>

                                <div className="col d-flex align-items-center">
                                    <span><RiDiscountPercentLine /></span>
                                    <span className="ml-2">Daily Mega Discounts</span>
                                </div>


                                <div className="col d-flex align-items-center">
                                    <span><CiBadgeDollar /></span>
                                    <span className="ml-2">Best price on the market</span>
                                </div>


                            </div>



                            <div className="row mt-5 linksWrap">
                                <div className="col">
                                    <h5>Useful Information</h5>
                                    <ul>
                                        <li><Link href="/">FAQs</Link></li>
                                        <li><Link href="/">Job Vacancies</Link></li>
                                        <li><Link href="/">Reward Points</Link></li>
                                        <li><Link href="/">My Account</Link></li>
                                        <li><Link href="/">Blog</Link></li>
                                    </ul>
                                </div>

                                <div className="col">
                                    <h5>Order Help</h5>
                                    <ul>
                                        <li><Link href="/">Delivery Information</Link></li>
                                        <li><Link href="/">Privacy Policy</Link></li>
                                        <li><Link href="/">Return & Refunds</Link></li>
                                        <li><Link href="/">Terms & Conditions</Link></li>
                                    </ul>
                                </div>

                                <div className="col">
                                    <h5>Our Stores</h5>
                                    <ul>
                                        <li><Link href="/">Bath</Link></li>
                                        <li><Link href="/">Birmingham</Link></li>
                                        <li><Link href="/">Cardiff</Link></li>
                                        <li><Link href="/">Hove</Link></li>
                                        <li><Link href="/">Oxford</Link></li>
                                        <li><Link href="/">Reading</Link></li>
                                        <li><Link href="/">Southampton</Link></li>
                                    </ul>
                                </div>

                                <div className="col">
                                    <h5>Contact Us</h5>
                                    <ul>
                                        <li><span>📞</span><Link href="/">0203 884 0006</Link></li>
                                        <li><span>📱</span><Link href="/">+44 7903 638256</Link></li>
                                        <li><span>📧</span><Link href="/">info@havanahouse.co.uk</Link></li>
                                        <li><span>📧</span><Link href="/">More ways to contact us</Link></li>
                                    </ul>
                                </div>
                            </div>



                            <div className="copyright mt-3 pt-3 pb-3 d-flex justify-content-between">
                                <p className="mb-0">Copyright {new Date().getFullYear()} Havana House. All rights reserved</p>
                                <ul className="list list-inline ml-auto mb-0 socials">
                                    <li className="list-inline-item">
                                        <Link href="/"><FaFacebookF /></Link>
                                    </li>

                                    <li className="list-inline-item">
                                        <Link href="/"><FaTwitter /></Link>
                                    </li>

                                    <li className="list-inline-item">
                                        <Link href="/"><FaInstagram /></Link>
                                    </li>
                                </ul>
                            </div>



                        </div>
                        
                    </footer>
                </>
            }




            {
                context.isOpenProductModal === true && <ProductModal data={context.productData} />
            }

        </>
    )
}

export default Footer;