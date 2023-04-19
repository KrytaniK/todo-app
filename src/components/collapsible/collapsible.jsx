import React, { useState, useEffect, useRef } from "react";
import './collapsible.css';

const C_Collapsible = ({ children, id, isCollapsed, enableScroll }) => {

    const [isScrolling, setIsScrolling] = useState(false);

    const collapsible = useRef(undefined);
    const measure = useRef(undefined);
    
    useEffect(() => {
        if (!collapsible || !measure) return;

        const resizeObserver = new ResizeObserver(() => {
            const measureHeight = parseInt(window.getComputedStyle(measure.current).height);
            const collapseHeight = parseInt(collapsible.current.style.height);

            if (collapseHeight === 0)
                return;
            
            if (collapseHeight !== measureHeight) {
                collapsible.current.style.height = measureHeight + "px";
            }

            setIsScrolling(true);
        });

        resizeObserver.observe(measure.current);

        return () => {
            resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => {

        setIsScrolling(true);

        if (isCollapsed) {
            collapsible.current.style.height = 0 + "px";
            return;
        }

        if (measure.current)
            collapsible.current.style.height = window.getComputedStyle(measure.current).height;

    }, [isCollapsed]);

    return <div id={id} className="collapsible" ref={collapsible} style={{ overflowY: enableScroll && !isScrolling ? 'auto' : 'hidden' }} onTransitionEnd={() => { setIsScrolling(false); }}>
        <div className="collapsible-measure" ref={measure}>
            {children}
        </div>
    </div>
}

export default C_Collapsible;