import React from 'react';
import { Link } from 'react-router-dom';

export default function PostTextFormatter({ text }) {
    if (!text) return null;

    // We split by a combined regex that captures both #hashtags and @mentions
    // The regex captures the symbol and the word
    const regex = /([#@][a-zA-Z0-9_]+)/g;
    const parts = text.split(regex);

    return (
        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
            {parts.map((part, index) => {
                if (part.startsWith('@')) {
                    const username = part.slice(1);
                    return (
                        <Link 
                            key={index} 
                            to={`/user/${username}`} 
                            style={{ color: '#1d9bf0', textDecoration: 'none', fontWeight: 600, transition: 'text-decoration 0.2s' }}
                            onMouseOver={e => e.target.style.textDecoration = 'underline'}
                            onMouseOut={e => e.target.style.textDecoration = 'none'}
                        >
                            {part}
                        </Link>
                    );
                }
                
                if (part.startsWith('#')) {
                    const tag = part.slice(1);
                    return (
                        <Link 
                            key={index} 
                            to={`/explore?tag=${tag}`} 
                            style={{ color: '#1d9bf0', textDecoration: 'none', fontWeight: 600, transition: 'text-decoration 0.2s' }}
                            onMouseOver={e => e.target.style.textDecoration = 'underline'}
                            onMouseOut={e => e.target.style.textDecoration = 'none'}
                        >
                            {part}
                        </Link>
                    );
                }

                // Normal text
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </span>
    );
}
