import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { FiUser, FiMail, FiLock, FiSmartphone, FiSave, FiMapPin, FiCreditCard, FiLink, FiAlertCircle, FiAward, FiUserPlus, FiUsers, FiDollarSign, FiX, FiCheck } from 'react-icons/fi'
import VerifiedBadge from '../components/common/VerifiedBadge'

const COUNTRIES = [
    { code: '', label: 'Select Country' },
    { code: 'US', label: '🇺🇸 United States' },
    { code: 'GB', label: '🇬🇧 United Kingdom' },
    { code: 'CA', label: '🇨🇦 Canada' },
    { code: 'AU', label: '🇦🇺 Australia' },
    { code: 'DE', label: '🇩🇪 Germany' },
    { code: 'FR', label: '🇫🇷 France' },
    { code: 'IN', label: '🇮🇳 India' },
    { code: 'PK', label: '🇵🇰 Pakistan' },
    { code: 'BR', label: '🇧🇷 Brazil' },
    { code: 'IT', label: '🇮🇹 Italy' },
    { code: 'ES', label: '🇪🇸 Spain' },
    { code: 'NL', label: '🇳🇱 Netherlands' },
    { code: 'SE', label: '🇸🇪 Sweden' },
    { code: 'NO', label: '🇳🇴 Norway' },
    { code: 'AT', label: '🇦🇹 Austria' },
    { code: 'PL', label: '🇵🇱 Poland' },
    { code: 'SI', label: '🇸🇮 Slovenia' },
    { code: 'BG', label: '🇧🇬 Bulgaria' },
    { code: 'IE', label: '🇮🇪 Ireland' },
    { code: 'ZA', label: '🇿🇦 South Africa' },
];

const CURRENCY_RATES = {
    // Approx rates for demonstration purposes as 1 Memoney = $0.000018 => 10,000 Memoney = $0.18
    // We will use 1 USD = fixed local rates
    PK: { symbol: 'Rs', rate: 280, name: 'PKR' },
    IN: { symbol: '₹', rate: 83, name: 'INR' },
    GB: { symbol: '£', rate: 0.79, name: 'GBP' },
    CA: { symbol: 'CA$', rate: 1.35, name: 'CAD' },
    AU: { symbol: 'AU$', rate: 1.52, name: 'AUD' },
    DE: { symbol: '€', rate: 0.92, name: 'EUR' },
    FR: { symbol: '€', rate: 0.92, name: 'EUR' },
    IT: { symbol: '€', rate: 0.92, name: 'EUR' },
    ES: { symbol: '€', rate: 0.92, name: 'EUR' },
    NL: { symbol: '€', rate: 0.92, name: 'EUR' },
    BR: { symbol: 'R$', rate: 4.98, name: 'BRL' },
    ZA: { symbol: 'R', rate: 19.0, name: 'ZAR' }
};

export default function Profile() {
    const { user, checkAuth } = useAuthStore()
    const { addToast } = useToastStore()
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [referralStats, setReferralStats] = useState({ total_invites: 0, active_referrals: 0, total_earnings: 0 });
    const [referralCode, setReferralCode] = useState('');
    const [bindingReferral, setBindingReferral] = useState(false);

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
            phone: '',
            city: user?.city || '',
            gender: user?.gender || 'male',
            payout_account: user?.payout_account || '',
            payout_method: user?.payout_method || '',
            social_link: user?.social_link || '',
            country: user?.country || '',
            device: user?.device || '',
            username: user?.username || ''
        }
    })

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (user && user.id) {
            fetch(`https://timelineplus.site/api/profile/referrals/${user.id}`)
                .then(res => res.json())
                .then(data => setReferralStats(data))
                .catch(err => console.error(err));
        }
    }, [user])

    const usernameVal = watch("username", "")
    const [usernameAvailable, setUsernameAvailable] = useState(null)
    const [usernameChecking, setUsernameChecking] = useState(false)

    // Debounced username check for Profile
    useEffect(() => {
        if (!usernameVal || usernameVal === user?.username) {
            setUsernameAvailable(null)
            return
        }
        if (usernameVal.length < 3) {
            setUsernameAvailable(false)
            return
        }
        const check = async () => {
            setUsernameChecking(true)
            try {
                const res = await fetch(`https://timelineplus.site/api/auth/check-username?username=${usernameVal}`)
                const data = await res.json()
                setUsernameAvailable(data.available)
            } catch (e) {
                setUsernameAvailable(null)
            } finally {
                setUsernameChecking(false)
            }
        }
        const timer = setTimeout(check, 500)
        return () => clearTimeout(timer)
    }, [usernameVal, user])

    const handleBindReferral = async () => {
        if (!referralCode.trim()) return addToast('error', 'Please enter a username');
                setBindingReferral(true);
        try {
            const res = await fetch('https://timelineplus.site/api/auth/bind-referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, referredByUsername: referralCode.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                addToast('success', 'Referral linked successfully!');
                setReferralCode('');
                checkAuth();
            } else {
                addToast('error', data.error || 'Failed to link referral');
            }
        } catch (e) {
            addToast('error', 'Network error');
        } finally {
            setBindingReferral(false);
        }
    };

