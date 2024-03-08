import React, { useState } from 'react';
import Nav from "./Nav";
import LogoutComponent from "./LogoutComponent";
import {useUserContext} from "../contexts/UserContext";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
const Header = () => {

    // State to hold the search query
    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useUserContext(); // Use the useContext hook to access the current user
    const{t} = useTranslation("global");
    const currentLang = i18n.language;
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => {
            localStorage.setItem('i18nextLng', lng);
            // window.location.reload();
        }).catch(err => {
            console.error('Error changing language:', err);
        });
    };



    // Handler to update the search query state
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        // Header section begins
        <header>
            <div id="wb-bnr" className="container">
                <div className="row">
                    <section id="wb-lng" className="col-xs-3 col-sm-12 pull-right text-right">
                        <h2 className="wb-inv">Language selection</h2>
                        <ul className="list-inline mrgn-bttm-0">
                            {currentLang === 'en' && (
                                <li>
                                    <a href="/#" onClick={(e) => {
                                        e.preventDefault();
                                        changeLanguage('fr');
                                    }}>Français</a>
                                </li>
                            )}
                            {currentLang === 'fr' && (
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

                    {/* Search section */}
                    <section id="wb-srch"
                             className="col-lg-offset-4 col-md-offset-4 col-sm-offset-2 col-xs-12 col-sm-5 col-md-4">
                        <h2>Search</h2>
                        <form action="#" method="post" name="cse-search-box" role="search">
                            <div className="form-group wb-srch-qry">
                                <label htmlFor="wb-srch-q" className="wb-inv">Search Canada.ca</label>
                                <input id="wb-srch-q" list="wb-srch-q-ac" className="wb-srch-q form-control" name="q"
                                       type="search" value={searchQuery} size="34" maxLength="170"
                                       placeholder={t("app.search")}
                                       onChange={handleSearchChange}/>
                                <datalist id="wb-srch-q-ac"></datalist>
                            </div>
                            <div className="form-group submit">
                                <button type="submit" id="wb-srch-sub" className="btn btn-primary btn-small"
                                        name="wb-srch-sub">
                                    <span className="glyphicon-search glyphicon"></span>
                                    <span className="wb-inv">Search</span>
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* End of Search section */}
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
