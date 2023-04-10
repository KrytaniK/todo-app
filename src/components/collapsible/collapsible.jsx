import React, { useEffect, useRef } from "react";
import './collapsible.css';

const C_Collapsible = ({ children, collapseTriggerRef }) => {
    
    const collapsible = useRef(undefined);

    useEffect(() => {
        if (!collapsible) return;

        collapseTriggerRef.current.addEventListener('click', toggleCollapse);

        return () => {
            collapseTriggerRef.current.removeEventListener('click', toggleCollapse);
        }
    }, []);

    const toggleCollapse = (event) => {
        event.preventDefault();

        if (!collapsible.current.style.height)
            collapsible.current.style.height = collapsible.current.clientHeight + "px";

        if (collapsible.current.clientHeight) {
            collapsible.current.style.height = 0;
        } else {
            const tasksContainer = collapsible.current.querySelector('.collapsible-measure');
            collapsible.current.style.height = tasksContainer.clientHeight + "px";
        }
    }

    return <div className="collapsible" ref={collapsible}>
        <div className="collapsible-measure">
            {children}
        </div>
    </div>
}

export default C_Collapsible;