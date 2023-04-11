import React, { useEffect, useRef, forwardRef } from "react";
import './collapsible.css';

const C_Collapsible = forwardRef(({ children, id }, ref) => {

    const collapsible = useRef(undefined);
    const oldRect = useRef(undefined);
    
    useEffect(() => {
        if (!collapsible || !ref) return;

        if (!oldRect.current) {
            const el = document.getElementById(id);
            oldRect.current = el.querySelector('.collapsible-measure').getBoundingClientRect();
        }

        ref.current.addEventListener('click', toggleCollapse);

        const measure = collapsible.current.querySelector('.collapsible-measure');
        const resizeObserver = new ResizeObserver((entries) => {
            if (oldRect.current.height !== entries[0].contentRect.height) {
                collapsible.current.style.height = entries[0].contentRect.height + "px";
                oldRect.current = entries[0].contentRect;
            }
        });

        resizeObserver.observe(measure);

        return () => {
            ref.current.removeEventListener('click', toggleCollapse);
            resizeObserver.disconnect();
        }
    }, []);

    const toggleCollapse = (event) => {
        event.preventDefault();

        if (!collapsible.current.style.height)
            collapsible.current.style.height = collapsible.current.clientHeight + "px";

        if (collapsible.current.clientHeight) {
            collapsible.current.style.height = 0;
        } else {
            const measure = collapsible.current.querySelector('.collapsible-measure');
            collapsible.current.style.height = measure.clientHeight + "px";
        }
    }

    return <div id={id} className="collapsible" ref={collapsible}>
        <div className="collapsible-measure">
            {children}
        </div>
    </div>
})

export default C_Collapsible;