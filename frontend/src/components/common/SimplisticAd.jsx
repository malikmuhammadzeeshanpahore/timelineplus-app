import React, { useEffect, useRef } from 'react';

const SimplisticAd = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.hasAttribute('data-ad-injected')) return;

        // Native HilltopAds Code snippet provided by the user
        const adHtml = `<script>
(function(ndcxp){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = ndcxp || {};
s.src = "\/\/simplisticpride.com\/bBX.VusqddGcl\/0iYnWAci\/yeZmq9\/uRZSUclFkxPlT\/Yy5jMhTlku1KN\/TsM\/tAN\/jPkqx-OIT\/Ug1HNswQ";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
<\/script>`;

        // Using createContextualFragment forces React/Browser to execute the native <script> tags just like raw HTML
        const fragment = document.createRange().createContextualFragment(adHtml);
        
        // We append a dummy script right before to guarentee the hilltop code finds exactly THIS container
        // when it does `d.scripts[d.scripts.length - 1]`
        const anchorScript = document.createElement('script');
        anchorScript.type = 'text/javascript';
        anchorScript.text = '// hilltop ad anchor';
        containerRef.current.appendChild(anchorScript);
        
        containerRef.current.appendChild(fragment);
        containerRef.current.setAttribute('data-ad-injected', 'true');
    }, []);

    return (
        <div ref={containerRef} className="native-hilltop-container" style={{ textAlign: 'center', margin: '15px 0', minHeight: 60, width: '100%', overflow: 'hidden' }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '2px' }}>
                Advertisement
            </div>
        </div>
    );
};

export default SimplisticAd;
