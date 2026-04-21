import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import {
    FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiActivity,
    FiUsers, FiDollarSign, FiGift, FiUserPlus, FiImage, FiSend, FiX,
    FiHeart, FiMessageCircle, FiShare2, FiEye, FiAward, FiZap, FiHash,
    FiThumbsDown, FiExternalLink, FiMoreVertical, FiTrash2, FiEdit2, FiAlertTriangle, FiEyeOff, FiUser, FiBell
} from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import PostTextFormatter from '../components/common/PostTextFormatter'
import VerifiedBadge from '../components/common/VerifiedBadge'
import FeedAd from '../components/common/FeedAd'

export default function Dashboard() {
    const { user, checkAuth } = useAuthStore()
    const { addToast } = useToastStore()

    // Meme feed state
    const [memes, setMemes] = useState([])
    const [memesLoading, setMemesLoading] = useState(true)
    const [caption, setCaption] = useState('')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [posting, setPosting] = useState(false)
    const fileRef = useRef()

    // Interaction states
    const [hiddenMemes, setHiddenMemes] = useState([])
    const [activeMenu, setActiveMenu] = useState(null)
    const [reportingMeme, setReportingMeme] = useState(null)
    const [reportReason, setReportReason] = useState([])
    const [reportDetails, setReportDetails] = useState('')
    const [editingMeme, setEditingMeme] = useState(null)
    const [editCaption, setEditCaption] = useState('')

    // Sidebar state
    const [trending, setTrending] = useState([])
    const [topLiked, setTopLiked] = useState([])
    const [topViewed, setTopViewed] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [showBonusPopup, setShowBonusPopup] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [pendingGift, setPendingGift] = useState(null)
    const [claimingGift, setClaimingGift] = useState(false)
    const [adSlots, setAdSlots] = useState({ slot1: '', slot2: '', slot3: '' })
    const [feedTab, setFeedTab] = useState('explore') // 'explore' or 'following'

    // Push Notification State
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscribing, setSubscribing] = useState(false)
    const [checkingSubscription, setCheckingSubscription] = useState(true)

    // Referral Bonus State
    const [referralBonus, setReferralBonus] = useState(null)
    const [showReferralPopup, setShowReferralPopup] = useState(false)
    const [claimingReferral, setClaimingReferral] = useState(false)

    useEffect(() => { checkAuth() }, [])

    useEffect(() => {
        fetch('https://timelineplus.site/api/admin/config/feed-ad-code')
            .then(r => r.json())
            .then(d => { if (d) setAdSlots(d) })
            .catch(() => {})
        // Check Registration Bonus Eligibility (Explicit Guard)
        if (user?.is_verified && user?.role === 'freelancer' && user?.welcome_bonus_claimed !== 1) {
            fetch(`https://timelineplus.site/api/auth/bonus-eligibility/${user.id}`)
                .then(r => r.json())
                .then(d => { 
                    if (d.eligible) setShowBonusPopup(true) 
                    else setShowBonusPopup(false)
                })
                .catch(() => {})
        } else {
            setShowBonusPopup(false)
        }
        if (user?.username) {
            fetch(`https://timelineplus.site/api/user/gifts/pending?username=${user.username}`)
                .then(r => r.json())
                .then(d => { if (d && d.length > 0) setPendingGift(d[0]) })
                .catch(() => {})
        }
        // Check Retroactive Referral Bonus
        if (user?.id) {
            fetch(`https://timelineplus.site/api/auth/pending-referral-bonus/${user.id}`)
                .then(r => r.json())
                .then(d => {
                    if (d.pending > 0) {
                        setReferralBonus(d)
                        setShowReferralPopup(true)
                    }
                })
                .catch(() => {})
        }
        fetchMemes()
        fetchSidebar()
    }, [user?.id, user?.username, feedTab])

    const fetchMemes = async () => {
        try {
            const res = await fetch(user ? `https://timelineplus.site/api/memes?userId=${user.id}&type=${feedTab}` : `https://timelineplus.site/api/memes?type=${feedTab}`)
            const data = await res.json()
            setMemes(Array.isArray(data) ? data : [])
        } catch { setMemes([]) }
        setMemesLoading(false)
    }

    // Check Push Status
    useEffect(() => {
        if ('serviceWorker' in navigator && Notification.permission !== 'denied') {
            checkSubscription()
        }
    }, [])

    const checkSubscription = async () => {
        setCheckingSubscription(true)
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                setIsSubscribed(true) // Treat as "done" if not supported to avoid blocking
                return
            }
            const registration = await navigator.serviceWorker.ready
            const sub = await registration.pushManager.getSubscription()
            if (sub) {
                const res = await fetch('https://timelineplus.site/api/notifications/status', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscription: sub })
                })
                const data = await res.json()
                setIsSubscribed(data.subscribed)
            } else {
                setIsSubscribed(false)
            }
        } catch (e) {
            console.error('Push check failed', e)
        } finally {
            setCheckingSubscription(false)
        }
    }

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const handleSubscribe = async () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isIOS && !isPWA) {
            return addToast('error', 'On iPhone/iPad, you MUST tap the Share button and then "Add to Home Screen" first for Notifications to work.')
        }

        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            return addToast('error', 'Push notifications are not supported by this browser. Please try Chrome or Firefox.')
        }
        
        // Check if denied
        if (Notification.permission === 'denied') {
            addToast('error', 'Notifications are blocked. Please click the Lock icon in your address bar and set Notifications to "Allow", then try again.')
            return
        }

        setSubscribing(true)
        try {
            // Explicitly request permission first
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
                setSubscribing(false)
                return addToast('error', 'Permission not granted. Please allow notifications in your browser.')
            }

            const registration = await navigator.serviceWorker.ready
            if (!registration.pushManager) {
                throw new Error('PushManager not available')
            }

            const vapidKeyRes = await fetch('https://timelineplus.site/api/notifications/vapid-key')
            const { publicKey } = await vapidKeyRes.json()

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            })

            const res = await fetch('https://timelineplus.site/api/notifications/subscribe', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, subscription })
            })

            if (res.ok) {
                setIsSubscribed(true)
                addToast('success', 'Successfully subscribed to real-time alerts!')
            } else {
                throw new Error('Server registration failed')
            }
        } catch (e) {
            console.error('Push error:', e)
            addToast('error', `Failed to subscribe: ${e.message}. Please click the lock icon and ensure notifications are enabled.`)
        } finally {
            setSubscribing(false)
        }
    }

    const fetchSidebar = async () => {
        try {
            const [tagRes, memeRes, lbRes] = await Promise.all([
                fetch('https://timelineplus.site/api/hashtags/trending'),
                fetch('https://timelineplus.site/api/memes?limit=50'),
                fetch('https://timelineplus.site/api/leaderboard'),
            ])
            const tags = await tagRes.json()
            const memeData = await memeRes.json()
            const lb = await lbRes.json()
            setTrending(Array.isArray(tags) ? tags.slice(0, 10) : [])
            if (Array.isArray(memeData)) {
                setTopLiked([...memeData].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0)).slice(0, 3))
                setTopViewed([...memeData].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3))
            }
            setLeaderboard(Array.isArray(lb) ? lb : [])
        } catch {}
    }

    const handleFileChange = (e) => {
        const f = e.target.files[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handlePost = async () => {
        if (!file) return addToast('error', 'Select an image for your meme!')
        setPosting(true)
        const fd = new FormData()
        fd.append('meme', file)
        fd.append('caption', caption)
        fd.append('userId', user.id)
        try {
            const res = await fetch('https://timelineplus.site/api/memes', { method: 'POST', body: fd })
            const data = await res.json()
            if (res.ok) {
                addToast('success', 'Meme posted! +20 Memoney earned')
                setCaption(''); setFile(null); setPreview(null)
                fetchMemes()
            } else {
                addToast('error', data.error || 'Upload failed')
            }
        } catch { addToast('error', 'Network error') }
        setPosting(false)
    }

    const handleInteract = async (memeId, type, extra = {}) => {
        if (!user) return addToast('error', 'Please login to interact!')
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${memeId}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, type, ...extra })
            })
            if (res.ok) {
                if (type === 'like' && !extra.silent) addToast('success', 'Liked! You earned Memoney.')
                fetchMemes()
            }
        } catch (err) { addToast('error', 'Interaction failed') }
    }

    const handleDislike = async (memeId) => {
        if (!user) return addToast('error', 'Please login to interact!')
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${memeId}/dislike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (res.ok) {
                addToast(data.disliked ? 'success' : 'info', data.message)
                fetchMemes()
            } else addToast('error', data.error || 'Failed to dislike')
        } catch (err) { addToast('error', 'Interaction failed') }
    }

    const getTodayStr = () => new Date().toISOString().split('T')[0];
    const [claimedToday, setClaimedToday] = useState(() => {
        const lastClaim = user?.last_login_claim_date ? user.last_login_claim_date.split('T')[0] : null;
        return lastClaim === getTodayStr();
    });

    // Sync claimedToday when user object updates (e.g. after checkAuth)
    useEffect(() => {
        if (user?.last_login_claim_date) {
            setClaimedToday(user.last_login_claim_date.split('T')[0] === getTodayStr());
        }
    }, [user?.last_login_claim_date]);

    const handleClaimDaily = async () => {
        if (!user || claimedToday || claiming) return; // hard gate
        setClaimedToday(true); // disable IMMEDIATELY before API call
        setClaiming(true);
        try {
            const res = await fetch('https://timelineplus.site/api/auth/claim-daily', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            const data = await res.json();
            if (res.ok) {
                addToast('success', data.message);
                checkAuth();
            } else {
                addToast('error', data.error || 'Failed to claim');
                setClaimedToday(false); // re-enable only on server-side error
            }
        } catch (e) {
            addToast('error', 'Network error');
            setClaimedToday(false);
        }
        setClaiming(false);
    };

    const shareMeme = (meme, platform) => {
        const url = `${window.location.origin}/meme/${meme.id}`
        const text = `Check out this meme on Timeline Earn: ${meme.caption}`
        if (platform === 'copy') {
            navigator.clipboard.writeText(url)
            addToast('success', 'Link copied to clipboard!')
            handleInteract(meme.id, 'share', { platform: 'copy', silent: true })
            return
        }
        let shareUrl = ''
        switch (platform) {
            case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
            case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        }
        if (shareUrl) {
            window.open(shareUrl, '_blank')
            handleInteract(meme.id, 'share', { platform })
        }
    }

    const handleHide = (id) => {
        setHiddenMemes(prev => [...prev, id])
        setActiveMenu(null)
        addToast('success', 'Post hidden from your feed')
    }

    const handleReport = (meme) => {
        setActiveMenu(null)
        if (!user) return addToast('error', 'Please login to report.')
        setReportingMeme(meme)
        setReportReason([])
        setReportDetails('')
    }
    
    const submitReport = async () => {
        if (reportReason.length === 0) return addToast('error', 'Please select at least one reason.')
        const finalReason = reportReason.join(', ') + (reportDetails ? ` - Default Details: ${reportDetails}` : '');
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${reportingMeme.id}/report`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, reason: finalReason })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', data.message)
                setReportingMeme(null)
                fetchMemes()
            } else addToast('error', data.error || 'Failed to report')
        } catch (err) { addToast('error', 'Network error') }
    }

    const handleEdit = (meme) => {
        setActiveMenu(null)
        setEditingMeme(meme)
        setEditCaption(meme.caption)
    }

    const submitEdit = async () => {
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${editingMeme.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, caption: editCaption })
            })
            if (res.ok) {
                addToast('success', 'Caption updated!')
                setEditingMeme(null)
                fetchMemes()
            } else addToast('error', 'Failed to edit')
        } catch (err) { addToast('error', 'Network error') }
    }

    const handleDelete = async (id) => {
        setActiveMenu(null)
        if (!window.confirm("Are you sure you want to delete your meme?")) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
            })
            if (res.ok) {
                addToast('success', 'Meme deleted successfully')
                fetchMemes()
            } else {
                const data = await res.json()
                addToast('error', data.error)
            }
        } catch (err) { addToast('error', 'Network error') }
    }

    const handleClaimBonus = async () => {
        setClaiming(true)
        try {
            const res = await fetch('https://timelineplus.site/api/auth/claim-bonus', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (res.ok) { 
                addToast('success', `Bonus Claimed: $${data.amount}`); 
                setShowBonusPopup(false); 
                // Immediate State Update
                useAuthStore.getState().updateUser({ 
                    welcome_bonus_claimed: 1, 
                    balance: (user.balance || 0) + data.amount 
                });
                checkAuth(); // Background Refresh
            }
            else addToast('error', data.error)
        } catch { addToast('error', 'Failed to claim bonus') }
        setClaiming(false)
    }

    const handleClaimGift = async () => {
        if (!pendingGift) return;
        setClaimingGift(true)
        try {
            const res = await fetch(`https://timelineplus.site/api/user/gifts/${pendingGift.id}/claim`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (res.ok) { addToast('success', `Awesome! ${data.amount} Memoney added to your balance.`); setPendingGift(null); checkAuth() }
            else addToast('error', data.error)
        } catch { addToast('error', 'Failed to claim gift') }
        setClaimingGift(false)
    }

    const handleClaimReferralBonus = async () => {
        setClaimingReferral(true)
        try {
            const res = await fetch('https://timelineplus.site/api/auth/claim-referral-bonus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', `Referral Bonus Claimed: ${data.amount.toLocaleString()} Memoney!`)
                setShowReferralPopup(false)
                checkAuth()
            } else {
                addToast('error', data.error)
            }
        } catch { addToast('error', 'Network error') }
        setClaimingReferral(false)
    }

    // Profile completion
    const profileFields = [
        { label: 'Avatar', done: !!user?.avatar },
        { label: 'Username', done: !!user?.username },
        { label: 'City', done: !!user?.city },
        { label: 'Gender', done: !!user?.gender },
        { label: 'Social Link', done: !!user?.social_link },
        { label: 'Payout Method', done: !!user?.payout_method },
    ]
    const completedCount = profileFields.filter(f => f.done).length
    const completionPct = Math.round((completedCount / profileFields.length) * 100)

    const rankColors = ['#f59e0b', '#94a3b8', '#b45309']
    const rankEmoji = ['1st', '2nd', '3rd']

    return (
        <div style={{ background: '#f0f2f5', minHeight: '100vh', paddingTop: '80px' }}>
            <SEO title="Dashboard - TimelinePlus" description="Your TimelinePlus dashboard." />
            <Navbar />

            <style>{`
                .dash-layout {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 24px 16px 100px;
                    display: grid;
                    grid-template-columns: 280px 1fr 280px;
                    gap: 20px;
                    align-items: start;
                }
                .dash-left, .dash-right {
                    position: sticky;
                    top: 90px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .dash-center { display: flex; flex-direction: column; gap: 16px; }
                .sidebar-card {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    padding: 18px;
                }
                .sidebar-card h4 {
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: #374151;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0 0 14px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }
                .meme-card-d {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    overflow: hidden;
                    margin-bottom: 2px;
                }
                .creator-box {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    padding: 16px;
                }
                .meme-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    border: none;
                    background: #f3f4f6;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .meme-action-btn:hover { background: #e5e7eb; }
                .meme-action-btn.liked { background: #fee2e2; color: #ef4444; }
                .lb-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid #f3f4f6;
                }
                .lb-row:last-child { border-bottom: none; }
                .progress-bar-bg {
                    height: 6px;
                    background: #f3f4f6;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 4px;
                }
                .progress-bar-fill {
                    height: 100%;
                    border-radius: 10px;
                    background: linear-gradient(90deg, #ff6600, #ff9500);
                    transition: width 0.4s;
                }
                @media (max-width: 1024px) {
                    .dash-layout { grid-template-columns: 1fr; }
                    .dash-left, .dash-right { position: static; display: grid; grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 600px) {
                    .dash-left, .dash-right { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* Bonus Popup */}
            <AnimatePresence>
                {showBonusPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 40 }}
                            style={{ background: '#fff', borderRadius: '24px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(255,102,0,0.25)' }}>
                            <div style={{ width: 70, height: 70, background: 'linear-gradient(135deg,#ff9900,#ff6600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 25px rgba(255,102,0,0.35)' }}>
                                <FiGift size={30} color="#fff" />
                            </div>
                            <h2 style={{ fontWeight: 900, marginBottom: 10 }}>Welcome Bonus!</h2>
                            <p style={{ color: '#6b7280', marginBottom: 28 }}>Thanks for verifying your account. Claim your <strong style={{ color: '#10b981' }}>$0.36 USD</strong> registration bonus!</p>
                            <button onClick={handleClaimBonus} disabled={claiming}
                                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#ff9900,#ff6600)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                                {claiming ? 'Claiming...' : 'Claim 100 PKR Bonus'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Memoney Gift Popup */}
            <AnimatePresence>
                {pendingGift && !showBonusPopup && !showReferralPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 40 }}
                            style={{ background: '#fff', borderRadius: '24px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(16,185,129,0.25)' }}>
                            <div style={{ width: 70, height: 70, background: 'linear-gradient(135deg,#34d399,#10b981)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 25px rgba(16,185,129,0.35)' }}>
                                <FiGift size={30} color="#fff" />
                            </div>
                            <h2 style={{ fontWeight: 900, marginBottom: 10 }}>Surprise Gift! 🎁</h2>
                            <p style={{ color: '#6b7280', marginBottom: 28 }}>Admin has sent you a special bonus of <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{pendingGift.amount.toLocaleString()} Memoney</strong>!</p>
                            <button onClick={handleClaimGift} disabled={claimingGift}
                                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#34d399,#10b981)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s', transform: claimingGift ? 'scale(0.98)' : 'scale(1)' }}>
                                {claimingGift ? 'Claiming...' : 'Claim Memoney Now'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Retroactive Referral Bonus Popup */}
            <AnimatePresence>
                {showReferralPopup && !showBonusPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.8, y: 40, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.8, y: 40 }}
                            style={{ background: '#fff', borderRadius: '32px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 30px 70px rgba(16,185,129,0.3)', position: 'relative', overflow: 'hidden' }}>
                            
                            {/* Decorative background circle */}
                            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(16,185,129,0.05)', borderRadius: '50%' }} />
                            
                            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '24px', rotate: '12deg', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 30px rgba(16,185,129,0.4)' }}>
                                <FiUsers size={36} color="#fff" style={{ rotate: '-12deg' }} />
                            </div>
                            
                            <h2 style={{ fontWeight: 900, fontSize: '1.75rem', marginBottom: 12, color: '#111827' }}>Referral Bonus!</h2>
                            <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>
                                You have <strong style={{ color: '#10b981' }}>{referralBonus?.pending}</strong> new successful invites! 
                                Your total reward is:
                                <br />
                                <strong style={{ fontSize: '1.5rem', color: '#059669' }}>{referralBonus?.totalReward?.toLocaleString()} Memoney</strong>
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <button onClick={handleClaimReferralBonus} disabled={claimingReferral}
                                    style={{ 
                                        width: '100%', padding: '16px', 
                                        background: 'linear-gradient(135deg,#10b981,#059669)', 
                                        border: 'none', borderRadius: '16px', 
                                        color: '#fff', fontWeight: 800, fontSize: '1.1rem', 
                                        cursor: 'pointer', boxShadow: '0 10px 25px rgba(16,185,129,0.25)',
                                        transition: 'all 0.2s'
                                    }}>
                                    {claimingReferral ? 'Processing...' : 'Claim My Bonus'}
                                </button>
                                <button onClick={() => setShowReferralPopup(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                                    Maybe Later
                                </button>
                            </div>

                            {/* Confetti mini-decoration */}
                            <div style={{ position: 'absolute', bottom: 20, left: 20, fontSize: '1.2rem' }}>🎉</div>
                            <div style={{ position: 'absolute', top: 20, right: 30, fontSize: '1.2rem' }}>💰</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reporting Modal */}
            <AnimatePresence>
                {reportingMeme && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 20 }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} style={{ background: '#fff', borderRadius: 24, padding: 30, width: '100%', maxWidth: 500, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <button onClick={() => setReportingMeme(null)} style={{ position: 'absolute', top: 20, right: 20, background: '#f3f4f6', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                                <FiX size={18} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 20, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiAlertTriangle /> Report Post
                            </h2>
                            <p style={{ marginBottom: 15, fontWeight: 600, color: '#374151' }}>Why are you reporting this post?</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                                {['Spam', 'Sexual Content', 'Harassment', 'Hate Speech', 'Scam / Fraud'].map(reason => (
                                    <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.95rem' }}>
                                        <input type="checkbox" checked={reportReason.includes(reason)} onChange={(e) => {
                                            if (e.target.checked) setReportReason([...reportReason, reason])
                                            else setReportReason(reportReason.filter(r => r !== reason))
                                        }} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                                        {reason}
                                    </label>
                                ))}
                            </div>
                            <textarea placeholder="Additional details (optional)..." value={reportDetails} onChange={e => setReportDetails(e.target.value)} style={{ width: '100%', height: 80, padding: 12, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb', resize: 'none', marginBottom: 20, fontFamily: 'inherit' }}></textarea>
                            <button onClick={submitReport} style={{ width: '100%', padding: 14, borderRadius: 12, fontSize: '1rem', fontWeight: 700, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                Submit Report
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editing Modal */}
            <AnimatePresence>
                {editingMeme && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 20 }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} style={{ background: '#fff', borderRadius: 24, padding: 30, width: '100%', maxWidth: 500, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                            <button onClick={() => setEditingMeme(null)} style={{ position: 'absolute', top: 20, right: 20, background: '#f3f4f6', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                                <FiX size={18} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 20, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiEdit2 /> Edit Caption
                            </h2>
                            <textarea placeholder="Write a new caption..." value={editCaption} onChange={e => setEditCaption(e.target.value)} style={{ width: '100%', height: 120, padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb', resize: 'none', marginBottom: 20, fontFamily: 'inherit', fontSize: '1.05rem' }}></textarea>
                            <button onClick={submitEdit} style={{ width: '100%', padding: 14, borderRadius: 12, fontSize: '1rem', fontWeight: 700, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                Save Changes
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="dash-layout">
                {/* ─── LEFT SIDEBAR ─── */}
                <div className="dash-left">
                    {/* Profile Card */}
                    <div className="sidebar-card" style={{ textAlign: 'center', padding: '24px' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6', margin: '0 auto 12px', border: '3px solid #ff6600' }}>
                            {user?.avatar
                                ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#9ca3af' }}>👤</div>
                            }
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#18181b' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 14 }}>@{user?.username || 'not set'}</div>

                        <div style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151' }}>Profile Strength</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: completionPct === 100 ? '#10b981' : '#ff6600' }}>{completionPct}%</span>
                            </div>
                            <div style={{ height: 8, background: '#f3f4f6', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPct}%` }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #ff9500, #ff6600)', borderRadius: 10 }} 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', marginBottom: 16 }}>
                            {profileFields.map(f => (
                                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: f.done ? '#10b981' : '#9ca3af', fontWeight: f.done ? 600 : 500 }}>
                                    {f.done ? <FiCheckCircle size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #d1d5db' }} />} 
                                    {f.label}
                                </div>
                            ))}
                        </div>

                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <button style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #ff6600, #ff9500)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,102,0,0.2)' }}>
                                Improve Profile
                            </button>
                        </Link>
                    </div>

                    {/* Daily Streak Card */}
                    <div className="sidebar-card" style={{ background: '#fff', border: '1px solid #eff3f4' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ background: 'rgba(245,158,11,0.1)', padding: 8, borderRadius: 8, color: '#f59e0b' }}><FiActivity size={18} /></div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#374151', fontWeight: 800 }}>Daily Login</h4>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Streak: {user?.current_streak || 0} Days</span>
                            </div>
                        </div>
                        {(() => {
                            const today = new Date().toISOString().split('T')[0];
                            const lastClaim = user?.last_login_claim_date ? user.last_login_claim_date.split('T')[0] : null;
                            const claimedToday = lastClaim === today;
                            return (
                                <button 
                                    onClick={claimedToday ? undefined : handleClaimDaily}
                                    disabled={claimedToday || claiming}
                                    style={{
                                        width: '100%', padding: '10px',
                                        background: claimedToday ? '#d1fae5' : '#f59e0b',
                                        border: claimedToday ? '1px solid #10b981' : 'none',
                                        borderRadius: '10px',
                                        color: claimedToday ? '#065f46' : '#fff',
                                        fontWeight: 700, fontSize: '0.82rem',
                                        cursor: (claimedToday || claiming) ? 'default' : 'pointer',
                                        opacity: claimedToday ? 0.85 : 1
                                    }}
                                >
                                    {claiming ? 'Claiming...' : claimedToday ? '✓ Claimed Today' : 'Claim 100 Memoney'}
                                </button>
                            );
                        })()}
                    </div>

                    {/* Push Subscription Card (Required) */}
                    <div className="sidebar-card" style={{ 
                        background: isSubscribed ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', 
                        border: `1px solid ${isSubscribed ? '#10b981' : '#ef4444'}` 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ background: isSubscribed ? '#10b981' : '#ef4444', padding: 8, borderRadius: 8, color: '#fff' }}>
                                <FiBell size={18} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#374151', fontWeight: 800 }}>Push Alerts</h4>
                                <span style={{ fontSize: '0.75rem', color: isSubscribed ? '#059669' : '#ef4444' }}>
                                    {isSubscribed ? 'Subscription Active' : 'Action Required'}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 12px', lineHeight: 1.4 }}>
                            {isSubscribed 
                                ? 'You are receiving real-time alerts when new memes are posted!' 
                                : 'Subscribe to receive instant updates on your device whenever new memes arrive.'}
                        </p>
                        {!isSubscribed ? (
                            <button 
                                onClick={handleSubscribe}
                                disabled={subscribing}
                                style={{
                                    width: '100%', padding: '10px',
                                    background: '#ef4444',
                                    borderRadius: '10px', color: '#fff',
                                    fontWeight: 700, fontSize: '0.82rem',
                                    cursor: subscribing ? 'default' : 'pointer'
                                }}
                            >
                                {subscribing ? 'Subscribing...' : 'Subscribe Now'}
                            </button>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                                <FiCheckCircle /> Verified Active
                            </div>
                        )}
                    </div>


                    {/* Memoney Balance */}
                    <div className="sidebar-card" style={{ background: 'linear-gradient(135deg, #ff9500, #ff6600)', color: '#fff' }}>
                        <h4 style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 8px' }}>MEMONEY BALANCE</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 900 }}>{(user?.memoney_balance || 0).toLocaleString()}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>≈ ${((user?.memoney_balance || 0) * 0.000018).toFixed(4)} USD</div>
                    </div>

                    {/* USD Balance */}
                    <div className="sidebar-card">
                        <h4 style={{ margin: '0 0 8px' }}><FiDollarSign /> USD Balance</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#18181b' }}>${user?.balance?.toFixed(2) || '0.00'}</div>
                        <Link to="/wallet">
                            <button style={{ marginTop: 10, width: '100%', padding: '8px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                                Wallet
                            </button>
                        </Link>
                    </div>

                    <FeedAd adHtml={adSlots.slot1} />
                </div>

                {/* ─── CENTER FEED ─── */}
                <div className="dash-center">
                    {/* Feed Tabs */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 20, padding: '4px 8px', borderBottom: '1px solid #eff3f4' }}>
                        {['explore', 'following'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFeedTab(tab)}
                                style={{
                                    background: 'none', border: 'none',
                                    padding: '12px 16px', cursor: 'pointer',
                                    fontSize: '1rem', fontWeight: 700,
                                    color: feedTab === tab ? '#18181b' : '#9ca3af',
                                    position: 'relative',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {tab}
                                {feedTab === tab && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#ff6600', borderRadius: 4 }} 
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Daily Post Status */}
                    {user?.role === 'freelancer' && (
                        <div style={{
                            padding: '12px 18px', borderRadius: '14px',
                            background: user?.last_meme_post_date && new Date(user.last_meme_post_date).toDateString() === new Date().toDateString()
                                ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                            color: user?.last_meme_post_date && new Date(user.last_meme_post_date).toDateString() === new Date().toDateString()
                                ? '#10b981' : '#ef4444',
                            fontWeight: 700, fontSize: '0.875rem',
                            display: 'flex', alignItems: 'center', gap: 8,
                            border: '1px solid currentColor'
                        }}>
                            {user?.last_meme_post_date && new Date(user.last_meme_post_date).toDateString() === new Date().toDateString()
                                ? <><FiCheckCircle /> Daily meme posted — up to 5 posts per day</>
                                : <><FiAlertCircle /> Daily meme not posted yet — post to earn Memoney!</>
                            }
                        </div>
                    )}

                    {/* Meme Creator (Facebook Style) */}
                    {user && (
                        <div className="creator-box" style={{ padding: '16px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eff3f4' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#f3f4f6', border: '1px solid #eee' }}>
                                    {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <FiUser style={{ margin: '11px auto', display: 'block', color: '#9ca3af' }} />}
                                </div>
                                <div 
                                    onClick={() => fileRef.current?.click()}
                                    style={{ flex: 1, background: '#f0f2f5', borderRadius: '25px', padding: '10px 18px', color: '#65676b', fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#e4e6e9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#f0f2f5'}
                                >
                                    What's on your mind, {user.name.split(' ')[0]}?
                                </div>
                            </div>
                            
                            {preview && (
                                <div style={{ position: 'relative', marginTop: 12, marginBottom: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
                                    <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', background: '#f8f9fa' }} />
                                    <button onClick={() => { setFile(null); setPreview(null) }}
                                        style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                        <FiX size={16} />
                                    </button>
                                </div>
                            )}

                            {preview && (
                                <textarea
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    placeholder="Add a caption to your meme..."
                                    style={{ width: '100%', border: '1px solid #eee', borderRadius: '12px', padding: '12px', outline: 'none', resize: 'none', fontSize: '0.95rem', color: '#18181b', background: '#fff', fontFamily: 'inherit', marginBottom: 12, boxSizing: 'border-box' }}
                                    rows={2}
                                />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f2f5', paddingTop: 12 }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button onClick={() => fileRef.current?.click()}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', background: 'transparent', borderRadius: '8px', color: '#65676b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f2f2f2'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <FiImage size={20} color="#45bd62" /> <span style={{ color: '#65676b' }}>Photo/video</span>
                                    </button>
                                    <button 
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', background: 'transparent', borderRadius: '8px', color: '#65676b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f2f2f2'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <FiZap size={20} color="#f7b928" /> <span style={{ color: '#65676b' }}>Feeling/activity</span>
                                    </button>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                
                                {preview && (
                                    <button onClick={handlePost} disabled={posting}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 24px', border: 'none', background: 'linear-gradient(135deg,#ff6600,#ff9500)', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,102,0,0.2)' }}>
                                        <FiSend size={16} /> {posting ? 'Posting...' : 'Post'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Meme Feed */}
                    {memesLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading memes...</div>
                    ) : memes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16, color: '#9ca3af' }}>
                            <FiImage size={40} style={{ marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                            No memes yet. Be the first to post!
                        </div>
                    ) : memes.filter(m => !hiddenMemes.includes(m.id)).map((meme, index) => (
                        <React.Fragment key={meme.id}>
                            <div className="meme-card-d">
                                {/* Author row */}
                            <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Link to={`/profile/${meme.author_username}`}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                                        {meme.author_avatar
                                            ? <img src={meme.author_avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '1.2rem' }}>👤</div>
                                        }
                                    </div>
                                </Link>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                        <Link to={`/profile/${meme.author_username}`} style={{ fontWeight: 700, fontSize: '0.9rem', color: '#18181b', textDecoration: 'none' }}>
                                            {meme.author_name || meme.author_username}
                                        </Link>
                                        {(meme.is_verified || meme.author_role === 'admin' || meme.author_is_super_admin) ? <VerifiedBadge size="1em" /> : null}
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>@{meme.author_username}</span>
                                        {user && user.id !== meme.user_id && (
                                            <button onClick={() => addToast('success', `Followed ${meme.author_username}`)} style={{ marginLeft: 6, fontSize: '0.75rem', padding: '3px 8px', borderRadius: 50, background: '#f3f4f6', border: 'none', color: '#18181b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <FiUserPlus size={11} /> Follow
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{new Date(meme.created_at).toLocaleDateString()}</div>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <button onClick={() => setActiveMenu(activeMenu === meme.id ? null : meme.id)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FiMoreVertical size={18} />
                                    </button>
                                    {activeMenu === meme.id && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: 150, zIndex: 10, border: '1px solid #e5e7eb' }}>
                                            <button onClick={() => handleHide(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: '0.9rem' }}>
                                                <FiEyeOff size={15} /> Hide for me
                                            </button>
                                            {user && user.id !== meme.user_id && (
                                                <button onClick={() => handleReport(meme)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem' }}>
                                                    <FiAlertTriangle size={15} /> Report
                                                </button>
                                            )}
                                            {user && user.id === meme.user_id && (
                                                <>
                                                    <button onClick={() => handleEdit(meme)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '0.9rem' }}>
                                                        <FiEdit2 size={15} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem' }}>
                                                        <FiTrash2 size={15} /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Caption */}
                            {meme.caption && (
                                <div style={{ padding: '0 16px 10px', fontSize: '0.9rem', lineHeight: 1.5, color: '#18181b' }}>
                                    <PostTextFormatter text={meme.caption} />
                                </div>
                            )}

                            {/* Image */}
                            <div style={{ width: '100%', position: 'relative', cursor: 'pointer' }} onDoubleClick={() => handleInteract(meme.id, 'like')}>
                                <img
                                    src={meme.image_url}
                                    alt="meme"
                                    style={{ width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block', background: '#000' }}
                                    loading="lazy"
                                />
                            </div>

                            {/* Actions */}
                            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <button onClick={() => handleInteract(meme.id, 'like')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: (meme.has_liked || meme.user_liked) ? '#ef4444' : '#000000', cursor: 'pointer', outline: 'none', padding: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                                        {(meme.has_liked || meme.user_liked) ? <FaHeart size={20} color="#ef4444" /> : <FiHeart size={20} />}
                                        {meme.likes_count || 0}
                                    </button>
                                    <button onClick={() => handleDislike(meme.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: meme.has_disliked ? '#f59e0b' : '#4b5563', cursor: 'pointer', outline: 'none', padding: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                                        <FiThumbsDown size={20} fill={meme.has_disliked ? 'currentColor' : 'none'} />
                                        {meme.dislikes_count || 0}
                                    </button>
                                    <Link to={`/meme/${meme.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer', outline: 'none', padding: 0, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                                        <FiMessageCircle size={20} />
                                        {meme.comments_count || 0}
                                    </Link>
                                    <button onClick={() => shareMeme(meme, 'copy')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer', outline: 'none', padding: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                                        <FiShare2 size={20} />
                                        {meme.shares_count || 0}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4b5563', fontWeight: 600, fontSize: '0.9rem' }}>
                                    <FiEye size={20} />
                                    {meme.views || 0}
                                </div>
                            </div>
                        </div>
                        {(index + 1) % 3 === 0 && (
                            <FeedAd 
                                adHtml={
                                    ((index + 1) / 3) % 3 === 1 ? adSlots.slot1 : 
                                    ((index + 1) / 3) % 3 === 2 ? adSlots.slot2 : adSlots.slot3
                                } 
                            />
                        )}
                        </React.Fragment>
                    ))}
                </div>

                {/* ─── RIGHT SIDEBAR ─── */}
                <div className="dash-right">
                    {/* Trending Hashtags */}
                    <div className="sidebar-card">
                        <h4><FiHash color="#f59e0b" /> Trending Hashtags</h4>
                        {trending.length === 0
                            ? <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>No trending tags yet</div>
                            : trending.map((t, i) => (
                                <div key={t.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < trending.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <Link to={`/explore?tag=${t.tag.replace('#', '')}`} style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem' }}>{t.tag}</Link>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>{t.usage_count}</span>
                                </div>
                            ))
                        }
                    </div>

                    {/* Top Liked & Viewed */}
                    <div className="sidebar-card">
                        <h4><FiHeart color="#ef4444" /> Most Liked</h4>
                        {topLiked.map(m => (
                            <Link key={m.id} to={`/meme/${m.id}`} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, textDecoration: 'none' }}>
                                <img src={m.image_url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#18181b' }}>@{m.author_username}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}><FiHeart size={11} /> {m.likes_count || 0} likes</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="sidebar-card">
                        <h4><FiEye color="#6366f1" /> Most Viewed</h4>
                        {topViewed.map(m => (
                            <Link key={m.id} to={`/meme/${m.id}`} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, textDecoration: 'none' }}>
                                <img src={m.image_url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#18181b' }}>@{m.author_username}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 700 }}><FiEye size={11} /> {m.views || 0} views</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Leaderboard */}
                    <div className="sidebar-card">
                        <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span><FiAward color="#f59e0b" /> Leaderboard</span>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Top 10</span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {leaderboard.length === 0
                                ? <div style={{ fontSize: '0.82rem', color: '#9ca3af', textAlign: 'center', padding: '10px' }}>No data yet</div>
                                : leaderboard.slice(0, 10).map((u, i) => (
                                    <div key={u.id} className="lb-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: '50%',
                                            background: i < 3 ? rankColors[i] : '#f3f4f6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.75rem', fontWeight: 900, color: i < 3 ? '#fff' : '#6b7280',
                                            flexShrink: 0
                                        }}>
                                            {i + 1}
                                        </div>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0, border: '1px solid #eee' }}>
                                            {u.avatar
                                                ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '1rem' }}>👤</div>
                                            }
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {u.username || u.name}
                                                {(u.profile_verified || u.role === 'admin') && <VerifiedBadge size="0.85rem" />}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#ff6600', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <FiZap size={11} /> {(u.memoney_balance || 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <Link to="/memes" style={{ textDecoration: 'none' }}>
                            <button style={{ marginTop: 16, width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', color: '#374151', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}>
                                View Full Rankings
                            </button>
                        </Link>
                    </div>

                    <FeedAd adHtml={adSlots.slot2} />
                </div>
            </div>
        </div>
    )
}
