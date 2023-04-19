import React, { useEffect, useRef, useState } from "react";
import './menu.css';

const C_Menu = ({ isOpen, options, pos, onSelectItem, alignment, isSubMenu }) => {

    const menuRef = useRef(undefined);

    // Respositions the menu to keep it on screen
    useEffect(() => {
        if (!menuRef || !isOpen) return;
        
        let rect = menuRef.current.getBoundingClientRect();
        
        switch (alignment) {
            case 'parent-left': {
                menuRef.current.style.left = '0px';
                if (!isSubMenu)
                    menuRef.current.style.top = '100%';
                break;
            }
            case 'parent-right': {
                menuRef.current.style.right = '0px';
                if (!isSubMenu)
                    menuRef.current.style.top = '100%';
                break;
            }
            case 'left': {
                menuRef.current.style.left = parseInt(menuRef.current.style.left) - rect.width + 'px';
                break;
            }
            case 'bottom': {
                menuRef.current.style.top = parseInt(menuRef.current.style.top) - rect.height + 'px';
                break;
            }
            case 'bottomLeft': {
                menuRef.current.style.left = parseInt(menuRef.current.style.left) - rect.width + 'px';
                menuRef.current.style.top = parseInt(menuRef.current.style.top) - rect.height + 'px';
            }
        }

        // Since adjustments were made to the position, rect is no longer valid.
        rect = menuRef.current.getBoundingClientRect();

        const xMin = rect.x - rect.width;
        const xMax = rect.x + rect.width;
        const yMin = rect.y - rect.height; 
        const yMax = rect.y + rect.height;
        const margin = 32;

        // Off screen, left side
        if (xMin < 0) {
            menuRef.current.style.transform += `translateX(${-xMin + margin}px)`;
        }

        // Off screen, right side
        if (xMax > window.innerWidth) {

            if (isSubMenu) {
                menuRef.current.style.left = null;
                menuRef.current.style.right = '100%';
                return;
            }

            const diff = xMax - window.innerWidth;
            menuRef.current.style.transform += `translateX(${-diff - margin}px)`;
        }

        // Off screen, top
        if (yMin < 0) {
            if (alignment !== 'bottom' || alignment !== 'bottomLeft')
                return;
            menuRef.current.style.transform += `translateY(${-yMin + margin}px)`;
        }

        // Off screen, bottom
        if (yMax > window.innerHeight) {
            const diff = yMax - window.innerHeight;
            menuRef.current.style.transform += `translateY(${-diff - margin}px)`;
        }
    }, [isOpen, pos]);

    return isOpen && <ul className="menu" style={{...pos}} ref={menuRef}>
        {options.map(option => <Item key={option.id} option={option} onSelect={onSelectItem} subMenuAlign={alignment} /> )}
    </ul>
}

const Item = ({ option, onSelect, subMenuAlign }) => {

    const [showSubMenu, setShowSubMenu] = useState(false);

    return <li
        className="menu-item"
        onClick={(e) => { onSelect(e); option.callback && option.callback(); }}
        onMouseEnter={() => { setShowSubMenu(true); }}
        onMouseLeave={() => { setShowSubMenu(false); }}
    >
        <p style={{color: option.color}}>{option.title}</p>
        {option.options && <C_Menu
            isOpen={showSubMenu}
            onSelectItem={onSelect}
            options={option.options}
            pos={{ left: '100%', top: 0 }}
            alignment={subMenuAlign}
            isSubMenu={true}
        />}
    </li>
}

export default C_Menu;