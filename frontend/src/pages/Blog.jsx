import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import HomeNavbar from '../components/common/HomeNavbar'
import { motion } from 'framer-motion'
import { FiCalendar, FiArrowRight, FiBookOpen } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../context/useAuthStore'
import AdsterraBanner from '../components/common/AdsterraBanner'
import FeedAd from '../components/common/FeedAd'

export default function Blog() {
    const { isAuthenticated } = useAuthStore()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [adSlots, setAdSlots] = useState({ slot1: '', slot2: '', slot3: '' })

    useEffect(() => {
        fetch('https://timelineplus.site/api/admin/config/feed-ad-code')
            .then(res => res.json())
            .then(data => { if (data) setAdSlots(data) })
            .catch(err => console.error(err))

        fetch('https://timelineplus.site/api/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    return (
        <div style={{ minHeight: '100vh', padding: '100px 20px 60px' }} className="container">
            <SEO
                title="TimelinePlus Blog - Online Earning Tips & Digital Growth"
                description="Explore our latest articles on how to make money online, social media strategy, and AI tools. Get expert insights for digital success."
                keywords="online earning blog, social media strategy, make money online tips"
                injectAd={true}
            />
            {isAuthenticated ? <Navbar /> : <HomeNavbar />}

            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gradient"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, marginBottom: '15px' }}
                >
                    TimelinePlus <span style={{ color: 'white' }}>Blog</span>
                </motion.h1>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Stay updated with the latest trends in AI, social media growth, and online earning strategies.
                </p>
                <AdsterraBanner />
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>Loading interesting stories...</div>
            ) : blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                    <FiBookOpen style={{ fontSize: '3rem', marginBottom: '20px' }} />
                    <h3>No blogs yet. Check back soon!</h3>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '30px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {blogs.map((blog, i) => (
                        <React.Fragment key={blog.id}>
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card hover-card"
                            style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}
                        >
                            <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                                <img
                                    src={blog.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000'}
                                    alt={blog.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', fontSize: '0.85rem' }}>
                                    <span className="badge secondary" style={{ fontSize: '0.75rem' }}>{blog.category}</span>
                                    <span style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FiCalendar /> {new Date(blog.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px', lineHeight: 1.3 }}>{blog.title}</h2>
                                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '20px', flexGrow: 1 }}>
                                    {blog.meta_description}
                                </p>
                                <Link to={`/blog/${blog.slug}`} className="glass-btn primary" style={{ width: 'fit-content', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Read Article <FiArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                        {(i + 1) % 3 === 0 && (
                            <FeedAd 
                                adHtml={
                                    ((i + 1) / 3) % 3 === 1 ? adSlots.slot1 : 
                                    ((i + 1) / 3) % 3 === 2 ? adSlots.slot2 : adSlots.slot3
                                } 
                            />
                        )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}
