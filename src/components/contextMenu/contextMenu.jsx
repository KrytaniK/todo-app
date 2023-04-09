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
                    options.map((option) => {
                        return <C_Menu_Item key={option.id} option={option}/>
                    })
                }
            </div>
        }
    </div>;
}

const C_Menu = ({options, isOpen, position}) => {
    return isOpen && options?.length !== 0 && <div className="context-menu flex-column" style={{left: position.x, top: position.y}}>
        { options.map((option) => <C_Menu_Item key={option.id} option={option}/> )}
    </div>
}

const C_Menu_Item = ({ option, close }) => {

    const [showMenu, setShowMenu] = useState(false);

    const onItemClick = (event, callback) => {
        event.stopPropagation();

        if (callback)
            callback();
        
        close();
    }

    const onOpenSubmenu = (event) => {
        event.stopPropagation();
        console.log("sub Options menu trigger Clicked")
    }

    const handleMouseEnter = (event) => {
        setShowMenu(true);
    }

    const handleMouseLeave = (event) => {
        setShowMenu(false);
    }

    return <div
        className="menu-item flex-row"
        onClick={option.options ? onOpenSubmenu : onItemClick}
        style={{color: option.color}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <h6>{option.title}</h6>
        <div className="submenu-container">
            {
                option.options && showMenu && <C_Menu options={option.options} isOpen={showMenu} position={{x: '100%', y: '-100%'}} />
            }
        </div>
    </div>
}

export default C_ContextMenu;