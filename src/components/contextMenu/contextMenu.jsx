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
        <C_Menu isOpen={isOpen} onItemClicked={onMenuItemClicked} options={options} position={pos}/>
    </div>;
}

const C_Menu = ({options, isOpen, onItemClicked, position}) => {
    return isOpen && options?.length !== 0 && <div className="context-menu flex-column" style={{left: position.x, top: position.y}}>
        {options.map((option) => <C_Menu_Item key={option.id} option={option} onClick={onItemClicked} /> )}
    </div>
}

const C_Menu_Item = ({ option, onClick }) => {

    const [showMenu, setShowMenu] = useState(false);

    const handleMouseEnter = (event) => {
        setShowMenu(true);
    }

    const handleMouseLeave = (event) => {
        setShowMenu(false);
    }

    return <div
        className="menu-item flex-row"
        onClick={(e) => {onClick(e, option.callback)}}
        style={{color: option.color}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <h6>{option.title}</h6>
        <div className="submenu-container">
            {
                option.options && showMenu && <C_Menu options={option.options} onItemClicked={onClick} isOpen={showMenu} position={{x: '100%', y: '-100%'}} />
            }
        </div>
    </div>
}

export default C_ContextMenu;