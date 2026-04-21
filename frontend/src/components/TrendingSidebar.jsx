import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';

export default function TrendingSidebar() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://timelineplus.site/api/hashtags/trending')
            .then(res => res.json())
            .then(data => {
                setTrending(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch trending tags:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return null; // Or a gentle skeleton

    if (trending.length === 0) return null; // Don't show if empty

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: '100px',
            border: '1px solid #f3f4f6'
        }}>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#111827',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <FiTrendingUp color="#1d9bf0" /> Trending Topics
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {trending.map((tagObj, index) => (
                    <Link 
                        key={index} 
                        to={`/explore?tag=${tagObj.tag.replace('#', '')}`}
                        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                    >
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f1419', transition: 'color 0.2s' }}
                              onMouseOver={e => e.target.style.color = '#1d9bf0'}
                              onMouseOut={e => e.target.style.color = '#0f1419'}>
                            {tagObj.tag}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#536471', fontWeight: 500, marginTop: '2px' }}>
                            {tagObj.usage_count} {tagObj.usage_count === 1 ? 'post' : 'posts'}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
