
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const adDomains = ['gizokraijaw', 'tzegilo', 'highperformanceformat', 'profitablecpmrate', 'simplisticpride'];

const injectAdsterra = () => {
    if (document.getElementById('adsterra-global')) return;
    const opt = document.createElement('script');
    opt.id = 'adsterra-global';
    opt.innerHTML = `atOptions={'key':'5a781c0a705a6bd34f0bc3518a4fce73','format':'iframe','height':90,'width':728,'params':{}};`;
    const inv = document.createElement('script');
    inv.src = 'https://www.highperformanceformat.com/5a781c0a705a6bd34f0bc3518a4fce73/invoke.js';
    inv.async = true;
    document.head.appendChild(opt);
    document.head.appendChild(inv);
};

const removeAdsterra = () => {
    document.querySelectorAll('script').forEach(el => {
        if (adDomains.some(d => el.src?.includes(d) || el.innerHTML?.includes(d))) el.remove();
        if (el.id === 'adsterra-global') el.remove();
    });
    document.querySelectorAll('iframe').forEach(el => {
        if (adDomains.some(d => el.src?.includes(d))) el.remove();
    });
    document.querySelectorAll('body > div').forEach(el => {
        if (el.id === 'root' || el.closest('#root')) return;
        const style = window.getComputedStyle(el);
        if ((style.position === 'fixed' || style.position === 'absolute') && parseInt(style.zIndex) > 100) el.remove();
        if (el.id?.match(/ad|pop|overlay|banner/i) || el.className?.match?.(/ad|pop|overlay|banner/i)) el.remove();
    });
    document.querySelectorAll('[data-zone="216659"]').forEach(el => el.remove());
};

const GlobalAdCleanup = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const isAdPage = path.startsWith('/blog') || path.startsWith('/offers');
        const isNoAdPage = path.startsWith('/hiring');

        if (isAdPage) {
            injectAdsterra();
        } else {
            // Remove ads everywhere else, including /hiring
            removeAdsterra();
            const interval = setInterval(removeAdsterra, 800);
            const timeout = setTimeout(() => clearInterval(interval), 8000);
            return () => { clearInterval(interval); clearTimeout(timeout); };
        }
    }, [location.pathname]);

    return null;
};

export default GlobalAdCleanup;
