import React, { useEffect, useRef } from "react";
import './collapsible.css';

const C_Collapsible = ({ children, id, isCollapsed }) => {

    const collapsible = useRef(undefined);
    const oldRect = useRef(undefined);
    
    useEffect(() => {
        if (!collapsible) return;

        if (!oldRect.current) {
            const el = document.getElementById(id);
            oldRect.current = el.querySelector('.collapsible-measure').getBoundingClientRect();
        }

        const measure = collapsible.current.querySelector('.collapsible-measure');
        const resizeObserver = new ResizeObserver((entries) => {
            if (oldRect.current.height !== entries[0].contentRect.height) {
                collapsible.current.style.height = entries[0].contentRect.height + "px";
                oldRect.current = entries[0].contentRect;
            }
        });

        resizeObserver.observe(measure);

        return () => {
            resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => {
        if (isCollapsed) {
            collapsible.current.style.height = 0;
            return;
        }

        const measure = collapsible.current.querySelector('.collapsible-measure');
        collapsible.current.style.height = measure.clientHeight + "px";
    }, [isCollapsed])

    return <div id={id} className="collapsible" ref={collapsible}>
        <div className="collapsible-measure">
            {children}
        </div>
    </div>
}

export default C_Collapsible;