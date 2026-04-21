
import { useRef, useEffect } from 'react';

const AdsterraBanner = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Avoid duplicate injection
        if (containerRef.current.querySelector('script')) return;

        const optScript = document.createElement('script');
        optScript.type = 'text/javascript';
        optScript.text = JSON.stringify({}) // placeholder
        optScript.innerHTML = `
            atOptions = {
                'key': '5a781c0a705a6bd34f0bc3518a4fce73',
                'format': 'iframe',
                'height': 90,
                'width': 728,
                'params': {}
            };
        `;

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = 'https://www.highperformanceformat.com/5a781c0a705a6bd34f0bc3518a4fce73/invoke.js';
        invokeScript.async = true;

        containerRef.current.appendChild(optScript);
        containerRef.current.appendChild(invokeScript);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '16px 0',
                minHeight: '90px',
                width: '100%',
                overflow: 'hidden'
            }}
        />
    );
};

export default AdsterraBanner;
