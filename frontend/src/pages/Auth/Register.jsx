import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/useAuthStore'
import { useToastStore } from '../../context/useToastStore'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../../components/common/SEO'
import { FiUser, FiMail, FiLock, FiArrowRight, FiArrowLeft, FiCheck, FiX, FiGlobe, FiSmartphone, FiGift, FiImage } from 'react-icons/fi'
import { useState, useEffect } from 'react'

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
]

const TOTAL_STEPS = 8

const STEPS = [
    { id: 1, title: 'Welcome', subtitle: 'Create your account', icon: '🚀' },
    { id: 2, title: 'Your Role', subtitle: 'How will you use Timeline Earn?', icon: '🎯' },
    { id: 3, title: 'Your Identity', subtitle: 'Set your name & username', icon: '👤' },
    { id: 4, title: 'Email Address', subtitle: 'We\'ll send your verification here', icon: '📧' },
    { id: 5, title: 'Location & Device', subtitle: 'Personalise your offers', icon: '🌍' },
    { id: 6, title: 'Referral Code', subtitle: 'Got a friend\'s code? Enter it!', icon: '🎁' },
    { id: 7, title: 'Password', subtitle: 'Secure your account', icon: '🔒' },
    { id: 8, title: 'Meme Checkpoint', subtitle: 'Upload a meme to complete signup', icon: '🖼️' },
]

