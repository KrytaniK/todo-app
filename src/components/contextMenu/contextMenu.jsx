import React, { useEffect, useRef, useState } from "react";
import './contextMenu.css';

const C_ContextMenu = ({ children, options }) => {
    
    const menuContext = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {

        const handleClick = () => setIsOpen(false);
        const handleRightClick = event => {
            if (!menuContext.current?.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        }

        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleRightClick);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleRightClick);
        }
    });

    const onOpenContextMenu = (event) => {

        if (!options || options.length === 0)
            return;

        event.preventDefault();
        
        setIsOpen(true);
        setPos({ x: event.clientX, y: event.clientY });
    }

    const onMenuItemClicked = (event, callback = () => { }) => {
        event.stopPropagation();

        callback();
        setIsOpen(false);
    }

    return <div onContextMenu={onOpenContextMenu} ref={menuContext}>
        {children}
        {
            isOpen && options?.length !== 0 && <div className="context-menu flex-column" style={{ left: pos.x, top: pos.y}}>
                {
                    options.map(({ id, color, title, callback }) => {
                        return <button
                            key={id}
                            style={{ color: color }}
                            className="context-menu-item"
                            onClick={(e) => { onMenuItemClicked(e, callback); }}>
                            <h6>{title}</h6>
                        </button>
                    })
                }
            </div>
        }
    </div>;
}

export default C_ContextMenu;