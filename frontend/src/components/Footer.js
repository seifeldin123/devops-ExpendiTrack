import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";

const Footer = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [i18n.language]);

    return (
        <footer id="wb-info">
            <h2 className="wb-inv">About this site</h2>

            {/* Main Footer Section */}
            <div className="gc-main-footer">
                <div className="container">
                    <nav aria-label="Government of Canada Information">
                        <h3>Government of Canada</h3>
                        {/* List of links for Government of Canada */}
                        <ul className="list-col-xs-1 list-col-sm-2 list-col-md-3">
                            <li><a href={t("app.footer-all-contacts-link")}>{t("app.footer-all-contacts")}</a></li>
                            <li><a href={t("app.footer-departments-link")}>{t("app.footer-departments")}</a></li>
                            <li><a href={t("app.footer-government-link")}>{t("app.footer-government")}</a></li>
                        </ul>
                        {/* Heading for Themes and Topics */}
                        <h4><span className="wb-inv">Themes and topics</span></h4>
                        {/* List of links for Themes and Topics */}
                        <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                            <li><a href={t("app.footer-jobs-link")}>{t("app.footer-jobs")}</a></li>
                            <li><a href={t("app.footer-immigration-link")}>{t("app.footer-immigration")}</a></li>
                            <li><a href={t("app.footer-travel-link")}>{t("app.footer-travel")}</a></li>
                            <li><a href={t("app.footer-business-link")}>{t("app.footer-business")}</a></li>
                            <li><a href={t("app.footer-benefits-link")}>{t("app.footer-benefits")}</a></li>
                            <li><a href={t("app.footer-health-link")}>{t("app.footer-health")}</a></li>
                            <li><a href={t("app.footer-taxes-link")}>{t("app.footer-taxes")}</a></li>
                            <li><a href={t("app.footer-environment-link")}>{t("app.footer-environment")}</a></li>
                            <li><a href={t("app.footer-security-link")}>{t("app.footer-security")}</a></li>
                            <li><a href={t("app.footer-culture-link")}>{t("app.footer-culture")}</a>
                            </li>
                            <li><a href={t("app.footer-justice-link")}>{t("app.footer-justice")}</a></li>
                            <li><a href={t("app.footer-transport-link")}>{t("app.footer-transport")}</a></li>
                            <li><a href={t("app.footer-world-link")}>{t("app.footer-world")}</a></li>
                            <li><a href={t("app.footer-money-link")}>{t("app.footer-money")}</a></li>
                            <li><a href={t("app.footer-science-link")}>{t("app.footer-science")}</a></li>
                            <li><a href={t("app.footer-indigenous-link")}>{t("app.footer-indigenous")}</a></li>
                            <li><a href={t("app.footer-military-link")}>{t("app.footer-military")}</a></li>
                            <li><a href={t("app.footer-youth-link")}>{t("app.footer-youth")}</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Sub Footer Section */}
            <div className="gc-sub-footer">
                <div className="container d-flex align-items-center">
                    <nav aria-label="Themes and Topics">
                        <h3 className="wb-inv">Government of Canada Corporate</h3>
                        {/* List of links for Government of Canada Corporate */}
                        <ul>
                            <li><a href={t("app.footer-social-link")}>{t("app.footer-social")}</a></li>
                            <li><a href={t("app.footer-mobile-link")}>{t("app.footer-mobile")}</a></li>
                            <li><a href={t("app.footer-about-canada-link")}>{t("app.footer-about-canada")}</a></li>
                            <li><a href={t("app.footer-terms-link")}>{t("app.footer-terms")}</a></li>
                            <li><a href={t("app.footer-privacy-link")}>{t("app.footer-privacy")}</a></li>
                        </ul>
                    </nav>
                    {/* Government of Canada watermark */}
                    <div className="wtrmrk align-self-end">
                        <img src={`${process.env.PUBLIC_URL}/themes/GCWeb/assets/wmms-blk.svg`} alt="Symbol of the Government of Canada"/>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