const onSubmit = async (data) => {
        if (usernameAvailable === false) {
            return addToast('error', 'Username is taken or invalid!')
        }
        try {
            const res = await fetch(`https://timelineplus.site/api/profile/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    username: data.username,
                    country: data.country,
                    device: data.device,
                    name: data.name,
                    phone: data.phone,
                    city: data.city,
                    gender: data.gender,
                    payout_method: data.payout_method,
                    payout_account: data.payout_account,
                    social_link: data.social_link
                })
            });
            const result = await res.json();
            if (res.ok) {
                addToast('success', 'Profile updated successfully!')
                checkAuth()
            } else {
                addToast('error', result.error || 'Failed to update profile')
            }
        } catch (e) {
            addToast('error', 'Network error updating profile')
        }
    }

    useEffect(() => {
        if (user) {
            setValue('name', user.name)
            setValue('email', user.email)
            setValue('username', user.username)
            setValue('phone', user.phone)
            setValue('city', user.city)
            setValue('gender', user.gender)
            setValue('social_link', user.social_link)
            setValue('country', user.country)
            setValue('device', user.device)
            setValue('payout_method', user.payout_method || '')
            setValue('payout_account', user.payout_account || '')
            if (user.avatar) setAvatarPreview(user.avatar)
        }
    }, [user, setValue])

    return (
        <div style={{ padding: '100px 20px 100px' }} className="container">
            <SEO
                title="My Profile - User Settings"
                description="Update your personal information, connect your social accounts, and manage your payment details on TimelinePlus."
            />
            <Navbar />

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
                        <div
                            style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                background: user?.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, rgb(176, 97, 97), rgb(126, 215, 193))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '3.5rem', fontWeight: 'bold', overflow: 'hidden',
                                boxShadow: '0 0 30px rgba(126, 215, 193, 0.4)',
                                border: '4px solid white',
                                cursor: 'pointer'
                            }}
                            onClick={() => document.getElementById('avatarInput').click()}
                        >
                            {!user?.avatar && (user?.name?.[0]?.toUpperCase() || 'U')}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            id="avatarInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append('avatar', file);
                                formData.append('userId', user.id);

                                try {
                                    const res = await fetch('https://timelineplus.site/api/profile/upload-avatar', {
                                        method: 'POST',
                                        body: formData
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        addToast('success', 'Profile picture updated!');
                                        checkAuth();
                                    } else {
                                        addToast('error', data.error);
                                    }
                                } catch (err) {
                                    addToast('error', 'Upload failed');
                                }
                            }}
                        />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
                        {user?.name} 
                        {(user?.profile_verified === 1 || user?.role === 'admin' || user?.is_super_admin === 1) && <VerifiedBadge size={24} />}
                    </h2>
                    <p className="text-muted">@{user?.username || 'no-username'}</p>

                    <div style={{ marginTop: '15px' }}>
                        <div className="glass-card" style={{ padding: '10px 15px', display: 'inline-flex', alignItems: 'center', gap: '10px', borderRadius: '30px' }}>
                            <FiLink size={14} className="text-muted" />
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{window.location.origin}/register?ref={user?.username}</span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.username}`);
                                    addToast('success', 'Referral link copied!');
                                }}
                                style={{ background: 'none', border: 'none', color: '#FF6600', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
                            >
                                COPY
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* MEMONEY SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mb-8"
                    style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', border: '2px solid #FFD700' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Memoney Wallet 💸</h3>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Earned from posting, liking & sharing content.</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#DAA520' }}>{user?.memoney_balance || 0} <span style={{fontSize: '1rem'}}>M</span></h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#4b5563' }}>
                                ≈ ${((user?.memoney_balance || 0) * 0.000018).toFixed(2)} USD
                            </p>
                            {user?.country && CURRENCY_RATES[user.country] && (
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                                    ≈ {CURRENCY_RATES[user.country].symbol} {(((user?.memoney_balance || 0) * 0.000018) * CURRENCY_RATES[user.country].rate).toFixed(2)} {CURRENCY_RATES[user.country].name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <button
                            onClick={async () => {
                                if ((user?.memoney_balance || 0) < 10000) return addToast('error', 'Min 10,000 Memoney required to convert!');
                                if (!confirm('Convert 10,000 Memoney to USD?')) return;
                                try {
                                    const res = await fetch('https://timelineplus.site/api/memoney/convert', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ userId: user.id, amount: 10000 })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        addToast('success', `Success! Added $${data.usd_reward} to your balance.`);
                                        checkAuth();
                                    } else {
                                        addToast('error', data.error);
                                    }
                                } catch (e) { addToast('error', 'Conversion failed'); }
                            }}
                            className="glass-btn primary"
                            style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', border: 'none', color: 'white', fontWeight: 800 }}
                        >
                            Convert to USD
                        </button>

                        {!user?.is_verified && (
                            <button
                                onClick={async () => {
                                    if ((user?.memoney_balance || 0) < 50000) return addToast('error', 'Need 50,000 Memoney for Verified Badge!');
                                    if (!confirm('Buy Verified Badge for 50,000 Memoney?')) return;
                                    try {
                                        const res = await fetch('https://timelineplus.site/api/memoney/buy-verified', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId: user.id })
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            addToast('success', 'Congratulations! You are now verified. 💎');
                                            checkAuth();
                                        } else {
                                            addToast('error', data.error);
                                        }
                                    } catch (e) { addToast('error', 'Purchase failed'); }
                                }}
                                className="glass-btn secondary"
                                style={{ background: '#18181b', color: 'white', fontWeight: 800 }}
                            >
                                Buy Verified (50k) 💎
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Verification Warning */}
                {user && !user.is_verified && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ background: 'rgba(255, 102, 0, 0.1)', border: '1px solid #ff6600', padding: '15px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiAlertCircle style={{ color: '#ff6600', fontSize: '1.5rem' }} />
                            <div>
                                <div style={{ fontWeight: 'bold', color: '#ff6600' }}>Email Not Verified</div>
                                <div style={{ fontSize: '0.9rem', color: '#555' }}>You cannot update your profile until verified.</div>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch('https://timelineplus.site/api/auth/resend-verification', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email: user.email })
                                    });
                                    const data = await res.json();
                                    if (res.ok) addToast('success', data.message);
                                    else addToast('error', data.error);
                                } catch (e) { addToast('error', 'Failed to resend email'); }
                            }}
                            className="glass-btn secondary"
                            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        >
                            Resend Email
                        </button>
                    </motion.div>
                )}

                {/* Referral Overview Module — Redesigned */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '30px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px -10px rgba(255, 102, 0, 0.25)' }}
                >
                    {/* Hero Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ff6600 0%, #ff9500 50%, #ffcc00 100%)',
                        padding: '30px 30px 20px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative circles */}
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }}></div>
                        <div style={{ position: 'absolute', bottom: '-30px', right: '80px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '12px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🎁</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Invite & Earn</h3>
                                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>Invite friends and earn rewards together!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link Box */}
                    <div style={{ background: '#fff', padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                        <p style={{ margin: '0 0 10px', fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Your Referral Link</p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{
                                flex: 1, background: '#f7f9f9', border: '2px solid #e5e7eb', borderRadius: '14px',
                                padding: '12px 16px', fontSize: '0.9rem', color: '#374151', fontWeight: 600,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                                https://timelineplus.site/register?ref={user?.username || user?.id}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(`https://timelineplus.site/register?ref=${user?.username || user?.id}`);
                                    addToast('success', 'Referral link copied! Share your @' + (user?.username || 'profile') + ' link');
                                }}
                                style={{
                                    flexShrink: 0, padding: '12px 22px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #ff6600, #ff9500)',
                                    color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,102,0,0.35)',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'transform 0.15s, box-shadow 0.15s'
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,102,0,0.4)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,102,0,0.35)'; }}
                            >
                                <FiLink size={16} /> Copy
                            </button>
                        </div>
                    </div>

                    {/* Stat Link Box - Binding Area */}
                    {!user?.referred_by_id ? (
                        <div style={{ background: '#fff9f5', padding: '24px 28px', borderBottom: '1px solid #ffe8d6' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '0.8rem', fontWeight: 800, color: '#ff6600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Bind Referrer</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Friend's Username (e.g. admin)" 
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', border: '2px solid #ffcc00', fontSize: '0.9rem', outline: 'none' }}
                                />
                                <button 
                                    onClick={handleBindReferral}
                                    disabled={bindingReferral}
                                    style={{ 
                                        padding: '12px 24px', borderRadius: '14px', background: '#ff6600', color: '#fff', 
                                        border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,102,0,0.2)'
                                    }}
                                >
                                    {bindingReferral ? 'Wait...' : 'Link'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '10px', fontWeight: 600 }}>Enter your friend's username to link accounts and unlock bonuses.</p>
                        </div>
                    ) : (
                        <div style={{ background: '#f0fdf4', padding: '16px 28px', borderBottom: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#dcfce7', color: '#10b981', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiCheck size={16} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>Linked to Referrer:</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', marginLeft: '6px' }}>@{user.referrer_username || 'linked'}</span>
                            </div>
                        </div>
                    )}

                    {/* Stats Row */}
                    <div style={{ background: '#fff', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {[
                            { icon: <FiUsers size={20} />, label: 'Total Invites', value: referralStats.total_invites, color: '#6366f1', bg: '#eef2ff' },
                            { icon: <FiAward size={20} />, label: 'Active Friends', value: referralStats.active_referrals, color: '#10b981', bg: '#ecfdf5' },
                            { icon: <FiDollarSign size={20} />, label: 'Earned', value: `${(referralStats.total_earnings || 0).toLocaleString()} Memoney ($${((referralStats.total_earnings || 0) * (15 / 5000) / 278).toFixed(2)})`, color: '#f59e0b', bg: '#fffbeb' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: '20px 16px', textAlign: 'center',
                                borderRight: i < 2 ? '1px solid #f3f4f6' : 'none'
                            }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: item.bg, color: item.color, marginBottom: '10px' }}>
                                    {item.icon}
                                </div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{item.value}</div>
                                <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                    <style>{`
                        .pf-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid #f0f0f0; }
                        .pf-section-head { display: flex; align-items: center; gap: 12px; padding: 20px 24px; border-bottom: 1px solid #f5f5f5; }
                        .pf-section-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                        .pf-section-title { font-size: 1.05rem; font-weight: 800; color: #0f1419; margin: 0; }
                        .pf-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 20px 24px; }
                        @media(max-width: 600px) { .pf-fields { grid-template-columns: 1fr; } }
                        .pf-label { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; }
                        .pf-input-wrap { position: relative; }
                        .pf-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
                        .pf-input { width: 100%; padding: 12px 14px 12px 42px; border: 2px solid #f0f0f0; border-radius: 12px; font-size: 0.93rem; color: #0f1419; font-family: inherit; background: #fafafa; transition: border-color 0.2s, box-shadow 0.2s; outline: none; box-sizing: border-box; }
                        .pf-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); background: #fff; }
                        .pf-input:disabled { opacity: 0.5; cursor: not-allowed; background: #f3f4f6; }
                        .pf-select { width: 100%; padding: 12px 14px 12px 42px; border: 2px solid #f0f0f0; border-radius: 12px; font-size: 0.93rem; color: #0f1419; font-family: inherit; background: #fafafa; appearance: none; cursor: pointer; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                        .pf-select:focus { border-color: #667eea; }
                        .pf-locked-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 700; color: #6366f1; background: #eef2ff; padding: 2px 8px; border-radius: 20px; margin-left: 6px; }
                        .pf-social-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; border-bottom: 1px solid #f5f5f5; }
                        .pf-social-row:last-child { border-bottom: none; }
                        .pf-connect-btn { padding: 7px 16px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; border: 2px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; }
                        .pf-connect-btn:hover { border-color: #667eea; color: #667eea; background: #f5f3ff; }
                        .pf-linked-badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; background: #ecfdf5; color: #059669; }
                        .pf-coming-badge { padding: 6px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; background: #f3f4f6; color: #9ca3af; }
                    `}</style>

                    {/* ── Personal Details ── */}
                    <div className="pf-card">
                        <div className="pf-section-head">
                            <div className="pf-section-icon" style={{ background: '#eef2ff', color: '#6366f1' }}><FiUser size={18} /></div>
                            <p className="pf-section-title">Personal Details</p>
                        </div>
                        <div className="pf-fields">
                            <div>
                                <div className="pf-label"><FiUser size={12} /> Full Name</div>
                                <div className="pf-input-wrap">
                                    <FiUser size={15} className="pf-input-icon" />
                                    <input {...register("name")} className="pf-input" placeholder="Your full name" />
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiUser size={12} /> Username</div>
                                <div className="pf-input-wrap">
                                    <FiUser size={15} className="pf-input-icon" />
                                    <input
                                        {...register("username")}
                                        className="pf-input"
                                        placeholder="@username"
                                        style={{ paddingRight: '40px', borderColor: usernameAvailable === false ? '#ef4444' : usernameAvailable === true ? '#10b981' : '' }}
                                    />
                                    {usernameVal !== user?.username && usernameVal?.length >= 3 && (
                                        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                                            {usernameChecking ? (
                                                <div style={{width: 16, height: 16, border: '2px solid #ccc', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                                            ) : usernameAvailable ? <FiCheck color="#10b981" size={18} /> : <FiX color="#ef4444" size={18} />}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiMail size={12} /> Email <span className="pf-locked-badge"><FiLock size={9}/> Locked</span></div>
                                <div className="pf-input-wrap">
                                    <FiMail size={15} className="pf-input-icon" />
                                    <input {...register("email")} disabled className="pf-input" />
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiSmartphone size={12} /> Phone Number</div>
                                <div className="pf-input-wrap">
                                    <FiSmartphone size={15} className="pf-input-icon" />
                                    <input {...register("phone")} className="pf-input" placeholder="+92 300 1234567" />
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiMapPin size={12} /> City</div>
                                <div className="pf-input-wrap">
                                    <FiMapPin size={15} className="pf-input-icon" />
                                    <input {...register("city")} className="pf-input" placeholder="e.g. Lahore" />
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiUser size={12} /> Gender</div>
                                <div className="pf-input-wrap">
                                    <FiUser size={15} className="pf-input-icon" />
                                    <select {...register("gender")} className="pf-select">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiMapPin size={12} /> Country {user?.country && <span className="pf-locked-badge"><FiLock size={9}/> Locked</span>}</div>
                                <div className="pf-input-wrap">
                                    <FiMapPin size={15} className="pf-input-icon" />
                                    {user?.country ? (
                                        <input disabled value={COUNTRIES.find(c => c.code === user?.country)?.label?.replace(/^\S+\s/, '') || user?.country} className="pf-input" />
                                    ) : (
                                        <select {...register("country")} className="pf-select">
                                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiSmartphone size={12} /> Device Type {user?.device && <span className="pf-locked-badge"><FiLock size={9}/> Locked</span>}</div>
                                <div className="pf-input-wrap">
                                    <FiSmartphone size={15} className="pf-input-icon" />
                                    {user?.device ? (
                                        <input disabled value={user?.device} className="pf-input" style={{ textTransform: 'capitalize' }} />
                                    ) : (
                                        <select {...register("device")} className="pf-select">
                                            <option value="">Select Device</option>
                                            <option value="desktop">Desktop / Laptop</option>
                                            <option value="android">Mobile (Android)</option>
                                            <option value="iphone">iPhone / iOS</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Payment Info ── */}
                    <div className="pf-card">
                        <div className="pf-section-head">
                            <div className="pf-section-icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiCreditCard size={18} /></div>
                            <p className="pf-section-title">Payment Info</p>
                        </div>
                        <div className="pf-fields">
                            <div>
                                <div className="pf-label"><FiCreditCard size={12} /> Payout Method</div>
                                <div className="pf-input-wrap">
                                    <FiCreditCard size={15} className="pf-input-icon" />
                                    <select {...register("payout_method")} className="pf-select">
                                        <option value="">Select Method</option>
                                        <option value="Jazzcash">JazzCash</option>
                                        <option value="Easypaisa">Easypaisa</option>
                                        <option value="Upaisa">Upaisa</option>
                                        <option value="Sadapay">Sadapay</option>
                                        <option value="Nayapay">Nayapay</option>
                                        <option value="Bank Account">Bank Account</option>
                                        <option value="Firstpay">Firstpay</option>
                                        <option value="Binance USDT">Binance USDT (TRC20)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiDollarSign size={12} /> Account Details</div>
                                <div className="pf-input-wrap">
                                    <FiDollarSign size={15} className="pf-input-icon" />
                                    <input {...register("payout_account")} className="pf-input" placeholder="Account number, IBAN, or address" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Social & Security ── */}
                    <div className="pf-card">
                        <div className="pf-section-head">
                            <div className="pf-section-icon" style={{ background: '#fce7f3', color: '#db2777' }}><FiLink size={18} /></div>
                            <p className="pf-section-title">Social & Security</p>
                        </div>
                        <div className="pf-fields">
                            <div>
                                <div className="pf-label"><FiLink size={12} /> Social Profile Link</div>
                                <div className="pf-input-wrap">
                                    <FiLink size={15} className="pf-input-icon" />
                                    <input {...register("social_link")} className="pf-input" placeholder="https://instagram.com/..." />
                                </div>
                            </div>
                            <div>
                                <div className="pf-label"><FiLock size={12} /> New Password</div>
                                <div className="pf-input-wrap">
                                    <FiLock size={15} className="pf-input-icon" />
                                    <input type="password" {...register("password")} className="pf-input" placeholder="Leave empty to keep current" />
                                </div>
                            </div>
                        </div>

                        {/* Connected Accounts */}
                        <div style={{ borderTop: '1px solid #f5f5f5', padding: '14px 24px 6px' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Connected Accounts</p>
                        </div>
                        {[
                            { name: 'Google', logo: 'https://www.svgrepo.com/show/475656/google-color.svg', connected: user?.google_id, link: 'https://timelineplus.site/api/auth/google', linkLabel: 'Connect' },

                            { name: 'TikTok', logo: 'https://www.svgrepo.com/show/303260/tiktok-logo-logo.svg', comingSoon: true }
                        ].map((platform, i) => (
                            <div className="pf-social-row" key={i} style={{ opacity: platform.comingSoon ? 0.5 : 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f7f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #efefef', flexShrink: 0 }}>
                                        <img src={platform.logo} alt={platform.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#0f1419', fontSize: '0.95rem' }}>{platform.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: platform.connected ? '#059669' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, marginTop: '2px' }}>
                                            {platform.comingSoon ? <><FiAlertCircle size={12} /> Coming Soon</> : platform.connected ? <><FiCheck size={12} /> Connected</> : <><FiX size={12} /> Not Connected</>}
                                        </div>
                                    </div>
                                </div>
                                {platform.comingSoon ? <span className="pf-coming-badge">Soon</span>
                                    : platform.connected ? <span className="pf-linked-badge"><FiCheck size={13} /> Linked</span>
                                    : <a href={platform.link} className="pf-connect-btn"><FiUserPlus size={13} /> {platform.linkLabel}</a>}
                            </div>
                        ))}
                    </div>

                    {/* ── Save Button ── */}
                    <button
                        type="submit"
                        style={{
                            width: '100%', padding: '16px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff', border: 'none', fontWeight: 800, fontSize: '1.05rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            cursor: 'pointer', boxShadow: '0 8px 24px rgba(102,126,234,0.35)',
                            transition: 'transform 0.15s, box-shadow 0.15s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(102,126,234,0.45)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.35)'; }}
                    >
                        <FiSave size={20} /> Save Profile Changes
                    </button>
                </motion.form>
            </div>
        </div>
    )
}

