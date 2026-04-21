import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
        setIsOpen(false)
    }

    return (
        <>
            <nav className="glass-card" style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                zIndex: 500,
                padding: '8px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '0',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <img src="/logos/logo.svg?v=2" alt="TimelinePlus" style={{ height: '40px' }} />
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#18181b', letterSpacing: '-0.5px' }}>TimelinePlus</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-2xl p-2 text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} // Hidden by default, shown via CSS query
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Mobile Toggle Visible only on small screens via style override or class */}
                <div className="mobile-toggle" style={{ display: 'none' }}>
                    <div onClick={() => setIsOpen(!isOpen)} style={{ 
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

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/blog" style={{ color: '#18181b', fontSize: '0.95rem', fontWeight: 600, marginRight: '10px' }}>Blog</Link>
                            <Link to="/login" className="text-main font-bold">Login</Link>
                            <Link to="/register">
                                <button className="glass-btn secondary" style={{ padding: '8px 20px', borderRadius: '30px' }}>
                                    Join Now
                                </button>
                            </Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Link to="/blog" style={{ color: '#18181b', fontSize: '0.95rem', fontWeight: 600, marginRight: '8px' }}>Blog</Link>
                            
                            {/* Balance Badge */}
                            <div style={{ 
                                padding: '6px 14px', 
                                borderRadius: '50px', 
                                fontSize: '0.9rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: '#047857',
                                fontWeight: 600,
                                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)'
                            }}>
                                <span style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 800 }}>USD</span> 
                                <span>{user?.balance?.toLocaleString() || 0}</span>
                            </div>

                            {/* Profile Button */}
                            <Link to="/profile">
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    overflow: 'hidden',
                                    background: '#f3f4f6',
                                    border: '2px solid #ffffff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    color: '#6b7280',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <FiUser size={18} />
                                    )}
                                </div>
                            </Link>

                            {/* Logout Button */}
                            <button onClick={handleLogout} style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                background: '#fee2e2',
                                color: '#ef4444',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: '70px',
                            left: 0,
                            right: 0,
                            background: 'white',
                            zIndex: 499,
                            padding: '20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            borderBottom: '1px solid #f3f4f6'
                        }}
                    >
                        {isAuthenticated && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f9fafb', borderRadius: '10px' }}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiUser /></div>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{user?.name || 'User'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>${user?.balance?.toLocaleString() || 0}</div>
                                    </div>
                                </div>

                                <Link to="/profile" onClick={() => setIsOpen(false)} style={{ padding: '10px', fontWeight: '600' }}>Profile</Link>
                                <button onClick={handleLogout} style={{ padding: '10px', fontWeight: '600', color: '#ef4444', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        )}
                        {!isAuthenticated && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Link to="/login" onClick={() => setIsOpen(false)} style={{ padding: '10px', fontWeight: '600' }}>Login</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} style={{ padding: '10px', fontWeight: '600', color: '#FF6600' }}>Join Now</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-menu { display: none !important; }
                    .mobile-toggle { display: block !important; }
                }
            `}</style>
        </>
    )
}
