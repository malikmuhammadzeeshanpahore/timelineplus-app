import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, injectAd }) => {
    const location = useLocation();

    useEffect(() => {
        // Update Title
        const baseTitle = 'TimelinePlus - Earn Money Online, Simple Tasks & Offers';
        document.title = title ? `${title} | TimelinePlus` : baseTitle;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description || 'Join TimelinePlus today to earn money online by completing simple tasks, watching videos, and completing offers. High payouts and instant withdrawals.');

        // Update Keywords if provided
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords);
        }

        // Canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', `https://timelineplus.site${location.pathname}`);

    }, [title, description, keywords, location.pathname]);


    return null;
};

export default SEO;
