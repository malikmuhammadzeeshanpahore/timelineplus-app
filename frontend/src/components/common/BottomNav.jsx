import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiBriefcase, FiCreditCard, FiUser, FiPlus } from 'react-icons/fi'
import { useAuthStore } from '../../context/useAuthStore'

export default function BottomNav() {
    const { isAuthenticated, user } = useAuthStore()
    const location = useLocation()

    if (!isAuthenticated) return null

    // Valid paths where BottomNav should appear
    const allowedPaths = ['/dashboard', '/jobs', '/offers', '/wallet', '/profile'];

    // Check if current path is allowed (exact match) or if it's the wallet action URL
    const isAllowed = allowedPaths.includes(location.pathname) ||
        (location.pathname === '/wallet' && location.search.includes('action=deposit'));

    if (!isAllowed) return null;

    const isActive = (path) => location.pathname === path

    // Different Menus based on Role
    let navItems = []

    if (user?.role === 'buyer') {
        navItems = [
            { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
            { name: 'Jobs', path: '/offers', icon: <FiBriefcase /> },
            { name: 'Deposit', path: '/wallet?action=deposit', icon: <FiPlus />, isSpecial: true },
            { name: 'Wallet', path: '/wallet', icon: <FiCreditCard /> },
            { name: 'Profile', path: '/profile', icon: <FiUser /> },
        ]
    } else {
        // Freelancer Menu (No special Deposit button, just standard Wallet link)
        navItems = [
            { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
            { name: 'Jobs', path: '/jobs', icon: <FiBriefcase /> },
            { name: 'Wallet', path: '/wallet', icon: <FiCreditCard /> },
            { name: 'Profile', path: '/profile', icon: <FiUser /> },
        ]
    }

    return (
        <div className="glass-card" style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            maxWidth: '100%',
            zIndex: 1000,
            padding: '10px 20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '0',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            background: 'rgba(255, 255, 255, 1)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
            backdropFilter: 'none'
        }}>
            {navItems.map((item) => {
                const active = isActive(item.path.split('?')[0]);
                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            color: active ? '#ff6600' : '#71717a',
                            textDecoration: 'none',
                            flex: 1,
                            transition: 'all 0.3s',
                            // Special handling for the center "Deposit" button
                            ...(item.isSpecial ? {
                                transform: 'translateY(0px)',
                                background: 'linear-gradient(135deg, #ff6600 0%, #ff8e53 100%)',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(255, 102, 0, 0.3)',
                                flex: 'none'
                            } : {})
                        }}
                    >
                        <div style={{ fontSize: item.isSpecial ? '1.4rem' : '1.3rem' }}>{item.icon}</div>
                        {!item.isSpecial && <span style={{ fontSize: '0.65rem', fontWeight: active ? '600' : '400' }}>{item.name}</span>}
                    </Link>
                )
            })}
        </div>
    )
}
