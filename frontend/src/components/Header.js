import React from 'react';
import Nav from "./Nav";
import LogoutComponent from "./LogoutComponent";
import {useUserContext} from "../contexts/UserContext";
import {useTranslation} from "react-i18next";

const Header = () => {

    const { user } = useUserContext(); // Use the useContext hook to access the current user

    const { t, i18n } = useTranslation();

    // This function changes the language using i18next
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).catch(err => {
            console.error('Error changing language:', err);
        });
    };

    return (
        // Header section begins
        <header>
            <div id="wb-bnr" className="container">
                <div className="row">
                    <section id="wb-lng" className="col-xs-3 col-sm-12 pull-right text-right">
                        {/* Language switch logic */}
                        <h2 className="wb-inv">Language selection</h2>
                        <ul className="list-inline mrgn-bttm-0">
                            {i18n.language === 'en' && (
                                <li>
                                    <a href="/#" onClick={(e) => {
                                        e.preventDefault();
                                        changeLanguage('fr');
                                    }}>Français</a>
                                </li>
                            )}
                            {i18n.language === 'fr' && (
                                <li>
                                    <a href="/#" onClick={(e) => {
                                        e.preventDefault();
                                        changeLanguage('en');
                                    }}>English</a>
                                </li>
                            )}
                        </ul>
                    </section>

                    {/* Brand logo section */}
                    <div className="brand col-xs-9 col-sm-5 col-md-4" property="publisher"
                         typeof="GovernmentOrganization">
                        <a href="https://wet-boew.github.io/GCWeb/" property="url">
                            <img src={`${process.env.PUBLIC_URL}/themes/GCWeb/assets/sig-blk-en.svg`}
                                 alt="Government of Canada"/>
                        </a>
                        <meta property="name" content="Government of Canada"/>
                        <meta property="areaServed" typeof="Country" content="Canada"/>
                        <link property="logo"
                              href={`${process.env.PUBLIC_URL}/themes/GCWeb/assets/wmms-blk.svg`}/>
                    </div>

                </div>
            </div>

            <hr/>
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        {/* Navigation menu section */}
                        <nav className="gcweb-menu" typeof="SiteNavigationElement">
                            <h2 className="wb-inv">Menu</h2>
                            <button type="button" aria-haspopup="true" aria-expanded="false"><span
                                className="wb-inv">Main </span>Menu <span
                                className="expicon glyphicon glyphicon-chevron-down"></span></button>
                            <ul role="menu" aria-orientation="vertical"
                                data-ajax-replace={t("app.menuLink")}>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/jobs.html">Jobs and
                                    the
                                    workplace</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/immigration-citizenship.html">Immigration
                                    and citizenship</a></li>
                                <li role="presentation"><a role="menuitem" href="https://travel.gc.ca/">Travel and
                                    tourism</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/business.html">Business
                                    and industry</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/benefits.html">Benefits</a>
                                </li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/health.html">Health</a>
                                </li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/taxes.html">Taxes</a>
                                </li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/environment.html">Environment
                                    and natural resources</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/defence.html">National
                                    security and defence</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/culture.html">Culture,
                                    history and sport</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/policing.html">Policing,
                                    justice and emergencies</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/transport.html">Transport
                                    and infrastructure</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.international.gc.ca/world-monde/index.aspx?lang=eng">Canada
                                    and the world</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/finance.html">Money
                                    and
                                    finances</a></li>
                                <li role="presentation"><a role="menuitem"
                                                           href="https://www.canada.ca/en/services/science.html">Science
                                    and
                                    innovation</a></li>
                            </ul>
                        </nav>
                        {/* End of Navigation menu section */}
                    </div>
                    {/* If user is logged in show Logout component*/}
                    {user && (

                        <LogoutComponent/>

                    )}
                </div>
            </div>

            {/* Render the Nav component */}
            <Nav/>
        </header>
        // End of Header section
    );
};

export default Header;
