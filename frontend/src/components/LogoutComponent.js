// import React, {useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useUserContext } from '../contexts/UserContext';
// import {useTranslation} from "react-i18next";
//
//
// const LogoutComponent = () => {
//     const { t, i18n } = useTranslation();
//
//     useEffect(() => {
//     }, [i18n.language]);
//
//     // Access setUser function from UserContext and navigation from React Router
//     const { setUser } = useUserContext();
//     const navigate = useNavigate();
//
//     // Function to handle user logout with confirmation
//     const handleLogout = () => {
//         // Show confirmation dialog with a clear and accessible message
//         const confirmLogout = window.confirm(t("app.logoutWindow"));
//         if (confirmLogout) {
//             setUser(null); // Set the user to null, effectively logging them out
//             navigate('/login'); // Navigate back to the login page, ensuring the user understands they will be redirected
//         }
//     };
//
//     return (
//         <div className="col-xs-5 col-xs-offset-7 col-md-offset-0 col-md-4">
//             <section id="wb-so">
//                 <h2 className="wb-inv">Sign out</h2>
//                 <button className="btn btn-primary" onClick={handleLogout}><span className="glyphicon glyphicon-log-out"></span> &nbsp; {t("app.logoutComponent-logout")}
//                 </button>
//             </section>
//         </div>
//
//     );
// };
//
// export default LogoutComponent;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { useTranslation } from "react-i18next";
import BasicModal from './Modal'; // Make sure this path matches the actual location of BasicModal

const LogoutComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [i18n.language]);

    // Confirm logout and navigate to login page
    const confirmLogout = () => {
        setUser(null);
        navigate('/login');
    };

    // Handle the opening of the logout confirmation modal
    const handleLogoutClick = () => {
        setShowModal(true);
    };

    // Handle closing the modal without logging out
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="col-xs-5 col-xs-offset-7 col-md-offset-0 col-md-4">
            <section id="wb-so">
                <button className="btn btn-primary" onClick={handleLogoutClick}>
                    <span className="glyphicon glyphicon-log-out"></span> &nbsp; {t("app.logoutComponent-logout")}
                </button>

                <BasicModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    title={t("app.logoutComponent-logout")}
                    modalType="logout"
                >
                    <div className="text-center">{t("app.logoutWindow")}</div>
                    <div className="logout-btns">
                        <button type="button" className="btn btn-default" onClick={handleCloseModal}>
                            {t("app.logout-cancel")}
                        </button>
                        <button type="button" className="btn btn-danger" onClick={confirmLogout}>
                            {t("app.logoutComponent-logout")}
                        </button>
                    </div>
                </BasicModal>
            </section>
        </div>
    );
};

export default LogoutComponent;
