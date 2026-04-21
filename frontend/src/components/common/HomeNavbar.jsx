import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function HomeNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Blog', path: '/blog' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
    ]

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            padding: '20px 0',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.95)', // Light Mode
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <img src="/logos/logo.svg?v=2" alt="TimelinePlus" style={{ height: '50px' }} />
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#18181b', letterSpacing: '-0.5px' }}>TimelinePlus</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={{ color: '#18181b', fontSize: '0.95rem', fontWeight: 600, transition: 'color 0.3s' }}
                            className="nav-link"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/login" style={{ color: '#18181b', fontWeight: 600 }}>Login</Link>
                    <Link to="/register">
                        <button className="glass-btn secondary" style={{ padding: '10px 25px', borderRadius: '50px', fontSize: '0.9rem' }}>
                            Get Started <FiArrowRight />
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle">
                    <div onClick={toggleMenu} style={{ 
                        width: '40px', height: '40px', borderRadius: '12px', background: '#f3f4f6', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#18181b',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                    >
                        <div className="container" style={{ display: 'flex', flexDirection: 'column', padding: '40px 20px', gap: '20px' }}>
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{ fontSize: '1.2rem', color: '#18181b', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <Link to="/login" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
                                    <button className="glass-btn w-full" style={{ justifyContent: 'center', width: '100%', color: '#18181b', border: '1px solid #18181b' }}>Login</button>
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
                                    <button className="glass-btn secondary w-full" style={{ justifyContent: 'center', width: '100%' }}>Get Started</button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .desktop-menu { display: none !important; }
        .mobile-toggle { display: block !important; }
        
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link:hover { color: #FF6600 !important; }
      `}</style>
        </nav>
    )
}
