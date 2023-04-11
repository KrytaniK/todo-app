import React, { useEffect, useRef, useState } from "react";
import { C_Menu } from '.';

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

    const onMenuItemClicked = (event) => {
        event.stopPropagation();
        setIsOpen(false);
    }

    return <div onContextMenu={onOpenContextMenu} ref={menuContext}>
        {children}
        <C_Menu isOpen={isOpen} options={options} onSelectItem={onMenuItemClicked} pos={{left: pos.x, top: pos.y}}/>
    </div>;
}

export default C_ContextMenu;