import React from 'react';

const BasicModal = ({ show, handleClose, children, title }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={`modal show fade modal-backdrop-custom ${show ? '' : 'd-none'}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-dialog-custom" role="document">
                <div className="modal-content">
                    <div className="modal-header modal-header-custom">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="close close-button-custom" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body modal-body-custom">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BasicModal;
