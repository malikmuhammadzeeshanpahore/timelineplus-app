import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { FiYoutube, FiInstagram, FiFacebook, FiPlayCircle, FiGlobe, FiSmartphone, FiBriefcase, FiGift, FiExternalLink, FiDollarSign, FiMonitor, FiFilter } from 'react-icons/fi'
import { useToastStore } from '../context/useToastStore'
import { useAuthStore } from '../context/useAuthStore'
import TaskWindow from '../components/jobs/TaskWindow'
import TaskRunner from '../components/TaskRunner'
import FeedAd from '../components/common/FeedAd'

const COUNTRIES = [
    { code: '', label: 'All Countries' },
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

function detectDevice() {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) return 'iphone'
    if (/android/.test(ua)) return 'android'
    return 'desktop'
}

export default function Jobs() {
    const { addToast } = useToastStore()
    const { user } = useAuthStore()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTask, setActiveTask] = useState(null)
    const [cpaOffers, setCpaOffers] = useState([])
    const [cpaLoading, setCpaLoading] = useState(true)
    const [deviceFilter, setDeviceFilter] = useState(user?.device || detectDevice())
    const [countryFilter, setCountryFilter] = useState(user?.country || '')
    const [detectedCountry, setDetectedCountry] = useState('')
    const [checkingLead, setCheckingLead] = useState(null) // { title, intervalId, status, checks }

    const [memePostedToday, setMemePostedToday] = useState(true)
    const [adSlots, setAdSlots] = useState({ slot1: '', slot2: '', slot3: '' })

    useEffect(() => {
        if (user) {
            const lastPost = user.last_meme_post_date ? new Date(user.last_meme_post_date) : null
            const today = new Date()
            const isToday = lastPost &&
                lastPost.getDate() === today.getDate() &&
                lastPost.getMonth() === today.getMonth() &&
                lastPost.getFullYear() === today.getFullYear()

            setMemePostedToday(!!isToday)
        }

        fetchCampaigns()
        fetchCpaOffers()

        fetchCpaOffers()

        fetch('https://timelineplus.site/api/admin/config/feed-ad-code')
            .then(r => r.json())
            .then(d => { if (d) setAdSlots(d) })
            .catch(() => {})

        // Cleanup polling on unmount
        return () => {
            if (checkingLead?.intervalId) {
                clearInterval(checkingLead.intervalId)
            }
        }
    }, [])

    // Ensure we clear the old interval if state gets forcefully reset
    useEffect(() => {
        return () => {
            if (checkingLead?.intervalId) clearInterval(checkingLead.intervalId)
        }
    }, [checkingLead?.intervalId])

    // Re-fetch when filters change
    useEffect(() => {
        fetchCpaOffers()
    }, [deviceFilter, countryFilter])

    const fetchCpaOffers = async () => {
        try {
            setCpaLoading(true)
            const email = user?.email || ''
            const params = new URLSearchParams({ email, device: deviceFilter })
            if (countryFilter) params.set('country', countryFilter)
            const res = await fetch(`https://timelineplus.site/api/cpagrip/offers?${params.toString()}`)
            const data = await res.json()
            if (data.success && Array.isArray(data.offers)) {
                setCpaOffers(data.offers)
            }
            if (data.detectedCountry && !countryFilter && !detectedCountry) {
                setDetectedCountry(data.detectedCountry)
            }
        } catch (err) {
            console.error('Failed to fetch CPA offers', err)
        } finally {
            setCpaLoading(false)
        }
    }

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('https://timelineplus.site/api/campaigns')
            const data = await res.json()
            setTasks(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch campaigns', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStartTask = async (campaignId, title, reward) => {
        if (!user) return addToast('error', 'Please login first')

        const isProfileComplete = user?.city && user?.gender && user?.phone && user?.social_link && user?.country && user?.device;
        if (!isProfileComplete) {
            addToast('error', 'Profile incomplete! Please link your social accounts and fill all details first.');
            setTimeout(() => window.location.href = '/profile', 1500);
            return;
        }

        try {
            const res = await fetch('https://timelineplus.site/api/campaign/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, campaignId })
            })
            const data = await res.json()

            if (res.ok) {
                addToast('success', `Task Completed! Earned $\${reward}`)
                fetchCampaigns() // Refresh list
            } else {
                addToast('error', data.error || 'Failed to complete task')
            }
        } catch (e) {
            addToast('error', 'Network error')
        }
    }

    const handleCpaOfferClick = (offer, e) => {
        if (!user) {
            e.preventDefault();
            addToast('info', 'Login to reliably track offer completion and earn rewards.');
            return;
        }

        const isProfileComplete = user?.city && user?.gender && user?.phone && user?.social_link;
        if (!isProfileComplete) {
            e.preventDefault();
            addToast('error', 'Profile incomplete! Please link your social accounts and fill all details first.');
            setTimeout(() => window.location.href = '/profile', 1500);
            return;
        }

        // Clear existing interval if there's already one running
        if (checkingLead?.intervalId) {
            clearInterval(checkingLead.intervalId);
        }

        addToast('info', `Started tracking offer: ${offer.title}. Keep this page open.`);
        setCheckingLead({ title: offer.title, status: 'checking', checks: 0, intervalId: null });

        const checkInterval = setInterval(async () => {
            try {
                const params = new URLSearchParams();
                if (user?.email) params.set('email', user.email);

                const res = await fetch(`https://timelineplus.site/api/cpagrip/check_lead?${params.toString()}`);
                const data = await res.json();

                if (data.lead_found) {
                    clearInterval(checkInterval);
                    setCheckingLead({ title: offer.title, status: 'success' });
                    addToast('success', `🎉 Offer Verified: "${offer.title}" completed! Reward added.`);
                    setTimeout(() => setCheckingLead(null), 8000);
                } else {
                    setCheckingLead(prev => {
                        if (!prev) return null;
                        const updatedChecks = (prev.checks || 0) + 1;
                        // Stop automatically checking after ~10 minutes (20 checks * 30s)
                        if (updatedChecks > 20) {
                            clearInterval(checkInterval);
                            addToast('info', `Stopped auto-checking "${offer.title}". It may take longer for the network to verify.`);
                            return null;
                        }
                        return { ...prev, checks: updatedChecks };
                    });
                }
            } catch (err) {
                console.error("Lead check failed", err);
            }
        }, 30000); // 30 seconds interval as recommended by CPAGrip

        setCheckingLead(prev => ({ ...prev, intervalId: checkInterval }));
    };

    const getIcon = (title) => {
        if (title.toLowerCase().includes('youtube')) return <FiYoutube />
        if (title.toLowerCase().includes('instagram')) return <FiInstagram />
        if (title.toLowerCase().includes('facebook')) return <FiFacebook />
        if (title.toLowerCase().includes('tiktok')) return <FiSmartphone />
        return <FiGlobe />
    }

    const isWindowTask = (task) => {
        // Identify YouTube tasks for Task Window
        return (task.title.toLowerCase().includes('youtube') || (task.link && task.link.includes('youtu')));
    }

    return (
        <div style={{ padding: '80px 0 100px' }} className="container">
            <SEO
                title="Available Jobs - Earn per Task"
                description="Browse thousands of micro-jobs. Earn money by watching videos, liking posts, and following social media accounts on TimelinePlus."
                injectAd={true}
            />
            <Navbar />
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-gradient"
                style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' }}
            >
                Available Tasks <span className="badge primary" style={{ fontSize: '1rem', verticalAlign: 'middle', marginLeft: '10px' }}>{tasks.length} Active</span>
            </motion.h1>

            {!memePostedToday ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card text-center py-20"
                    style={{ maxWidth: '600px', margin: '40px auto', border: '3px dashed #667eea' }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒🖼️</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900 }} className="text-gradient">Meme Checkpoint!</h2>
                    <p className="text-muted mb-8" style={{ fontSize: '1.2rem' }}>
                        No Cap, you need to post at least <span className="text-primary font-bold">1 meme today</span> to unlock your tasks.
                        Proof you're not a bot and keep the vibes alive!
                    </p>
                    <Link to="/memes">
                        <button className="glass-btn primary" style={{ padding: '15px 40px', borderRadius: '50px', fontSize: '1.1rem' }}>
                            Go to Meme Feed to Post & Earn 💸
                        </button>
                    </Link>
                    <p className="mt-4 text-xs text-gray-400">P.S. You earn 20 Memoney just for posting! Win-Win. 🚀</p>
                </motion.div>
            ) : loading ? (
                <div className="text-center text-gray-500">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <FiBriefcase className="mx-auto text-4xl mb-4 opacity-50" />
                    <p>No active tasks available right now.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                    {tasks.map((task, i) => (
                        <React.Fragment key={task.id}>
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card"
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: 'rgba(255, 108, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.8rem', color: '#ff6c0c'
                                    }}>
                                        {getIcon(task.title)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{task.title}</h3>
                                        <span className="badge warning" style={{ fontSize: '0.7rem' }}>Active</span>
                                    </div>
                                </div>
                                <div className="badge success" style={{ fontSize: '1rem', padding: '8px 16px' }}>
                                    {task.title.toLowerCase().includes('watchtime') ? (
                                        "$" + (task.reward_per_task / 60).toFixed(4) + " / min"
                                    ) : (
                                        "$" + task.reward_per_task
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 600 }}>Task Description</h4>
                                <p className="text-muted" style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {task.description}
                                </p>
                                <div className="mt-3 text-xs font-bold text-primary">
                                    {task.title.toLowerCase().includes('watchtime') ? (
                                        `Watchtime: ${Math.floor((task.watched_duration || 0) / 60)} / ${Math.floor((task.target_duration || (task.total_tasks * 3600)) / 60)} Minutes Completed`
                                    ) : (
                                        `Progress: ${task.completed_count} / ${task.total_tasks}`
                                    )}
                                </div>
                            </div>

                            {/* Render Task Window Trigger or Standard Runner */}
                            {task.link && task.link.startsWith('/blog/') ? (() => {
                                const progress = localStorage.getItem(`blog_task_${task.id}_progress`);
                                const hasProgress = progress !== null && parseInt(progress) > 0 && parseInt(progress) < 300;
                                return (
                                    <a
                                        href={`${task.link}?offer_id=${task.id}&utm_source=offer&user_id=${user?.id || ''}`}
                                        className="glass-btn secondary w-full"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', background: hasProgress ? '#f59e0b' : '', color: hasProgress ? '#fff' : '' }}
                                        onClick={(e) => {
                                            if (!user) {
                                                e.preventDefault();
                                                addToast('error', 'Please login to track this task');
                                            } else {
                                                const isProfileComplete = user?.city && user?.gender && user?.phone && user?.social_link && user?.country && user?.device;
                                                if (!isProfileComplete) {
                                                    e.preventDefault();
                                                    addToast('error', 'Profile incomplete! Please link your social accounts and fill all details first.');
                                                    setTimeout(() => window.location.href = '/profile', 1500);
                                                }
                                            }
                                        }}
                                    >
                                        {hasProgress ? <><FiClock /> Continue Task</> : <><FiExternalLink /> Read & Earn</>}
                                    </a>
                                );
                            })() : isWindowTask(task) ? (
                                <button
                                    onClick={() => setActiveTask(task)}
                                    className="glass-btn secondary w-full"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                >
                                    <FiPlayCircle /> Start Watch Task
                                </button>
                            ) : (
                                <TaskRunner
                                    task={task}
                                    onComplete={(id) => handleStartTask(id, task.title, task.reward_per_task)}
                                />
                            )}
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

            {activeTask && (
                <TaskWindow
                    task={activeTask}
                    onClose={() => setActiveTask(null)}
                    onComplete={() => {
                        setActiveTask(null);
                        fetchCampaigns();
                    }}
                />
            )}

            {/* ===== More Offers (CPA Grip) ===== */}
            <div style={{ marginTop: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '1.4rem'
                            }}>
                                <FiGift />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>More Offers</h2>
                                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>Complete offers to earn extra rewards</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', padding: '5px 15px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
                                <FiMonitor size={14} color="var(--text-muted)" />
                                <select
                                    value={deviceFilter}
                                    onChange={(e) => setDeviceFilter(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="all">All Devices</option>
                                    <option value="desktop">Desktop</option>
                                    <option value="android">Android</option>
                                    <option value="iphone">iPhone</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', padding: '5px 15px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
                                <FiGlobe size={14} color="var(--text-muted)" />
                                <select
                                    value={countryFilter || detectedCountry}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', maxWidth: '150px' }}
                                >
                                    {COUNTRIES.map(c => (
                                        <option key={c.code} value={c.code}>{c.label}</option>
                                    ))}
                                    {/* Default fallback if detected country not in list */}
                                    {detectedCountry && !COUNTRIES.find(c => c.code === detectedCountry) && (
                                        <option value={detectedCountry}>Auto Detected ({detectedCountry})</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {checkingLead && checkingLead.status === 'checking' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="glass-card mb-6"
                            style={{ padding: '15px 20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '15px' }}
                        >
                            <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>Verifying Offer: {checkingLead.title}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>We are checking with the offer wall. This can take a few minutes...</p>
                            </div>
                            <button
                                onClick={() => { if (checkingLead.intervalId) clearInterval(checkingLead.intervalId); setCheckingLead(null); }}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                Stop Checking
                            </button>
                        </motion.div>
                    )}

                    {cpaLoading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="glass-card" style={{ padding: '20px', animation: 'pulse 1.5s ease-in-out infinite' }}>
                                    <div style={{ height: '140px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', borderRadius: '12px', marginBottom: '15px' }} />
                                    <div style={{ height: '18px', background: '#f3f4f6', borderRadius: '8px', width: '80%', marginBottom: '10px' }} />
                                    <div style={{ height: '14px', background: '#f3f4f6', borderRadius: '8px', width: '60%' }} />
                                </div>
                            ))}
                        </div>
                    ) : cpaOffers.length === 0 ? (
                        <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}>
                            <FiGift style={{ fontSize: '3rem', color: '#d1d5db', marginBottom: '15px' }} />
                            <p style={{ color: '#9ca3af', fontWeight: '600', fontSize: '1.1rem' }}>No extra offers available for your region right now.</p>
                            <p style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Check back later for new opportunities!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {cpaOffers.map((offer, i) => (
                                <React.Fragment key={i}>
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="glass-card"
                                    style={{
                                        display: 'flex', flexDirection: 'column', gap: '0',
                                        padding: '0', overflow: 'hidden', borderRadius: '16px',
                                        border: '1px solid rgba(102, 126, 234, 0.15)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.15)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    {/* Offer Image */}
                                    {offer.offerphoto && (
                                        <div style={{
                                            width: '100%', height: '160px',
                                            background: `url(${offer.offerphoto}) center/cover no-repeat`,
                                            backgroundColor: '#f3f4f6',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: '12px', right: '12px',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: '#fff', padding: '6px 14px', borderRadius: '20px',
                                                fontSize: '0.85rem', fontWeight: 700,
                                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                                                display: 'flex', alignItems: 'center', gap: '5px'
                                            }}>
                                                <FiDollarSign size={14} />
                                                ${offer.payout.toFixed(2)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '1.05rem', fontWeight: 700, margin: 0,
                                            lineHeight: '1.4', color: '#1f2937'
                                        }}>
                                            {offer.title}
                                        </h3>

                                        {offer.description && (
                                            <p style={{
                                                fontSize: '0.85rem', color: '#6b7280', margin: 0,
                                                lineHeight: '1.5',
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            }}>
                                                {offer.description}
                                            </p>
                                        )}

                                        {!offer.offerphoto && (
                                            <div style={{
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: '#fff', padding: '6px 14px', borderRadius: '20px',
                                                fontSize: '0.85rem', fontWeight: 700, width: 'fit-content',
                                                display: 'flex', alignItems: 'center', gap: '5px'
                                            }}>
                                                <FiDollarSign size={14} />
                                                ${offer.payout.toFixed(2)}
                                            </div>
                                        )}

                                        <a
                                            href={offer.offerlink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleCpaOfferClick(offer, e)}
                                            style={{
                                                marginTop: 'auto',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '12px 20px', borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                                                textDecoration: 'none', border: 'none', cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            Complete Offer <FiExternalLink size={16} />
                                        </a>
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
                </motion.div>
            </div >
        </div >
    )
}
