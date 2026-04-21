import Navbar from '../components/common/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/common/SEO'
import { 
    FiArrowUpRight, FiArrowDownLeft, FiClock, FiPlus, FiMinus, FiSend, FiZap, 
    FiCheckCircle, FiAlertCircle, FiUsers, FiUser, FiLink, FiShield, FiInfo
} from 'react-icons/fi'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const PKR_PER_USD = 278
const MEMONEY_PER_PKR = 5000 / 15 // 5000 Memoney = 15 PKR
const MEMONEY_PER_USD = PKR_PER_USD * MEMONEY_PER_PKR

export default function Wallet() {
    const { user, updateBalance, login } = useAuthStore()
    const { addToast } = useToastStore()
    const [activeTab, setActiveTab] = useState('withdraw')
    const [showReferralPopup, setShowReferralPopup] = useState(false)
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

    // P2P Transfer state
    const [transferTo, setTransferTo] = useState('')
    const [transferAmount, setTransferAmount] = useState('')
    const [transferring, setTransferring] = useState(false)

    const watchAmount = watch('amount', 0)

    useEffect(() => {
        if (user?.email && user?.password) {
            login(user.email, user.password).catch(() => { })
        }
    }, [])

    const isProfileComplete = user?.city && user?.gender && user?.phone && user?.social_link && user?.country && user?.device
    const canDeposit = user?.role === 'buyer' || user?.role === 'freelancer'

    const onDepositSubmit = async (data) => {
        const amount = parseFloat(data.amount)
        const formData = new FormData()
        formData.append('userId', user.id)
        formData.append('amount', amount)
        formData.append('method', data.method)
        formData.append('senderAccount', data.account)
        formData.append('tid', data.tid)
        formData.append('screenshot', data.screenshot[0])

        try {
            const res = await fetch('https://timelineplus.site/api/wallet/deposit', { method: 'POST', body: formData })
            const result = await res.json()
            if (res.ok) { addToast('success', result.message); reset(); window.location.reload() }
            else addToast('error', result.error || 'Deposit failed')
        } catch { addToast('error', 'Network error') }
    }

    const onWithdrawSubmit = async (data) => {
        const amount = parseFloat(data.amount)
        try {
            const res = await fetch('https://timelineplus.site/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, amount, method: data.method, account: data.account })
            })
            const result = await res.json()
            if (res.ok) { addToast('success', result.message); reset(); window.location.reload() }
            else addToast('error', result.error)
        } catch { addToast('error', 'Request failed') }
    }

    const handleTransfer = async () => {
        if (!transferTo || !transferAmount) return addToast('error', 'Fill in receiver username and amount')
        const amt = parseInt(transferAmount)
        if (amt < 5000) return addToast('error', 'Minimum transfer is 5,000 Memoney')
        if (amt > (user?.memoney_balance || 0)) return addToast('error', 'Insufficient Memoney balance')
        setTransferring(true)
        try {
            const res = await fetch('https://timelineplus.site/api/memoney/transfer', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: user.id, receiverUsername: transferTo, amount: amt })
            })
            const data = await res.json()
            if (res.ok) { addToast('success', data.message); setTransferTo(''); setTransferAmount('') }
            else addToast('error', data.error || 'Transfer failed')
        } catch { addToast('error', 'Network error') }
        setTransferring(false)
    }

    // Withdrawal eligibility checks
    const eligibilityChecks = [
        { 
            label: 'Profile Complete', 
            done: isProfileComplete, 
            detail: 'Fill all fields in your Profile page'
        },
        { 
            label: 'Social Account Linked', 
            done: !!user?.social_link, 
            detail: 'Add your Instagram/Facebook link in Profile'
        },
        { 
            label: '7 Days Active', 
            done: user?.created_at ? (Date.now() - new Date(user.created_at).getTime()) / (1000*60*60*24) >= 7 : false, 
            detail: 'Login daily for 7 days (anti-spam protection)'
        },
        { 
            label: '3 Qualified Referrals', 
            done: (user?.active_referrals || 0) >= 3, 
            detail: 'Invite 3 friends who complete their profiles',
            count: user?.active_referrals || 0
        },
    ]
    const allEligible = eligibilityChecks.every(c => c.done)
    const isFirstWithdrawal = !user?.has_withdrawn
    const accountCreated = user?.created_at ? new Date(user.created_at) : new Date(0)
    const daysSinceCreation = (Date.now() - accountCreated.getTime()) / (1000*60*60*24)
    
    let minWithdrawalUSD = 750 / PKR_PER_USD
    let maxWithdrawalUSD = 999999
    let withdrawPlaceholder = "Min 750 PKR ≈ $2.70"
    let tierText = "Standard: Minimum 750 PKR"

    if (isFirstWithdrawal) {
        minWithdrawalUSD = 500 / PKR_PER_USD
        maxWithdrawalUSD = 500 / PKR_PER_USD
        withdrawPlaceholder = "Exactly 500 PKR ≈ $1.80"
        tierText = "First Withdrawal: Exactly 500 PKR"
    }

    return (
        <div style={{ padding: '100px 20px 120px' }} className="container">
            <SEO title="Wallet — TimelinePlus" description="Manage your wallet, deposit funds, and request withdrawals." />
            <Navbar />

            {/* Balance Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: 'linear-gradient(135deg, #111111, #1a0a00)', 
                    border: '1px solid rgba(255,102,0,0.2)',
                    boxShadow: '0 20px 40px rgba(255,102,0,0.15)',
                    borderRadius: 28, 
                    padding: '40px 30px', 
                    textAlign: 'center', 
                    marginBottom: 32, 
                    color: '#fff', 
                    position: 'relative', 
                    overflow: 'hidden' 
                }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'radial-gradient(ellipse at top, rgba(255,102,0,0.2), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255,102,0,0.1)', padding: '6px 14px', borderRadius: 50, border: '1px solid rgba(255,102,0,0.2)', marginBottom: 16 }}>
                        <p style={{ color: '#ff9500', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>AVAILABLE EARNINGS</p>
                    </div>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(3rem, 8vw, 4.5rem)', 
                        fontWeight: 900, 
                        lineHeight: 1,
                        marginBottom: 16, 
                        color: '#fff',
                        textShadow: '0 4px 20px rgba(255,255,255,0.2)',
                        WebkitTextFillColor: '#fff', 
                        background: 'none'
                    }}>${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 30, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontSize: '1rem' }}>🪙</span>
                            <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>{Math.round((user?.balance || 0) * MEMONEY_PER_USD).toLocaleString()} <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Memoney</span></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontSize: '1rem' }}>🇵🇰</span>
                            <span style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: 700 }}>PKR {((user?.balance || 0) * PKR_PER_USD).toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {canDeposit && (
                            <button 
                                onClick={() => setActiveTab('deposit')}
                                style={{ 
                                    padding: '14px 28px', 
                                    borderRadius: 16, 
                                    border: activeTab === 'deposit' ? 'none' : '1px solid rgba(255,102,0,0.3)', 
                                    background: activeTab === 'deposit' ? 'linear-gradient(135deg, #ff6600, #ff9500)' : 'rgba(255,102,0,0.05)', 
                                    color: activeTab === 'deposit' ? '#fff' : '#ff9500', 
                                    fontWeight: 800, 
                                    fontSize: '0.9rem',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 8,
                                    cursor: 'pointer',
                                    boxShadow: activeTab === 'deposit' ? '0 8px 25px rgba(255,102,0,0.4)' : 'none',
                                    transition: 'all 0.2s'
                                }}>
                                <FiPlus size={18} /> Add Funds
                            </button>
                        )}
                        <button 
                            onClick={() => setActiveTab('withdraw')}
                            style={{ 
                                padding: '14px 28px', 
                                borderRadius: 16, 
                                border: activeTab === 'withdraw' ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                                background: activeTab === 'withdraw' ? '#fff' : 'rgba(255,255,255,0.05)', 
                                color: activeTab === 'withdraw' ? '#000' : '#fff', 
                                fontWeight: 800, 
                                fontSize: '0.9rem',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 8,
                                cursor: 'pointer',
                                boxShadow: activeTab === 'withdraw' ? '0 8px 25px rgba(255,255,255,0.2)' : 'none',
                                transition: 'all 0.2s'
                            }}>
                            <FiMinus size={18} /> Withdraw
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Deposit / Withdraw Form */}
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="glass-card" style={{ maxWidth: 500, margin: '0 auto 36px' }}>

                    {activeTab === 'deposit' ? (
                        <>
                            <h2 className="heading" style={{ marginBottom: 20, textAlign: 'center' }}>
                                <FiArrowDownLeft /> Add Funds
                            </h2>
                            
                            {/* SadaPay Details */}
                            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 14, padding: '16px 18px', marginBottom: 20, border: '1px solid #bbf7d0' }}>
                                <p style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 800, marginBottom: 8, letterSpacing: 0.5 }}>SEND PAYMENT TO</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <FiUser size={14} color="#166534" />
                                    <span style={{ fontWeight: 700, color: '#15803d' }}>Muhammad Zeeshan</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <FiShield size={14} color="#166534" />
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#18181b', letterSpacing: 1 }}>+92 328 9633180</span>
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700, marginTop: 4 }}>
                                    <FiCheckCircle size={10} /> SadaPay
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: 8, margin: '8px 0 0', fontStyle: 'italic' }}>
                                    Min: 500 PKR | Attach payment screenshot below
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onDepositSubmit)} encType="multipart/form-data">
                                <div className="glass-input-group">
                                    <label>Sent From (Your Method)</label>
                                    <select className="glass-input" {...register("method", { required: true })}>
                                        <option value="sadapay">SadaPay</option>
                                        <option value="jazzcash">JazzCash</option>
                                        <option value="easypaisa">EasyPaisa</option>
                                        <option value="nayapay">NayaPay</option>
                                        <option value="bank">Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="glass-input-group">
                                    <label>Your Account Number</label>
                                    <input className="glass-input" placeholder="03XXXXXXXXX" {...register("account", { required: true })} />
                                </div>
                                <div className="glass-input-group">
                                    <label>Amount (PKR) — Min 500</label>
                                    <input type="number" className="glass-input" placeholder="500" {...register("amount", { required: true, min: 500 })} />
                                    {errors.amount && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Minimum deposit is 500 PKR</span>}
                                </div>
                                <div className="glass-input-group">
                                    <label>Transaction ID (TID)</label>
                                    <input className="glass-input" placeholder="e.g. 8374928374" {...register("tid", { required: true })} />
                                </div>
                                <div className="glass-input-group">
                                    <label>Payment Screenshot (Required)</label>
                                    <input type="file" accept="image/*" className="glass-input" {...register("screenshot", { required: true })} />
                                    {errors.screenshot && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Screenshot is required</span>}
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>
                                        Your deposit will be processed after admin verification. Memoney will be credited once approved.
                                    </p>
                                </div>
                                <button className="glass-btn w-full secondary" style={{ justifyContent: 'center', marginTop: 10 }}>
                                    <FiArrowDownLeft /> Submit Deposit Request
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="heading" style={{ marginBottom: 16, textAlign: 'center' }}>
                                <FiArrowUpRight /> Withdraw Funds
                            </h2>

                            {/* Eligibility Card */}
                            <div style={{ background: '#f8fafc', borderRadius: 14, padding: '16px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#374151', marginBottom: 12, letterSpacing: 0.5 }}>
                                    <FiShield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    WITHDRAWAL ELIGIBILITY
                                </p>
                                {eligibilityChecks.map((c, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                                        <div style={{ marginTop: 2, flexShrink: 0 }}>
                                            {c.done 
                                                ? <FiCheckCircle size={14} color="#10b981" /> 
                                                : <FiAlertCircle size={14} color="#f59e0b" />
                                            }
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: c.done ? '#10b981' : '#374151' }}>
                                                {c.label} {c.count !== undefined && !c.done && `(${c.count}/3)`}
                                            </span>
                                            {!c.done && <p style={{ fontSize: '0.74rem', color: '#9ca3af', margin: '1px 0 0' }}>{c.detail}</p>}
                                        </div>
                                    </div>
                                ))}
                                {isFirstWithdrawal && allEligible ? (
                                    <div style={{ background: '#eff6ff', borderRadius: 8, padding: '8px 10px', marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <FiInfo size={12} color="#3b82f6" style={{flexShrink:0}} />
                                        <span style={{ fontSize: '0.75rem', color: '#1e40af' }}>{tierText}</span>
                                    </div>
                                ) : (
                                    allEligible && (
                                        <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '8px 10px', marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <FiInfo size={12} color="#16a34a" style={{flexShrink:0}} />
                                            <span style={{ fontSize: '0.75rem', color: '#15803d' }}>{tierText} <br/>(Max 1 withdrawal per 7 days)</span>
                                        </div>
                                    )
                                )}
                            </div>

                            <form onSubmit={handleSubmit(onWithdrawSubmit)}>
                                <div className="glass-input-group">
                                    <label>Payment Method</label>
                                    <select className="glass-input" {...register("method", { required: true })}>
                                        <option value="jazzcash">JazzCash</option>
                                        <option value="easypaisa">EasyPaisa</option>
                                        <option value="sadapay">SadaPay</option>
                                        <option value="bank">Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="glass-input-group">
                                    <label>Account Number</label>
                                    <input className="glass-input" placeholder="03XXXXXXXXX" {...register("account", { required: true })} />
                                </div>
                                <div className="glass-input-group">
                                    <label>Amount (USD)</label>
                                    <input type="number" step="0.01" className="glass-input" placeholder={withdrawPlaceholder}
                                        {...register("amount", { required: true, min: minWithdrawalUSD - 0.01, max: maxWithdrawalUSD + 0.01 })} />
                                    {errors.amount && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Check amount limits for your tier</span>}
                                    {watchAmount > 0 && (
                                        <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 4 }}>
                                            Tax (10%): <span style={{ color: '#ef4444' }}>-${(watchAmount * 0.10).toFixed(2)}</span>
                                            {' '}| You Receive: <span style={{ color: '#10b981', fontWeight: 700 }}>${(watchAmount * 0.90).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    disabled={!allEligible}
                                    className="glass-btn w-full secondary" 
                                    style={{ justifyContent: 'center', marginTop: 10, opacity: allEligible ? 1 : 0.5, cursor: allEligible ? 'pointer' : 'not-allowed' }}>
                                    <FiArrowUpRight /> {allEligible ? 'Request Withdrawal' : 'Complete Requirements First'}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Shop: Packages */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #fff)', border: '1px solid #bbf7d0', padding: 24 }}>
                    <h3 style={{ fontWeight: 900, color: '#166534', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiZap color="#22c55e" /> Maximize Earning
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#166534', marginBottom: 16 }}>Upgrade from <strong>5 to 10 meme posts/day</strong> for lifetime.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#18181b' }}>100,000 Memoney</div>
                        <div style={{ fontSize: '0.78rem', color: '#16a34a', background: '#dcfce7', padding: '3px 10px', borderRadius: 50, fontWeight: 700 }}>≈ 500 PKR</div>
                    </div>
                    <button onClick={async () => {
                        if (!window.confirm("Buy Maximize Earning Package for 100,000 Memoney?")) return
                        const res = await fetch('https://timelineplus.site/api/profile/upgrade-post-limit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
                        const data = await res.json()
                        res.ok ? (addToast('success', data.message), window.location.reload()) : addToast('error', data.error)
                    }} disabled={user?.max_daily_posts >= 10}
                        style={{ width: '100%', padding: 11, background: user?.max_daily_posts >= 10 ? '#e5e7eb' : 'linear-gradient(135deg,#22c55e,#4ade80)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, cursor: user?.max_daily_posts >= 10 ? 'not-allowed' : 'pointer' }}>
                        {user?.max_daily_posts >= 10 ? 'Already Activated' : 'Buy Package'}
                    </button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="glass-card" style={{ background: 'linear-gradient(135deg, #eff6ff, #fff)', border: '1px solid #bfdbfe', padding: 24 }}>
                    <h3 style={{ fontWeight: 900, color: '#1e40af', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCheckCircle color="#3b82f6" /> Get Verified Badge
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#1e40af', marginBottom: 16 }}>Blue verified checkmark next to your name, forever.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#18181b' }}>1,000,000 Memoney</div>
                        <div style={{ fontSize: '0.78rem', color: '#2563eb', background: '#dbeafe', padding: '3px 10px', borderRadius: 50, fontWeight: 700 }}>≈ 5,000 PKR</div>
                    </div>
                    <button onClick={async () => {
                        if (!window.confirm("Buy Verified Badge for 1,000,000 Memoney?")) return
                        const res = await fetch('https://timelineplus.site/api/profile/buy-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
                        const data = await res.json()
                        res.ok ? (addToast('success', data.message), window.location.reload()) : addToast('error', data.error)
                    }} disabled={user?.profile_verified}
                        style={{ width: '100%', padding: 11, background: user?.profile_verified ? '#e5e7eb' : 'linear-gradient(135deg,#3b82f6,#60a5fa)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, cursor: user?.profile_verified ? 'not-allowed' : 'pointer' }}>
                        {user?.profile_verified ? 'Already Verified' : 'Verify My Profile'}
                    </button>
                </motion.div>
            </div>

            {/* Memoney P2P Transfer */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card" style={{ background: 'linear-gradient(135deg, #fff7ed, #fff)', border: '1px solid #fed7aa', borderRadius: 20, padding: 28, maxWidth: 500, margin: '0 auto 40px', boxShadow: '0 4px 20px rgba(255,102,0,0.08)' }}>
                <h3 style={{ fontWeight: 900, color: '#c2410c', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiZap color="#f97316" /> Send Memoney
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#9a3412', marginBottom: 20 }}>Send to any user via @username. Min 5,000 Memoney.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Receiver @Username</label>
                        <input value={transferTo} onChange={e => setTransferTo(e.target.value.replace('@', ''))} placeholder="e.g. zeeshansaeed"
                            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #fed7aa', borderRadius: 12, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Amount (min 5,000)</label>
                        <input type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} placeholder="5000" min={5000}
                            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #fed7aa', borderRadius: 12, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <span>Your Balance</span>
                        <span style={{ fontWeight: 700, color: '#f97316' }}>{(user?.memoney_balance || 0).toLocaleString()} Memoney</span>
                    </div>
                    <button onClick={handleTransfer} disabled={transferring}
                        style={{ padding: 13, background: transferring ? '#e5e7eb' : 'linear-gradient(135deg,#ff6600,#ff9500)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: transferring ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <FiSend size={16} /> {transferring ? 'Sending...' : 'Send Memoney'}
                    </button>
                </div>
            </motion.div>

            {/* Transaction History */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <h2 style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: 16, color: '#18181b' }}>Transaction History</h2>
                {(!user?.transactions || user.transactions.length === 0) ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                        No transactions yet. Deposit or earn from tasks to get started!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {user.transactions.map((tx) => (
                            <div key={tx.id} className="glass-card" style={{ padding: '14px 18px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: tx.color === 'red' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: tx.color === 'red' ? '#ef4444' : '#10b981'
                                    }}>
                                        {tx.type === 'Withdrawal' ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{tx.type}</div>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{tx.date}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: tx.color === 'red' ? '#ef4444' : '#10b981' }}>
                                        {tx.type === 'Withdrawal' ? '-' : '+'} ${tx.amount}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: tx.status === 'Pending' ? '#f59e0b' : tx.status === 'Approved' ? '#10b981' : '#ef4444' }}>{tx.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
