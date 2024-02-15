import React from 'react';

const Footer = () => {
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
                            <li><a href="https://www.canada.ca/en/contact.html">All contacts</a></li>
                            <li><a href="https://www.canada.ca/en/government/dept.html">Departments and agencies</a></li>
                            <li><a href="https://www.canada.ca/en/government/system.html">About government</a></li>
                        </ul>
                        {/* Heading for Themes and Topics */}
                        <h4><span className="wb-inv">Themes and topics</span></h4>
                        {/* List of links for Themes and Topics */}
                        <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                            <li><a href="https://www.canada.ca/en/services/jobs.html">Jobs</a></li>
                            <li><a href="https://www.canada.ca/en/services/immigration-citizenship.html">Immigration and citizenship</a></li>
                            <li><a href="https://travel.gc.ca/">Travel and tourism</a></li>
                            <li><a href="https://www.canada.ca/en/services/business.html">Business</a></li>
                            <li><a href="https://www.canada.ca/en/services/benefits.html">Benefits</a></li>
                            <li><a href="https://www.canada.ca/en/services/health.html">Health</a></li>
                            <li><a href="https://www.canada.ca/en/services/taxes.html">Taxes</a></li>
                            <li><a href="https://www.canada.ca/en/services/environment.html">Environment and natural
                                resources</a></li>
                            <li><a href="https://www.canada.ca/en/services/defence.html">National security and
                                defence</a></li>
                            <li><a href="https://www.canada.ca/en/services/culture.html">Culture, history and sport</a>
                            </li>
                            <li><a href="https://www.canada.ca/en/services/policing.html">Policing, justice and
                                emergencies</a></li>
                            <li><a href="https://www.canada.ca/en/services/transport.html">Transport and
                                infrastructure</a></li>
                            <li><a href="https://international.gc.ca/world-monde/index.aspx?lang=eng">Canada and the
                                world</a></li>
                            <li><a href="https://www.canada.ca/en/services/finance.html">Money and finance</a></li>
                            <li><a href="https://www.canada.ca/en/services/science.html">Science and innovation</a></li>
                            <li><a href="https://www.canada.ca/en/services/indigenous-peoples.html">Indigenous
                                peoples</a></li>
                            <li><a href="https://www.canada.ca/en/services/veterans-military.html">Veterans and
                                military</a></li>
                            <li><a href="https://www.canada.ca/en/services/youth.html">Youth</a></li>
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
                            <li><a href="https://www.canada.ca/en/social.html">Social media</a></li>
                            <li><a href="https://www.canada.ca/en/mobile.html">Mobile applications</a></li>
                            <li><a href="https://www.canada.ca/en/government/about.html">About Canada.ca</a></li>
                            <li><a href="https://www.canada.ca/en/transparency/terms.html">Terms and conditions</a></li>
                            <li><a href="https://www.canada.ca/en/transparency/privacy.html">Privacy</a></li>
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
