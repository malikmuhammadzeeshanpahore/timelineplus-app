import React, { useEffect, useRef } from 'react';

const FeedAd = ({ adHtml }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!adHtml || !containerRef.current) return;
        if (containerRef.current.hasAttribute('data-ad-injected')) return;
        
        containerRef.current.innerHTML = ''; // clear

        try {
            const fragment = document.createRange().createContextualFragment(adHtml);
            const anchorScript = document.createElement('script');
            anchorScript.type = 'text/javascript';
            anchorScript.text = '// local ad anchor';
            containerRef.current.appendChild(anchorScript);
            containerRef.current.appendChild(fragment);
            containerRef.current.setAttribute('data-ad-injected', 'true');
        } catch (e) {
            console.error('Failed to inject FeedAd', e);
        }
    }, [adHtml]);

    if (!adHtml) return null;

    return (
        <div ref={containerRef} className="native-feed-ad" style={{ textAlign: 'center', margin: '16px 0', width: '100%', overflow: 'hidden' }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '2px' }}>
                Advertisement
            </div>
        </div>
    );
};

export default FeedAd;