export default function Register() {
    const { user, register: registerUser } = useAuthStore()
    const { addToast } = useToastStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
        }
    }, [user, navigate])

    const [step, setStep] = useState(1)
    const [role, setRole] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        country: '',
        device: '',
        referralCode: new URLSearchParams(window.location.search).get('ref') || localStorage.getItem('referredByUsername') || '',
        password: '',
        meme: null,
    })
    const [memePreview, setMemePreview] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Username availability check
    const [usernameAvailable, setUsernameAvailable] = useState(null)
    const [usernameChecking, setUsernameChecking] = useState(false)

    useEffect(() => {
        if (!formData.username || formData.username.length < 3) {
            setUsernameAvailable(null)
            return
        }
        const check = async () => {
            setUsernameChecking(true)
            try {
                const res = await fetch(`https://timelineplus.site/api/auth/check-username?username=${formData.username}`)
                const data = await res.json()
                setUsernameAvailable(data.available)
            } catch {
                setUsernameAvailable(null)
            } finally {
                setUsernameChecking(false)
            }
        }
        const timer = setTimeout(check, 500)
        return () => clearTimeout(timer)
    }, [formData.username])

    const password = formData.password || ''
    const requirements = [
        { regex: /.{8,}/, text: 'At least 8 characters' },
        { regex: /[A-Z]/, text: 'At least one uppercase letter' },
        { regex: /[a-z]/, text: 'At least one lowercase letter' },
        { regex: /[0-9]/, text: 'At least one number' },
        { regex: /[^a-zA-Z0-9]/, text: 'At least one symbol (e.g., ! @ # $)' },
    ]

    const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

    const canProceed = () => {
        switch (step) {
            case 1: return true
            case 2: return role !== ''
            case 3: return formData.name.trim().length >= 2 && formData.username.trim().length >= 3 && usernameAvailable === true
            case 4: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
            case 5: return formData.country !== '' && formData.device !== ''
            case 6: return true // referral optional
            case 7: return requirements.every(r => r.regex.test(password))
            case 8: return formData.meme !== null
            default: return false
        }
    }

    const next = () => {
        if (!canProceed()) {
            const msgs = {
                2: 'Please select your role to continue.',
                3: usernameAvailable === false ? 'Username is taken! Choose another.' : 'Please fill in your name and a valid username.',
                4: 'Please enter a valid email address.',
                5: 'Please select your country and device.',
                7: 'Password does not meet all requirements.',
                8: 'Please upload a meme to complete registration.',
            }
            if (msgs[step]) addToast('error', msgs[step])
            return
        }
        if (step < TOTAL_STEPS) setStep(s => s + 1)
    }

    const prev = () => { if (step > 1) setStep(s => s - 1) }

    const handleFinalSubmit = async () => {
        if (!canProceed()) {
            addToast('error', 'Please upload a meme to complete registration.')
            return
        }
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('name', formData.name)
            fd.append('username', formData.username)
            fd.append('email', formData.email)
            fd.append('country', formData.country)
            fd.append('device', formData.device)
            fd.append('password', formData.password)
            fd.append('role', role)
            if (formData.referralCode) fd.append('referredByUsername', formData.referralCode)
            if (formData.meme) fd.append('meme', formData.meme)

            await registerUser(fd)
            addToast('success', 'Account created! 🎉 Please verify your email.')
            localStorage.removeItem('referredByUsername')
            navigate('/dashboard')
        } catch (error) {
            addToast('error', error.message || 'Registration failed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    }

    const [direction, setDirection] = useState(1)

    const goNext = () => { setDirection(1); next() }
    const goPrev = () => { setDirection(-1); prev() }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <SEO
                title="Join Timeline Earn – Register"
                description="Create your account on Timeline Earn. Post memes, earn Memoney, complete tasks, and grow your income."
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    background: 'rgba(255,255,255,0.96)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                    overflow: 'hidden',
                }}
            >
                {/* Progress header */}
                <div style={{ padding: '28px 32px 0', borderBottom: '1px solid #f3f4f6' }}>
                    {/* Step info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Step {step} of {TOTAL_STEPS}
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f1419', marginTop: '2px' }}>
                                {STEPS[step - 1].icon} {STEPS[step - 1].title}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>
                                {STEPS[step - 1].subtitle}
                            </div>
                        </div>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 900, color: '#fff',
                            flexShrink: 0,
                        }}>
                            {step}/{TOTAL_STEPS}
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '10px', marginBottom: '0', overflow: 'hidden' }}>
                        <motion.div
                            animate={{ width: `${progressPct}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '10px' }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div style={{ padding: '28px 32px', minHeight: '340px', position: 'relative', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {/* ───── STEP 1: Welcome + Social ───── */}
                            {step === 1 && (
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                        <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 8px', background: 'linear-gradient(135deg,#667eea,#764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            Register Your Account
                                        </h1>
                                        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Post memes, earn Memoney &amp; complete tasks.</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <a
                                            href="https://timelineplus.site/api/auth/google?role=freelancer"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                                padding: '14px', borderRadius: '12px', border: '1.5px solid #e5e7eb',
                                                background: '#fff', color: '#374151', fontWeight: 700, fontSize: '0.95rem',
                                                textDecoration: 'none', transition: 'box-shadow 0.2s',
                                            }}
                                        >
                                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '22px', height: '22px' }} />
                                            Continue with Google
                                        </a>

                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                                        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Or create manually</span>
                                        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                                    </div>
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                                        Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: 700 }}>Login</Link>
                                    </p>
                                </div>
                            )}

                            {/* ───── STEP 2: Role ───── */}
                            {step === 2 && (
                                <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {[
                                            { key: 'freelancer', label: 'Freelancer', desc: 'Complete tasks, post memes & earn money.', emoji: '💼', color: '#667eea' },
                                            { key: 'buyer', label: 'Buyer', desc: 'Promote your brand with real social actions.', emoji: '📢', color: '#f59e0b' },
                                        ].map(r => (
                                            <div
                                                key={r.key}
                                                onClick={() => setRole(r.key)}
                                                style={{
                                                    padding: '20px 16px', borderRadius: '16px', cursor: 'pointer',
                                                    border: `2px solid ${role === r.key ? r.color : '#e5e7eb'}`,
                                                    background: role === r.key ? `${r.color}12` : '#fafafa',
                                                    textAlign: 'center', transition: 'all 0.25s',
                                                    boxShadow: role === r.key ? `0 4px 16px ${r.color}30` : 'none',
                                                    transform: role === r.key ? 'scale(1.02)' : 'scale(1)',
                                                }}
                                            >
                                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{r.emoji}</div>
                                                <div style={{ fontWeight: 800, fontSize: '1rem', color: role === r.key ? r.color : '#374151' }}>{r.label}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '6px', lineHeight: 1.4 }}>{r.desc}</div>
                                                {role === r.key && (
                                                    <div style={{ marginTop: '10px', width: '24px', height: '24px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px auto 0' }}>
                                                        <FiCheck color="white" size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ───── STEP 3: Name & Username ───── */}
                            {step === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                            <input
                                                value={formData.name}
                                                onChange={e => set('name', e.target.value)}
                                                className="glass-input"
                                                style={{ paddingLeft: '42px', width: '100%' }}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Username</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: 700 }}>@</span>
                                            <input
                                                value={formData.username}
                                                onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                className="glass-input"
                                                style={{
                                                    paddingLeft: '32px', paddingRight: '42px', width: '100%',
                                                    borderColor: usernameAvailable === false ? '#ef4444' : usernameAvailable === true ? '#10b981' : '',
                                                }}
                                                placeholder="memegod99"
                                            />
                                            {formData.username.length >= 3 && (
                                                <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                                                    {usernameChecking
                                                        ? <div style={{ width: 16, height: 16, border: '2px solid #ccc', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                        : usernameAvailable
                                                            ? <FiCheck color="#10b981" size={18} />
                                                            : <FiX color="#ef4444" size={18} />
                                                    }
                                                </div>
                                            )}
                                        </div>
                                        {formData.username.length >= 3 && !usernameChecking && (
                                            <p style={{ fontSize: '0.75rem', marginTop: '5px', color: usernameAvailable ? '#10b981' : '#ef4444' }}>
                                                {usernameAvailable ? '✓ Username is available!' : '✗ Username is taken. Try another.'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ───── STEP 4: Email ───── */}
                            {step === 4 && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => set('email', e.target.value)}
                                            className="glass-input"
                                            style={{ paddingLeft: '42px', width: '100%' }}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '10px' }}>We'll send a verification email to activate your account.</p>
                                </div>
                            )}

                            {/* ───── STEP 5: Country & Device ───── */}
                            {step === 5 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                                            <FiGlobe style={{ verticalAlign: 'middle', marginRight: '6px' }} />Country
                                        </label>
                                        <select
                                            value={formData.country}
                                            onChange={e => set('country', e.target.value)}
                                            className="glass-input"
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.9)', color: '#374151' }}
                                        >
                                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                                            <FiSmartphone style={{ verticalAlign: 'middle', marginRight: '6px' }} />Device
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {[
                                                { value: 'desktop', label: 'Desktop', emoji: '🖥️' },
                                                { value: 'android', label: 'Android', emoji: '📱' },
                                                { value: 'iphone', label: 'iPhone', emoji: '🍎' },
                                            ].map(d => (
                                                <div
                                                    key={d.value}
                                                    onClick={() => set('device', d.value)}
                                                    style={{
                                                        padding: '14px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                                                        border: `2px solid ${formData.device === d.value ? '#667eea' : '#e5e7eb'}`,
                                                        background: formData.device === d.value ? '#667eea12' : '#fafafa',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <div style={{ fontSize: '1.8rem' }}>{d.emoji}</div>
                                                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: formData.device === d.value ? '#667eea' : '#374151', marginTop: '4px' }}>{d.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ───── STEP 6: Referral Code ───── */}
                            {step === 6 && (
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🎁</div>
                                        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>If a friend invited you, enter their username below. This is optional.</p>
                                    </div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Referral Code (Optional)</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiGift style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            value={formData.referralCode}
                                            onChange={e => set('referralCode', e.target.value)}
                                            className="glass-input"
                                            style={{ paddingLeft: '42px', width: '100%' }}
                                            placeholder="friend_username"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ───── STEP 7: Password ───── */}
                            {step === 7 && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Password</label>
                                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                                        <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={e => set('password', e.target.value)}
                                            className="glass-input"
                                            style={{ paddingLeft: '42px', width: '100%' }}
                                            placeholder="Strong password (e.g., Pass@123)"
                                        />
                                    </div>
                                    <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '14px', border: '1px solid #f3f4f6' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>Requirements:</p>
                                        {requirements.map((req, i) => {
                                            const ok = req.regex.test(password)
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: ok ? '#10b981' : '#9ca3af', marginBottom: '5px' }}>
                                                    {ok ? <FiCheck size={14} /> : <FiX size={14} />}
                                                    {req.text}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ───── STEP 8: Meme Checkpoint ───── */}
                            {step === 8 && (
                                <div>
                                    <div
                                        onClick={() => document.getElementById('memeInput').click()}
                                        style={{
                                            width: '100%', minHeight: '200px', border: '2px dashed #667eea',
                                            borderRadius: '16px', display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            background: memePreview ? '#000' : '#667eea08', overflow: 'hidden',
                                            marginBottom: '14px', transition: 'background 0.2s',
                                        }}
                                    >
                                        {memePreview ? (
                                            <img src={memePreview} alt="Meme preview" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '12px' }} />
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                                <FiImage size={36} style={{ color: '#667eea', marginBottom: '10px' }} />
                                                <p style={{ fontWeight: 700, color: '#374151', margin: '0 0 4px' }}>Click to upload your meme</p>
                                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>PNG, JPG, or GIF • Max 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="memeInput"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={e => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                set('meme', file)
                                                setMemePreview(URL.createObjectURL(file))
                                            }
                                        }}
                                    />
                                    {memePreview && (
                                        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
                                            <FiCheck style={{ verticalAlign: 'middle', marginRight: '4px' }} />Meme uploaded – you're ready to join!
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div style={{ padding: '0 32px 28px', display: 'flex', gap: '12px' }}>
                    {step > 1 && (
                        <button
                            onClick={goPrev}
                            style={{
                                flex: '0 0 auto', padding: '14px 20px', borderRadius: '12px',
                                border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151',
                                cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.9rem',
                            }}
                        >
                            <FiArrowLeft size={16} /> Back
                        </button>
                    )}
                    {step < TOTAL_STEPS ? (
                        <button
                            onClick={goNext}
                            style={{
                                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff',
                                cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: '0 4px 16px #667eea40',
                            }}
                        >
                            Continue <FiArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleFinalSubmit}
                            disabled={submitting}
                            style={{
                                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                                background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer',
                                fontWeight: 800, fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: '0 4px 16px #10b98140',
                            }}
                        >
                            {submitting ? 'Creating Account...' : '🚀 Complete Registration'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
