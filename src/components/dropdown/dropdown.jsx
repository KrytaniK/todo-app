import React, { useState, useEffect } from "react";
import './dropdown.css';
import C_SVG from "../svg";
import C_Menu from "../menu/menu";

const C_Dropdown = ({ title, options = [], alignment }) => {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        const handleClick = () => {
            setIsOpen(false);
        }

        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleClick);
        
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleClick);
        }
    })

    const toggle = (event) => {
        event.stopPropagation();

        if (!options || options.length < 1)
            return;

        setIsOpen(!isOpen);
    }

    return <div className="dropdown">
        <button className="dropdown-action flex-row" onClick={toggle}>
            <p>{title}</p>
            <C_SVG sourceURL="/chevron-down.svg" size="1rem" color="var(--color-text)"/>
        </button>
         <C_Menu isOpen={isOpen} onSelectItem={toggle} pos={{ right: 8, top: '100%' }} options={options} alignment={alignment} />
    </div>
}

export default C_Dropdown;