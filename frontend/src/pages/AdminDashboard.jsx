import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiDollarSign, FiCheckCircle, FiTrash2, FiActivity, FiXCircle, FiTrendingUp, FiEye, FiBook, FiCpu, FiPlus, FiSave, FiEyeOff, FiAlertTriangle } from 'react-icons/fi'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import { Link } from 'react-router-dom'
import VisitorStats from '../components/admin/VisitorStats'

export default function AdminDashboard() {
    const { user } = useAuthStore()
    const { addToast } = useToastStore()
    const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'users' | 'transactions' | 'offers' | 'settings'

    const [users, setUsers] = useState([])
    const [transactions, setTransactions] = useState([])
    const [offers, setOffers] = useState([])
    const [memeReports, setMemeReports] = useState([])
    const [stats, setStats] = useState({
        adminProfit: 0,
        buyerHoldings: 0,
        freelancerHoldings: 0,
        totalWithdrawn: 0,
        visits: 0,
        total_users: 0,
        verified_users: 0
    })
    const [visitStats, setVisitStats] = useState(null)
    const [loadingStats, setLoadingStats] = useState(true)

    // Blog States
    const [blogs, setBlogs] = useState([])
    const [groqKey, setGroqKey] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [aiModel, setAiModel] = useState('groq') // 'groq' | 'gemini'
    const [blogDraft, setBlogDraft] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [reservedPatterns, setReservedPatterns] = useState([])
    const [newPattern, setNewPattern] = useState('')
    const [sendingBonus, setSendingBonus] = useState(false)
    const [globalAdCode, setGlobalAdCode] = useState('')
    const [isSavingAd, setIsSavingAd] = useState(false)
    const [feedAdSlots, setFeedAdSlots] = useState({ slot1: '', slot2: '', slot3: '' })
    const [isSavingFeedAd, setIsSavingFeedAd] = useState(false)
    const [extraHtml, setExtraHtml] = useState({ head: '', body: '' })
    const [isSavingExtra, setIsSavingExtra] = useState(false)


    // Fetch Data on Load
    useEffect(() => {
        const fetchSafe = (url, setter) => {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setter(data)
                    } else if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
                        // If it's a single object (like stats or a key), use it as is if setter handles it
                        // but for lists, we expect an array.
                        setter(data)
                    } else {
                        setter([])
                    }
                })
                .catch(err => {
                    console.error(`Fetch error for ${url}:`, err)
                    setter([])
                })
        }

        fetchSafe('https://timelineplus.site/api/admin/users', setUsers)
        fetchSafe('https://timelineplus.site/api/admin/transactions', setTransactions)
        fetchSafe('https://timelineplus.site/api/admin/offers', setOffers)
        fetchSafe('https://timelineplus.site/api/admin/blogs', setBlogs)
        fetchSafe('https://timelineplus.site/api/admin/meme-reports', setMemeReports)

        // Special handling for non-array stats
        fetch('https://timelineplus.site/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setStats(prev => ({ ...prev, ...data }))
            })
            .catch(err => console.error(err))

        fetch('https://timelineplus.site/api/admin/visit-stats')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setVisitStats(data)
                setLoadingStats(false)
            })
            .catch(err => {
                console.error(err)
                setLoadingStats(false)
            })

        fetch('https://timelineplus.site/api/admin/groq-key')
            .then(res => res.json())
            .then(data => { if (data?.key) setGroqKey(data.key) })
            .catch(err => console.error(err))

        fetch('https://timelineplus.site/api/admin/gemini-key')
            .then(res => res.json())
            .then(data => { if (data?.key) setGeminiKey(data.key) })
            .catch(err => console.error(err))

        fetch('https://timelineplus.site/api/admin/config/ad-code')
            .then(res => res.json())
            .then(data => { if (data?.code) setGlobalAdCode(data.code) })
            .catch(err => console.error(err))

        fetch('https://timelineplus.site/api/admin/config/feed-ad-code')
            .then(res => res.json())
            .then(data => { 
                if (data) setFeedAdSlots({ 
                    slot1: data.slot1 || '', 
                    slot2: data.slot2 || '', 
                    slot3: data.slot3 || '' 
                }) 
            })
            .catch(err => console.error(err))

        fetch('https://timelineplus.site/api/admin/config/extra-html')
            .then(res => res.json())
            .then(data => { if (data) setExtraHtml(data) })
            .catch(err => console.error(err))
    }, [])

    const handleDeleteUser = async (id) => {
        try {
            const res = await fetch(`https://timelineplus.site/api/admin/users/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id))
                addToast('success', 'User deleted successfully')
            } else {
                addToast('error', 'Failed to delete user')
            }
        } catch (err) {
            addToast('error', 'Server error')
        }
    }

    const handlePromoteUser = async (id) => {
        try {
            const res = await fetch(`https://timelineplus.site/api/admin/promote/${id}`, { method: 'POST' })
            const data = await res.json()
            if (data.error) {
                addToast('error', data.error)
            } else {
                addToast('success', 'User promoted to admin')
                const usersRes = await fetch('https://timelineplus.site/api/admin/users')
                setUsers(await usersRes.json())
            }
        } catch (err) {
            addToast('error', 'Failed to promote user')
        }
    }

    const handleDemoteUser = async (id) => {
        try {
            const res = await fetch(`https://timelineplus.site/api/admin/demote/${id}`, { method: 'POST' })
            const data = await res.json()
            if (data.error) {
                addToast('error', data.error)
            } else {
                addToast('success', 'Admin demoted to freelancer')
                const usersRes = await fetch('https://timelineplus.site/api/admin/users')
                setUsers(await usersRes.json())
            }
        } catch (err) {
            addToast('error', 'Failed to demote user')
        }
    }

    const handleSendBonus = async (e) => {
        e.preventDefault()
        const fd = new FormData(e.target)
        const username = fd.get('bonusUsername')
        const amount = fd.get('bonusAmount')
        
        setSendingBonus(true)
        try {
            const res = await fetch('https://timelineplus.site/api/admin/send-gift', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id, receiverUsername: username, amount })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', data.message)
                e.target.reset()
            } else {
                addToast('error', data.error)
            }
        } catch (err) {
            addToast('error', 'Failed to send bonus')
        }
        setSendingBonus(false)
    }

    const handleResetDatabase = async () => {
        if (!confirm('⚠️ WARNING: This will reset all balances and transactions! Users will NOT be deleted. Continue?')) return

        try {
            const res = await fetch('https://timelineplus.site/api/admin/reset-data', { method: 'POST' })
            const data = await res.json()
            addToast('success', data.message)
            setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
            addToast('error', 'Failed to reset database')
        }
    }

    const handleHardResetDatabase = async () => {
        if (!confirm('🔥 DANGER: This will delete ALL data including Super Admin balance! Are you SURE?')) return
        const doubleConfirm = prompt('Type "DELETE" to confirm hard reset:')
        if (doubleConfirm !== 'DELETE') return

        try {
            const res = await fetch('https://timelineplus.site/api/admin/hard-reset', { method: 'POST' })
            const data = await res.json()
            addToast('success', data.message)
            setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
            addToast('error', 'Failed to perform hard reset')
        }
    }

    const handleDeleteAllUsers = async () => {
        if (!confirm('⚠️ WARNING: This will delete ALL users except admins! Continue?')) return

        try {
            const res = await fetch('https://timelineplus.site/api/admin/delete-all-users', { method: 'POST' })
            const data = await res.json()
            addToast('success', data.message)
            const usersRes = await fetch('https://timelineplus.site/api/admin/users')
            setUsers(await usersRes.json())
        } catch (err) {
            addToast('error', 'Failed to delete users')
        }
    }

    const handleClearAllTasks = async () => {
        if (!confirm('⚠️ WARNING: This will delete ALL Tasks, Campaigns, and Completions! Continue?')) return
        const doubleConfirm = prompt('Type "CLEAR" to confirm deleting all tasks:')
        if (doubleConfirm !== 'CLEAR') return

        try {
            const res = await fetch('https://timelineplus.site/api/admin/clear-tasks', { method: 'POST' })
            const data = await res.json()
            addToast('success', data.message)
        } catch (err) {
            addToast('error', 'Failed to clear tasks')
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const currentPassword = formData.get('currentPassword')
        const newPassword = formData.get('newPassword')
        const confirmPassword = formData.get('confirmPassword')

        if (newPassword !== confirmPassword) {
            addToast('error', 'Passwords do not match')
            return
        }

        try {
            const res = await fetch('https://timelineplus.site/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id, currentPassword, newPassword })
            })
            const data = await res.json()
            if (data.error) {
                addToast('error', data.error)
            } else {
                addToast('success', data.message)
                e.target.reset()
            }
        } catch (err) {
            addToast('error', 'Failed to change password')
        }
    }

    const handleResetUserPassword = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const email = formData.get('userEmail')
        const newPassword = formData.get('newUserPassword')

        try {
            const res = await fetch('https://timelineplus.site/api/admin/reset-user-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            })
            const data = await res.json()
            if (data.error) {
                addToast('error', data.error)
            } else {
                addToast('success', data.message)
                e.target.reset()
            }
        } catch (err) {
            addToast('error', 'Failed to reset password')
        }
    }

    const handleApproveTx = async (id, type) => {
        try {
            const endpoint = type === 'Deposit' ? 'approve-deposit' : 'approve-withdrawal';
            const res = await fetch(`https://timelineplus.site/api/admin/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();

            if (res.ok) {
                setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
                addToast('success', data.message);
            } else {
                addToast('error', data.error);
            }
        } catch (err) {
            addToast('error', 'Failed to approve transaction');
        }
    }

    const handleRejectTx = async (id) => {
        if (!confirm('Are you sure you want to reject this transaction?')) return;
        try {
            const res = await fetch('https://timelineplus.site/api/admin/reject-deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();

            if (res.ok) {
                setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
                addToast('warning', 'Transaction Rejected');
            }
        } catch (err) {
            addToast('error', 'Failed to reject transaction');
        }
    }

    const handleNegotiate = async (userId, rate) => {
        const newRate = prompt("Enter Counter Offer Rate:", rate);
        if (!newRate) return;

        try {
            const res = await fetch('https://timelineplus.site/api/offers/negotiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rate: newRate, role: 'admin' })
            });
            if (res.ok) {
                addToast('success', 'Offer Countered');
                const offersRes = await fetch('https://timelineplus.site/api/admin/offers');
                setOffers(await offersRes.json());
            }
        } catch (e) { addToast('error', 'Failed'); }
    }

    const handleAcceptOffer = async (offerId) => {
        try {
            const res = await fetch('https://timelineplus.site/api/admin/offers/finalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerId })
            });

            const data = await res.json();

            if (res.ok) {
                addToast('success', 'Offer Finalized & Campaign Created!');
                const offersRes = await fetch('https://timelineplus.site/api/admin/offers');
                setOffers(await offersRes.json());
            } else {
                addToast('error', data.error || 'Failed to finalize offer');
            }
        } catch (e) { addToast('error', 'Failed'); }
    }

    // --- AI Blog Handlers ---
    const handleSaveGroqKey = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('https://timelineplus.site/api/admin/groq-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: groqKey })
            })
            if (res.ok) addToast('success', 'Groq API Key saved')
        } catch (e) { addToast('error', 'Failed to save key') }
    }

    const handleSaveGeminiKey = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('https://timelineplus.site/api/admin/gemini-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: geminiKey })
            })
            if (res.ok) addToast('success', 'Gemini API Key saved')
        } catch (e) { addToast('error', 'Failed to save key') }
    }

    const handleGenerateBlog = async (params) => {
        setIsGenerating(true)
        setBlogDraft(null)
        try {
            const res = await fetch('https://timelineplus.site/api/admin/blogs/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, modelType: aiModel })
            })
            const data = await res.json()
            if (data.error) {
                addToast('error', data.error)
            } else {
                setBlogDraft(data)
                addToast('success', 'Blog content generated!')
            }
        } catch (e) { addToast('error', 'Generation failed') }
        setIsGenerating(false)
    }

    const handleSaveBlog = async (draft, status = 'draft') => {
        try {
            const res = await fetch('https://timelineplus.site/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...draft, status })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', status === 'published' ? 'Blog published!' : 'Blog saved as draft')
                setBlogDraft(null)
                // Refresh list
                const blogsRes = await fetch('https://timelineplus.site/api/admin/blogs')
                setBlogs(await blogsRes.json())
            } else {
                addToast('error', data.error)
            }
        } catch (e) { addToast('error', 'Failed to save blog') }
    }

    const handleDeleteBlog = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return
        try {
            const res = await fetch(`https://timelineplus.site/api/admin/blogs/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setBlogs(blogs.filter(b => b.id !== id))
                addToast('success', 'Blog deleted')
            }
        } catch (e) { addToast('error', 'Failed to delete') }
    }

    const handleRestoreMeme = async (memeId) => {
        try {
            const res = await fetch(`https://timelineplus.site/api/admin/memes/${memeId}/restore`, { method: 'POST' })
            if (res.ok) {
                addToast('success', 'Meme restored')
                // Re-fetch
                const r = await fetch('https://timelineplus.site/api/admin/meme-reports')
                const data = await r.json()
                setMemeReports(Array.isArray(data) ? data : [])
            }
        } catch (e) { addToast('error', 'Failed to restore') }
    }

    const handlePermanentDeleteMeme = async (memeId, userId, reporterId) => {
        if (!confirm('This will permanently delete the meme and strike the user. Continue?')) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/admin/memes/${memeId}/permanent`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, reporterId })
            })
            if (res.ok) {
                addToast('success', 'Meme deleted and user penalized if necessary.')
                const r = await fetch('https://timelineplus.site/api/admin/meme-reports')
                const data = await r.json()
                setMemeReports(Array.isArray(data) ? data : [])
            } else {
                addToast('error', 'Failed to delete meme')
            }
        } catch (e) { addToast('error', 'Failed to delete meme') }
    }

    const handleSaveGlobalAdCode = async (e) => {
        e.preventDefault()
        setIsSavingAd(true)
        try {
            const res = await fetch('https://timelineplus.site/api/admin/config/ad-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: globalAdCode })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', data.message)
            } else {
                addToast('error', data.error)
            }
        } catch (err) {
            addToast('error', 'Failed to save Ad Code')
        }
        setIsSavingAd(false)
    }

    const handleSaveFeedAdCode = async (e) => {
        e.preventDefault()
        setIsSavingFeedAd(true)
        try {
            const res = await fetch('https://timelineplus.site/api/admin/config/feed-ad-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedAdSlots)
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', data.message)
            } else {
                addToast('error', data.error)
            }
        } catch (err) {
            addToast('error', 'Failed to save Feed Ad Code')
        }
        setIsSavingFeedAd(false)
    }

    const handleSaveExtraHtml = async (e) => {
        e.preventDefault()
        setIsSavingExtra(true)
        try {
            const res = await fetch('https://timelineplus.site/api/admin/config/extra-html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(extraHtml)
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', data.message)
            } else {
                addToast('error', data.error)
            }
        } catch (err) {
            addToast('error', 'Failed to save Extra HTML codes')
        }
        setIsSavingExtra(false)
    }

    const newCards = [
        { title: 'Total Visits', value: stats.visits, icon: <FiEye />, color: '#3b82f6' },
        { title: 'Total Users', value: stats.total_users, icon: <FiUsers />, color: '#8b5cf6' },
        { title: 'Verified Users', value: stats.verified_users, icon: <FiCheckCircle />, color: '#10b981' },
        { title: 'Freelancer Pool', value: `$\${stats.freelancerPool?.toLocaleString() || 0}`, icon: <FiDollarSign />, color: '#f59e0b' },
    ]


    return (
        <div style={{ padding: '100px 20px', minHeight: '100vh' }} className="container">
            <Navbar />

            <div style={{ marginBottom: '25px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0 }} className="text-main">Admin <span className="text-secondary">Panel</span></h1>
                    <p className="text-muted" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', margin: '5px 0 0 0' }}>Platform Control Center</p>
                </div>

                {/* New Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', width: '100%', marginBottom: '20px' }}>
                    {newCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card"
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}
                        >
                            <div style={{
                                width: '50px', height: '50px',
                                borderRadius: '50%',
                                background: `${card.color}20`,
                                color: card.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{card.title}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{card.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Financial & Activity Stats Grid */}
                <h3 className="heading mb-4" style={{ fontSize: '1.2rem', marginTop: '30px' }}><FiTrendingUp /> Financials & Activity</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', width: '100%', marginBottom: '30px' }}>

                    {/* Admin Profit Breakdown */}
                    <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Admin Profit (Total)</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>${(stats.adminProfit + stats.totalTaxRevenue).toLocaleString()}</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#888' }}>
                            <span>60% Share: <b>{stats.adminProfit?.toLocaleString()}</b></span><br />
                            <span>10% Tax: <b>{stats.totalTaxRevenue?.toLocaleString()}</b></span>
                        </div>
                    </div>

                    {/* Freelancer Stats */}
                    <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Freelancers</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Holdings</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${stats.freelancerHoldings?.toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Withdrawn</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>${stats.freelancerWithdrawn?.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Buyer Stats */}
                    <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Buyers</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Holdings</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${stats.buyerHoldings?.toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Withdrawn</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>${stats.buyerWithdrawn?.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Activity */}
                    <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Daily Activity (Today)</div>
                        <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.daily_tasks || 0}</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Tasks Done</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.active_today || 0}</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Active Workers</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '5px' }}>
                            Inactive: <b>{stats.inactive_today || 0}</b>
                        </div>
                    </div>

                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '30px' }}>
                    <Link to="/mail" className="glass-card hover-card" style={{ display: 'block', textAlign: 'center', color: 'inherit', textDecoration: 'none', border: '1px solid #ff6600' }}>
                        <h3 style={{ marginBottom: '10px', color: '#ff6600' }}>Admin Mailbox 📬</h3>
                        <p className="text-muted">Manage support tickets & send emails.</p>
                    </Link>
                    <Link to="/admin/support" className="glass-card hover-card" style={{ display: 'block', textAlign: 'center', color: 'inherit', textDecoration: 'none', border: '1px solid #10b981' }}>
                        <h3 style={{ marginBottom: '10px', color: '#10b981' }}>Live Support 💬</h3>
                        <p className="text-muted">Real-time chat with users & guests.</p>
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {['analytics', 'users', 'transactions', 'offers', 'blogs', 'moderation', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`glass-btn ${activeTab === tab ? 'secondary' : ''}`}
                            style={{ textTransform: 'capitalize', flex: '1 1 auto', minWidth: '100px', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {activeTab === 'analytics' && (
                            <VisitorStats stats={visitStats} loading={loadingStats} />
                        )}

                        {activeTab === 'users' && (
                            <div>
                                <div className="glass-card" style={{ marginBottom: '20px', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                                    <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🎁 Send Memoney Bonus
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '15px' }}>Gift a user directly to their Memoney balance. They will see a claim popup on their dashboard.</p>
                                    <form onSubmit={handleSendBonus} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <input name="bonusUsername" type="text" className="glass-input" placeholder="Exact Username" required style={{ flex: 1, minWidth: '200px' }} />
                                        <input name="bonusAmount" type="number" min="1" className="glass-input" placeholder="Memoney Amount" required style={{ width: '150px' }} />
                                        <button type="submit" className="glass-btn" style={{ background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold' }} disabled={sendingBonus}>
                                            {sendingBonus ? 'Sending...' : 'Send Bonus'}
                                        </button>
                                    </form>
                                </div>
                                <div className="glass-card">
                                    <h2 className="heading mb-4" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}><FiUsers /> User Management</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 8px', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Name</th>
                                                <th style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Role</th>
                                                <th style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Status</th>
                                                <th style={{ textAlign: 'right', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px 8px' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{u.name}</div>
                                                        <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', opacity: 0.6 }}>{u.email}</div>
                                                    </td>
                                                    <td><span className={`badge ${u.role === 'buyer' ? 'warning' : u.role === 'admin' ? 'primary' : 'success'}`} style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' }}>{u.role}</span></td>
                                                    <td style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{u.status}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                            {u.is_super_admin ? (
                                                                <span style={{ fontSize: '0.75rem', color: '#fbbf24', padding: '8px', fontWeight: 'bold' }}>Super Admin</span>
                                                            ) : (
                                                                <>
                                                                    {u.role === 'freelancer' && (
                                                                        <button onClick={() => handlePromoteUser(u.id)} style={{ color: '#10b981', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Promote</button>
                                                                    )}
                                                                    {u.role === 'admin' && (
                                                                        <button onClick={() => handleDemoteUser(u.id)} style={{ color: '#f59e0b', padding: '6px 10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Demote</button>
                                                                    )}
                                                                    <button onClick={() => handleDeleteUser(u.id)} style={{ color: '#ef4444', padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}><FiTrash2 /></button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'transactions' && (
                            <div className="glass-card">
                                <h2 className="heading mb-4"><FiDollarSign /> Deposit/Withdraw Requests</h2>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {transactions.length === 0 ? <p style={{ color: '#aaa' }}>No pending transactions.</p> : transactions.map(t => (
                                        <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: t.type === 'Deposit' ? '1px solid #10b981' : '1px solid #ef4444' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{t.user} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({t.role || 'User'})</span></div>
                                                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                                                        <span className={t.type === 'Withdrawal' ? 'text-secondary' : 'text-primary'}>{t.type}</span> of <b>${t.amount}</b>
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>{t.date}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    {t.status === 'Pending' ? <span className="badge warning">Pending</span> : <span className="badge success">{t.status}</span>}
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '5px', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                {t.type === 'Deposit' && (
                                                    <>
                                                        <div style={{ gridColumn: 'span 2' }}><b>Type:</b> Manual Deposit</div>
                                                        <div><b>TID:</b> {t.tid || 'N/A'}</div>
                                                        <div><b>Sender:</b> {t.sender_account || 'N/A'}</div>
                                                        <div>
                                                            <b>Proof:</b> {t.screenshot ? (
                                                                <a href={`${t.screenshot}`} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'underline', marginLeft: '5px' }}>View Screenshot</a>
                                                            ) : 'None'}
                                                        </div>
                                                    </>
                                                )}
                                                {t.type === 'Withdrawal' && (
                                                    <>
                                                        <div style={{ gridColumn: 'span 2' }}><b>Received In:</b> {t.sender_account || 'N/A'}</div>
                                                        <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', color: '#ef4444' }}>
                                                            * Ensure payment is sent before approving.
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {t.status === 'Pending' && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                                    <button onClick={() => handleApproveTx(t.id, t.type)} className="glass-btn secondary w-full" style={{ padding: '8px', fontSize: '0.9rem', justifyContent: 'center' }}><FiCheckCircle /> Approve</button>
                                                    <button onClick={() => handleRejectTx(t.id)} className="glass-btn w-full" style={{ padding: '8px', color: '#ef4444', borderColor: '#ef4444', fontSize: '0.9rem', justifyContent: 'center' }}><FiXCircle /> Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'offers' && (
                            <div className="glass-card">
                                <h2 className="heading mb-4"><FiActivity /> Negotiation Offers</h2>
                                {offers.length === 0 ? <p style={{ color: '#aaa' }}>No active negotiations.</p> : (
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        {offers.map(offer => (
                                            <div key={offer.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{offer.user_name || `User #${offer.user_id}`}</div>
                                                    <div style={{ color: '#aaa', marginBottom: '5px' }}>Current Rate: <span className="text-primary" style={{ fontWeight: 'bold' }}>${offer.current_rate}</span></div>
                                                    <div style={{ fontSize: '0.8rem' }}>Last Updated By: {offer.last_updated_by === 'admin' ? <span className="text-secondary">You</span> : 'User'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Status: {offer.status}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Created: {offer.created_at}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    {offer.status === 'pending' && offer.last_updated_by !== 'admin' && (
                                                        <>
                                                            <button onClick={() => handleNegotiate(offer.user_id, offer.current_rate)} className="glass-btn secondary">Counter</button>
                                                            <button onClick={() => handleAcceptOffer(offer.id)} className="glass-btn primary">Accept</button>
                                                        </>
                                                    )}
                                                    {offer.status === 'pending' && offer.last_updated_by === 'admin' && (
                                                        <span style={{ color: '#aaa', fontStyle: 'italic' }}>Waiting for User...</span>
                                                    )}
                                                    {offer.status === 'accepted' && (
                                                        <span className="badge success">Accepted</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'blogs' && (
                            <div className="glass-card">
                                <div className="glass-card" style={{ marginBottom: '30px', padding: '25px', border: '1px solid rgba(255,108,12,0.3)' }}>
                                    <h3 style={{ marginBottom: '20px', color: '#ff6c0c' }}><FiCpu /> Intelligent Blog Writer</h3>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const fd = new FormData(e.target);
                                        handleGenerateBlog({
                                            title: fd.get('title'),
                                            topic: fd.get('topic'),
                                            keywords: fd.get('keywords'),
                                            length: fd.get('length')
                                        });
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Blog Title (Optional)</label>
                                                <input name="title" type="text" className="glass-input w-full" placeholder="e.g. The Future of AI" />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Specific Topics (Optional)</label>
                                                <input name="topic" type="text" className="glass-input w-full" placeholder="e.g. Deep Learning, Ethics" />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Keywords (Optional)</label>
                                                <input name="keywords" type="text" className="glass-input w-full" placeholder="e.g. AI Trends 2024, Machine Learning" />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Article Length (Optional)</label>
                                                <select name="length" className="glass-input w-full">
                                                    <option value="2000+ words">Long Form (2000+ words)</option>
                                                    <option value="1500 words">Medium (1500 words)</option>
                                                    <option value="1000 words">Standard (1000 words)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '50px' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Model:</span>
                                                <label style={{ fontSize: '0.85rem', cursor: 'pointer', color: aiModel === 'groq' ? '#ff6c0c' : 'white' }}>
                                                    <input type="radio" value="groq" checked={aiModel === 'groq'} onChange={() => setAiModel('groq')} style={{ marginRight: '5px' }} /> Groq
                                                </label>
                                                <label style={{ fontSize: '0.85rem', cursor: 'pointer', color: aiModel === 'gemini' ? '#ff6c0c' : 'white' }}>
                                                    <input type="radio" value="gemini" checked={aiModel === 'gemini'} onChange={() => setAiModel('gemini')} style={{ marginRight: '5px' }} /> Gemini
                                                </label>
                                            </div>
                                            <button type="submit" className="glass-btn primary" disabled={isGenerating}>
                                                <FiCpu /> {isGenerating ? 'AI is Researhing & Writing...' : 'Write SEO Blog Now'}
                                            </button>
                                            <button type="button" onClick={() => setBlogDraft({ title: '', content: '', meta_title: '', meta_description: '', faqs: [], schema_org: {} })} className="glass-btn secondary"><FiPlus /> Manual Write</button>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>
                                            * Leaving all fields empty triggers AI to research a trending USA-focused AI topic (avoiding existing blogs).
                                        </p>
                                    </form>
                                </div>

                                {/* Groq Key Setup */}
                                {!groqKey && (
                                    <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid #ef4444', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#ef4444' }}><b>Notice:</b> Groq API Key is missing. AI generation will not work.</div>
                                        <button onClick={() => setActiveTab('settings')} className="glass-btn" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Set Key</button>
                                    </div>
                                )}

                                {/* Blog Draft / AI Preview */}
                                {blogDraft && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ border: '1px solid #ff6c0c', marginBottom: '30px', padding: '25px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <h3 style={{ margin: 0, color: '#ff6c0c' }}>AI Preview / Draft Editor</h3>
                                            <button onClick={() => setBlogDraft(null)} className="glass-btn text-xs">Cancel</button>
                                        </div>

                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <div className="glass-input-group">
                                                <label>Blog Title</label>
                                                <input type="text" value={blogDraft.title} onChange={e => setBlogDraft({ ...blogDraft, title: e.target.value })} className="glass-input" />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div className="glass-input-group">
                                                    <label>Meta Title</label>
                                                    <input type="text" value={blogDraft.meta_title} onChange={e => setBlogDraft({ ...blogDraft, meta_title: e.target.value })} className="glass-input" maxLength={60} />
                                                </div>
                                                <div className="glass-input-group">
                                                    <label>Meta Description</label>
                                                    <textarea value={blogDraft.meta_description} onChange={e => setBlogDraft({ ...blogDraft, meta_description: e.target.value })} className="glass-input" rows={1} maxLength={160} />
                                                </div>
                                            </div>

                                            <div className="glass-input-group">
                                                <label>Content (HTML/Rich Text)</label>
                                                <textarea value={blogDraft.content} onChange={e => setBlogDraft({ ...blogDraft, content: e.target.value })} className="glass-input" rows={10} style={{ fontFamily: 'monospace', fontSize: '0.9rem' }} />
                                            </div>

                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleSaveBlog(blogDraft, 'published')} className="glass-btn primary"><FiSave /> Publish Now</button>
                                                <button onClick={() => handleSaveBlog(blogDraft, 'draft')} className="glass-btn secondary">Save as Draft</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Blogs List */}
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 8px' }}>Title</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blogs.length === 0 ? (
                                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>No blogs found. Start writing!</td></tr>
                                            ) : blogs.map(b => (
                                                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px 8px' }}>
                                                        <div style={{ fontWeight: 'bold' }}>{b.title}</div>
                                                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>/{b.slug}</div>
                                                    </td>
                                                    <td><span className="badge secondary">{b.category}</span></td>
                                                    <td>
                                                        <span className={`badge ${b.status === 'published' ? 'success' : 'warning'}`}>{b.status}</span>
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem', opacity: 0.7 }}>{new Date(b.created_at).toLocaleDateString()}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => setBlogDraft(b)} className="glass-btn text-xs" style={{ padding: '5px 8px' }} title="Edit"><FiCpu /></button>
                                                            <button onClick={() => {
                                                                const newStatus = b.status === 'published' ? 'draft' : 'published';
                                                                handleSaveBlog(b, newStatus);
                                                            }} className="glass-btn text-xs" style={{ padding: '5px 8px' }} title={b.status === 'published' ? 'Unpublish' : 'Publish'}>
                                                                {b.status === 'published' ? <FiEyeOff /> : <FiEye />}
                                                            </button>
                                                            <button onClick={() => handleDeleteBlog(b.id)} style={{ color: '#ef4444' }}><FiTrash2 /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {activeTab === 'moderation' && (
                            <div className="glass-card">
                                <h2 className="heading mb-4" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}><FiAlertTriangle /> Meme Moderation</h2>
                                <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                                    Review reported memes. Restoring a meme brings it back to the feed. Deleting it permanently removes it and strikes the creator.
                                </p>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 8px' }}>Meme/Caption</th>
                                                <th>Reporter/Reason</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(!memeReports || memeReports.length === 0 || !Array.isArray(memeReports)) ? (
                                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>No reported memes.</td></tr>
                                            ) : memeReports.map(r => (
                                                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px 8px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {r.image_url && <img src={r.image_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />}
                                                            <div>
                                                                <div style={{ fontWeight: 'bold' }}>"{r.caption}"</div>
                                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>User ID: {r.user_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 'bold', color: '#f91880' }}>{r.reason}</div>
                                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Reporter ID: {r.reporter_id}</div>
                                                    </td>
                                                    <td><span className={`badge ${r.status === 'suspended' ? 'warning' : 'success'}`} style={{ textTransform: 'capitalize' }}>{r.status}</span></td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {r.status === 'suspended' ? (
                                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                                <button onClick={() => handleRestoreMeme(r.meme_id)} className="glass-btn secondary text-xs" style={{ padding: '6px 10px' }}>Restore</button>
                                                                <button onClick={() => handlePermanentDeleteMeme(r.meme_id, r.user_id, r.reporter_id)} className="glass-btn text-xs" style={{ padding: '6px 10px', color: '#ef4444', borderColor: '#ef4444' }}>Delete</button>
                                                            </div>
                                                        ) : (
                                                            <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>Resolved</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="glass-card">
                                <h2 className="heading mb-4" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}><FiActivity /> Admin Settings</h2>

                                <div style={{ display: 'grid', gap: '30px', maxWidth: '800px' }}>
                                    <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b981', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '1.1rem' }}>🔒 Change Your Password</h3>
                                        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '12px' }}>
                                            <div className="glass-input-group">
                                                <label>Current Password</label>
                                                <input type="password" name="currentPassword" className="glass-input" required />
                                            </div>
                                            <div className="glass-input-group">
                                                <label>New Password</label>
                                                <input type="password" name="newPassword" className="glass-input" required />
                                            </div>
                                            <div className="glass-input-group">
                                                <label>Confirm New Password</label>
                                                <input type="password" name="confirmPassword" className="glass-input" required />
                                            </div>
                                            <button type="submit" className="glass-btn secondary" style={{ marginTop: '10px' }}>
                                                Change Password
                                            </button>
                                        </form>
                                    </div>

                                    {/* GLOBAL AD CODE MANAGEMENT */}
                                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '1.1rem' }}>📢 Global Ad Code Management</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                            Paste your raw script tags here (e.g. HilltopAds, Quge5). This will be injected into all pages across the website naturally.
                                        </p>
                                        <form onSubmit={handleSaveGlobalAdCode} style={{ display: 'grid', gap: '12px' }}>
                                            <div className="glass-input-group">
                                                <label>Global Ad Script Node</label>
                                                <textarea 
                                                    value={globalAdCode}
                                                    onChange={e => setGlobalAdCode(e.target.value)}
                                                    className="glass-input" 
                                                    placeholder="<script src='...'></script>"
                                                    style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'monospace' }}
                                                />
                                            </div>
                                            <button type="submit" className="glass-btn primary" style={{ marginTop: '10px' }} disabled={isSavingAd}>
                                                {isSavingAd ? 'Saving & Applying...' : 'Save & Render Ad Globally'}
                                            </button>
                                        </form>
                                    </div>

                                    {/* LOCALIZED FEED AD CODE MANAGEMENT */}
                                    <div style={{ padding: '20px', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid #a855f7', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#a855f7', marginBottom: '15px', fontSize: '1.1rem' }}>📱 Localized Feed Ad Code</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                            Paste your raw script tags here. This ad will be dynamically injected into the Dashboard (sidebars + feed), Jobs, Tasks, and Blog pages after every 3 items.
                                        </p>
                                        <form onSubmit={handleSaveFeedAdCode} style={{ display: 'grid', gap: '20px' }}>
                                            <div className="glass-input-group">
                                                <label>Slot 1 (Sidebars & Feed Start)</label>
                                                <textarea 
                                                    value={feedAdSlots.slot1}
                                                    onChange={e => setFeedAdSlots({...feedAdSlots, slot1: e.target.value})}
                                                    className="glass-input" 
                                                    placeholder="Paste Script 1 here"
                                                    style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                                                />
                                            </div>
                                            <div className="glass-input-group">
                                                <label>Slot 2 (Sidebars & Feed Middle)</label>
                                                <textarea 
                                                    value={feedAdSlots.slot2}
                                                    onChange={e => setFeedAdSlots({...feedAdSlots, slot2: e.target.value})}
                                                    className="glass-input" 
                                                    placeholder="Paste Script 2 here"
                                                    style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                                                />
                                            </div>
                                            <div className="glass-input-group">
                                                <label>Slot 3 (Feed Continuous Cycle)</label>
                                                <textarea 
                                                    value={feedAdSlots.slot3}
                                                    onChange={e => setFeedAdSlots({...feedAdSlots, slot3: e.target.value})}
                                                    className="glass-input" 
                                                    placeholder="Paste Script 3 here"
                                                    style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                                                />
                                            </div>
                                            <button type="submit" className="glass-btn primary" style={{ marginTop: '10px' }} disabled={isSavingFeedAd}>
                                                {isSavingFeedAd ? 'Saving Slots...' : 'Save All 3 Ad Slots'}
                                            </button>
                                        </form>
                                    </div>

                                    {/* GLOBAL HEAD/BODY CODE MANAGEMENT */}
                                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '1.1rem' }}>🌐 Global Code Injection (Head & Body)</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                            Add tracking pixels, analytics scripts, or global styles.
                                        </p>
                                        <form onSubmit={handleSaveExtraHtml} style={{ display: 'grid', gap: '20px' }}>
                                            <div className="glass-input-group">
                                                <label>Before Header Code (Before &lt;/head&gt;)</label>
                                                <textarea 
                                                    value={extraHtml.head}
                                                    onChange={e => setExtraHtml({...extraHtml, head: e.target.value})}
                                                    className="glass-input" 
                                                    placeholder="<script>...</script>"
                                                    style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                                                />
                                            </div>
                                            <div className="glass-input-group">
                                                <label>Before Footer Code (Before &lt;/body&gt;)</label>
                                                <textarea 
                                                    value={extraHtml.body}
                                                    onChange={e => setExtraHtml({...extraHtml, body: e.target.value})}
                                                    className="glass-input" 
                                                    placeholder="<script>...</script>"
                                                    style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                                                />
                                            </div>
                                            <button type="submit" className="glass-btn primary" style={{ marginTop: '10px' }} disabled={isSavingExtra}>
                                                {isSavingExtra ? 'Saving & Applying...' : 'Save & Inject Globally'}
                                            </button>
                                        </form>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid #f59e0b', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#f59e0b', marginBottom: '15px', fontSize: '1.1rem' }}>🔑 Reset User Password</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                            Enter user email and new password to reset their password.
                                        </p>
                                        <form onSubmit={handleResetUserPassword} style={{ display: 'grid', gap: '12px' }}>
                                            <div className="glass-input-group">
                                                <label>User Email</label>
                                                <input type="email" name="userEmail" className="glass-input" placeholder="user@example.com" required />
                                            </div>
                                            <div className="glass-input-group">
                                                <label>New Password</label>
                                                <input type="password" name="newUserPassword" className="glass-input" required />
                                            </div>
                                            <button type="submit" className="glass-btn" style={{ marginTop: '10px', background: '#f59e0b' }}>
                                                Reset User Password
                                            </button>
                                        </form>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '1.1rem' }}>🤖 Groq AI Settings</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                            Enter your Groq Cloud API Key to enable AI Blog Generation. Get your key at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>console.groq.com</a>.
                                        </p>
                                        <form onSubmit={handleSaveGroqKey} style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="password"
                                                value={groqKey}
                                                onChange={e => setGroqKey(e.target.value)}
                                                className="glass-input"
                                                placeholder="gsk_..."
                                                required
                                            />
                                            <button type="submit" className="glass-btn primary" style={{ whiteSpace: 'nowrap' }}>Save Key</button>
                                        </form>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '1.1rem' }}>✨ Gemini AI Settings</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                            Enter your Google Gemini API Key. Get your key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>aistudio.google.com</a>.
                                        </p>
                                        <form onSubmit={handleSaveGeminiKey} style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="password"
                                                value={geminiKey}
                                                onChange={e => setGeminiKey(e.target.value)}
                                                className="glass-input"
                                                placeholder="AIza..."
                                                required
                                            />
                                            <button type="submit" className="glass-btn primary" style={{ whiteSpace: 'nowrap' }}>Save Key</button>
                                        </form>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '1.1rem' }}>📊 Clear Analytics</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>
                                            Reset all visitor statistics (Views, Unique, Returning). Platform financial stats are NOT affected.
                                        </p>
                                        <button
                                            onClick={async () => {
                                                if (!confirm('Are you sure you want to clear all analytics data?')) return;
                                                try {
                                                    const res = await fetch('https://timelineplus.site/api/admin/clear-analytics', { method: 'POST' });
                                                    if (res.ok) {
                                                        addToast('success', 'Analytics cleared!');
                                                        setTimeout(() => window.location.reload(), 1000);
                                                    }
                                                } catch (e) { addToast('error', 'Failed to clear'); }
                                            }}
                                            style={{
                                                background: '#3b82f6',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            Clear Analytics Data
                                        </button>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid #ef4444', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '1.1rem' }}>🗑️ Delete All Users</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>
                                            This will delete ALL users except admins. Use with caution!
                                        </p>
                                        <button
                                            onClick={handleDeleteAllUsers}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            Delete All Users (Except Admins)
                                        </button>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid #ef4444', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '1.1rem' }}>🧹 Clear All Tasks & Campaigns</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>
                                            This will permanently delete all created campaigns and task completion records. Use only when you want to start fresh with tasks.
                                        </p>
                                        <button
                                            onClick={handleClearAllTasks}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            Delete All Tasks
                                        </button>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '1.1rem' }}>⚠️ Reset Database</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>
                                            This will clear all user balances (including admin), transactions, and platform stats. Users will NOT be deleted.
                                        </p>
                                        <ul style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px', paddingLeft: '20px' }}>
                                            <li>All user balances → $0 (including admins, except Super Admin)</li>
                                            <li>All transactions → Deleted</li>
                                            <li>Platform stats → Reset to 0</li>
                                            <li>Users → Kept intact</li>
                                        </ul>
                                        <button
                                            onClick={handleResetDatabase}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            Reset Database (Standard)
                                        </button>
                                    </div>

                                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #7f1d1d', borderRadius: '8px' }}>
                                        <h3 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '1.1rem' }}>🔥 Hard Reset Database</h3>
                                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                                            DANGER: This will clear EVERYTHING including Super Admin balance and potential recovery logs. Use ONLY if strictly necessary.
                                        </p>
                                        <ul style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px', paddingLeft: '20px' }}>
                                            <li>All user balances → $0 (INCLUDING Super Admin)</li>
                                            <li>All transactions → Deleted</li>
                                            <li>Platform stats → Reset to 0</li>
                                        </ul>
                                        <button
                                            onClick={handleHardResetDatabase}
                                            style={{
                                                background: '#7f1d1d',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            Hard Reset (All Data)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
