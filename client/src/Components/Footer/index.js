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
                    <div className="footer__top footer__wrap">
                        <div class="footer__subscription">
                            <div class="subscription subscription--horizontal">
                                <h3 class="subscription__title">Subscribe!</h3>
                                <span class="subscription__subtitle">Be the first to know about new promotions</span>
                                <form class="a-form subscription__form" noValidate>
                                    <div class="subscription__input a-input">
                                        <div class="a-input__container">
                                            <input type="email" placeholder="E-mail" class="a-input__field base-input" />
                                            <label class="a-input__label base-label">Email</label>
                                        </div>
                                    </div>
                                    <button type="submit" class="a-button a-button--primary subscription__button"><span class="a-button__text">Subscribe</span></button>
                                </form>
                            </div>
                        </div>
                        <div class="social-list footer__social-list">
                            <h3 class="social-list__title">Join us!</h3>
                            <span class="social-list__subtitle">HELLO in social networks</span>
                            <div class="social-list__content">
                                <a href="https://www.facebook.com/allo" target="_blank" rel="noopener" aria-label="facebook" class="social-list__link"><FaFacebookF /></a>
                                <a href="https://www.instagram.com/allo/" target="_blank" rel="noopener" aria-label="instagram" class="social-list__link"><FaInstagram /></a>
                                <a href="https://t.me/allonews" target="_blank" rel="noopener" aria-label="telegram" class="social-list__link"><FaTwitter /></a>
                            </div>
                        </div>
                        <div class="footer-apps footer__apps">
                            <figure class="footer-apps__logo">
                                <Image src="https://i.allo.ua/media/app/logo/ic_Logo_1_.svg" alt="logo" width={96} height={96} />
                            </figure>
                            <div class="footer-apps__content">
                                <h3 class="footer-apps__title">Install the ALLO app!</h3>
                                <span class="footer-apps__subtitle">Buy faster, pay less</span>
                                <div class="footer-apps__list">
                                    <a href="https://itunes.apple.com/ru/app/id1185517833" target="_blank" rel="noopener" class="footer-apps__link">App Store</a>
                                    <a href="https://play.google.com/store/apps/details?id=allo.ua" target="_blank" rel="noopener" class="footer-apps__link">Google Play</a>
                                </div>
                            </div>
                        </div></div>
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