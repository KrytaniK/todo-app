import React from "react";
import { createPortal } from "react-dom";
import './modal.css';

const C_Modal = ({children, isOpen, toggle}) => {
    return isOpen && createPortal(<div className="modal-overlay flex" onMouseDown={toggle}>
        <div className="modal-content" onMouseDown={(e) => { e.stopPropagation(); }}>
            {children}
        </div>
    </div>, document.getElementById('portal'));
}

export default C_Modal;