import React from 'react';
import {useTranslation} from "react-i18next";

const BasicModal = ({ show, handleClose, children, title, modalType }) => {
    // const {t} =useTranslation("global")
    const { t, i18n } = useTranslation();

    if (!show) {
        return null;
    }

    // Determine data-testid based on modalType
    const modalTestId = modalType ? `modal-${modalType}` : 'modal-default';

    return (
        <div className={`modal show fade modal-backdrop-custom ${show ? '' : 'd-none'}`} tabIndex="-1" role="dialog"  data-testid={modalTestId}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-custom" role="document">
                <div className="modal-content">
                    <div className="modal-header modal-header-custom">
                        <h5 className="modal-title" data-testid="modal-title-test-id">{title}</h5>
                        <button type="button" className="close close-button-custom" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body modal-body-custom">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleClose}>{t("app.modalClose")}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BasicModal;
