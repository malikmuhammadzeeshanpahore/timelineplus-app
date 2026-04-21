import { useState, useEffect } from 'react'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiMessageCircle, FiShare2, FiPlus, FiSend, FiX, FiCheckCircle, FiMoreVertical, FiCopy, FiExternalLink, FiDollarSign, FiSmile, FiEye, FiEyeOff, FiAlertTriangle, FiTrash2, FiUserPlus, FiThumbsDown, FiEdit2, FiImage } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PostTextFormatter from '../components/common/PostTextFormatter'
import TrendingSidebar from '../components/TrendingSidebar'
import FeedAd from '../components/common/FeedAd'

export default function MemeFeed() {
    const { user } = useAuthStore()
    const { addToast } = useToastStore()
    const [memes, setMemes] = useState([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [uploadData, setUploadData] = useState({ caption: '', file: null })
    const [selectedMeme, setSelectedMeme] = useState(null)
    const [commentText, setCommentText] = useState('')
    
    // Moderation States
    const [hiddenMemes, setHiddenMemes] = useState([])
    const [activeMenu, setActiveMenu] = useState(null)
    const [reportingMeme, setReportingMeme] = useState(null)
    const [reportReason, setReportReason] = useState([])
    const [reportDetails, setReportDetails] = useState('')
    const [editingMeme, setEditingMeme] = useState(null)
    const [editCaption, setEditCaption] = useState('')
    const [sharingMeme, setSharingMeme] = useState(null)
    const [adSlots, setAdSlots] = useState({ slot1: '', slot2: '', slot3: '' })

    const executeShare = async (platform) => {
        if (!sharingMeme) return;
        const url = `${window.location.origin}/meme/${sharingMeme.id}`;
        let shareUrl = '';
        
        try { fetch(`https://timelineplus.site/api/memes/${sharingMeme.id}/share`, { method: 'POST' }).catch(e=>console.log(e)); } catch(e){}

        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            addToast('success', 'Link copied to clipboard!');
            setSharingMeme(null);
            setMemes(memes.map(m => m.id === sharingMeme.id ? { ...m, shares_count: m.shares_count + 1 } : m));
            return;
        }

        switch(platform) {
            case 'whatsapp': shareUrl = `https://wa.me/?text=Check out this meme: ${encodeURIComponent(url)}`; break;
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
            case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out this meme!`; break;
            case 'telegram': shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=Check out this meme!`; break;
            default: break;
        }
        
        if (shareUrl) window.open(shareUrl, '_blank');
        setSharingMeme(null);
        setMemes(memes.map(m => m.id === sharingMeme.id ? { ...m, shares_count: m.shares_count + 1 } : m));
    }

    const fetchMemes = async () => {
        try {
            const res = await fetch(user ? `https://timelineplus.site/api/memes?userId=${user.id}` : 'https://timelineplus.site/api/memes')
            const data = await res.json()
            setMemes(Array.isArray(data) ? data : [])
            setLoading(false)
        } catch (err) {
            console.error('Failed to fetch memes')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMemes()
        fetch('https://timelineplus.site/api/admin/config/feed-ad-code')
            .then(r => r.json())
            .then(d => { if (d) setAdSlots(d) })
            .catch(() => {})
    }, [])

    useEffect(() => {
        let sid = localStorage.getItem('meme_session_id')
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15)
            localStorage.setItem('meme_session_id', sid)
        }
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const id = entry.target.dataset.id;
                    if(id && !window[`viewed_${id}`]) {
                        window[`viewed_${id}`] = true;
                        fetch(`https://timelineplus.site/api/memes/${id}/view`, {
                            method: 'POST', headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ sessionId: sid })
                        }).catch(e => {});
                    }
                }
            })
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.meme-card').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [memes])

    const handleInteract = async (memeId, type, extra = {}) => {
        if (!user) return addToast('error', 'Please login to interact!')

        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${memeId}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    type,
                    ...extra
                })
            })
            const data = await res.json()
            if (res.ok) {
                if (type === 'like' && !extra.silent) addToast('success', 'Liked! You earned Memoney.')
                fetchMemes()
            }
        } catch (err) {
            addToast('error', 'Interaction failed')
        }
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
            } else {
                addToast('error', data.error || 'Failed to dislike')
            }
        } catch (err) {
            addToast('error', 'Interaction failed')
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!uploadData.file) return addToast('error', 'Select a meme to upload!')

        const formData = new FormData()
        formData.append('meme', uploadData.file)
        formData.append('caption', uploadData.caption)
        formData.append('userId', user.id)

        try {
            const res = await fetch('https://timelineplus.site/api/memes', {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                addToast('success', 'Meme posted successfully! You earned 20 Memoney.')
                setShowUpload(false)
                setUploadData({ caption: '', file: null })
                fetchMemes()
            } else {
                const error = await res.json()
                addToast('error', error.error || 'Upload failed')
            }
        } catch (err) {
            addToast('error', 'Network error during upload')
        }
    }

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
            } else { addToast('error', data.error || 'Failed to report') }
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
            } else { addToast('error', 'Failed to edit') }
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
        } catch (err) {
            addToast('error', 'Network error')
        }
    }

    return (
        <div style={{ padding: '80px 0 100px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <SEO title="Meme Feed - Timeline Earn" description="Explore, post, and earn with memes. The best meme economy on the web." />
            <Navbar />

            <style>
                {`
                    .meme-container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 15px;
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        box-sizing: border-box;
                        overflow-x: hidden;
                    }
                    .meme-sidebar-left, .meme-sidebar-right {
                        display: none;
                        width: 250px;
                        flex-shrink: 0;
                    }
                    .meme-feed-main {
                        width: 100%;
                        max-width: 600px;
                        min-width: 0;
                    }
                    .meme-sticky-box {
                        position: sticky;
                        top: 100px;
                    }
                    .mobile-header {
                        display: block;
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    @media(min-width: 1024px) {
                        .meme-sidebar-left, .meme-sidebar-right { display: block; }
                        .mobile-header { display: none; }
                    }
                `}
            </style>

            <div className="meme-container">
                {/* Desktop Left Sidebar */}
                <div className="meme-sidebar-left">
                    <div className="meme-sticky-box">
                        <div className="glass-card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #eff3f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #1d9bf0, #0072b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <FiSmile size={32} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px', color: '#0f1419' }}>Meme Economy</h2>
                            <p style={{ color: '#536471', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
                                Earn Memoney for every post, like, and share. You are part of the ultimate creator economy!
                            </p>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="glass-btn primary w-full"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', padding: '14px', borderRadius: '50px', background: '#1d9bf0', border: 'none', color: 'white', fontWeight: 800, boxShadow: '0 8px 16px rgba(29, 155, 240, 0.2)' }}
                            >
                                <FiPlus size={20} /> Post Your Meme
                            </button>
                        </div>
                        
                        <div style={{ marginTop: '20px' }}>
                            <TrendingSidebar />
                        </div>

                        <div style={{ display: 'flex', gap: '15px', color: '#536471', fontSize: '0.85rem', padding: '15px 10px', flexWrap: 'wrap' }}>
                            <span style={{ cursor: 'pointer', hover: {textDecoration: 'underline'} }}>Terms of Service</span>
                            <span style={{ cursor: 'pointer', hover: {textDecoration: 'underline'} }}>Privacy Policy</span>
                            <span>© 2026 Timeline Earn</span>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FeedAd adHtml={adSlots.slot1} />
                        </div>
                    </div>
                </div>

                {/* Main Feed Column */}
                <div className="meme-feed-main">
                    
                    {/* Inline Facebook-Style Post Creator */}
                    <div style={{ background: '#fff', borderRadius: window.innerWidth <= 600 ? '0' : '16px', padding: '20px', border: window.innerWidth <= 600 ? 'none' : '1px solid #eff3f4', borderBottom: window.innerWidth <= 600 ? '1px solid #eff3f4' : '1px solid #eff3f4', marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
                                {user?.avatar ? (
                                    <img src={user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="You" />
                                ) : (
                                    <span style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', color:'#9ca3af', fontWeight:700, fontSize:'1.2rem'}}>{user?.name?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <textarea
                                placeholder="What's a funny vibe today? Post a meme... Earn Memoney!"
                                value={uploadData.caption}
                                onChange={e => setUploadData({ ...uploadData, caption: e.target.value })}
                                style={{ width: '100%', minHeight: '60px', border: 'none', resize: 'none', outline: 'none', fontSize: '1.1rem', fontFamily: 'inherit', color: '#0f1419', paddingTop: '10px' }}
                            />
                        </div>
                        
                        {uploadData.file && (
                            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eff3f4', margin: '10px 0 10px 60px' }}>
                                <button onClick={() => setUploadData({...uploadData, file: null})} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                                    <FiX size={16} />
                                </button>
                                <img src={URL.createObjectURL(uploadData.file)} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} alt="Upload preview" />
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid #eff3f4', marginLeft: '60px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d9bf0', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', padding: '8px' }}>
                                    <FiImage size={22} /> Photo / Meme
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setUploadData({...uploadData, file: e.target.files[0]})} />
                                </label>
                            </div>
                            <button 
                                onClick={handleUpload}
                                disabled={!uploadData.file && !uploadData.caption.trim()}
                                style={{ background: (!uploadData.file && !uploadData.caption.trim()) ? '#8ecdf8' : '#1d9bf0', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 800, fontSize: '1rem', cursor: (!uploadData.file && !uploadData.caption.trim()) ? 'default' : 'pointer' }}
                            >
                                Post
                            </button>
                        </div>
                    </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(102,126,234,0.3)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
                    <p style={{ fontWeight: 600 }}>Loading memes...</p>
                </div>
            ) : memes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                    <FiSmile size={48} style={{ opacity: 0.5, margin: '0 auto 15px' }} />
                    <p style={{ fontWeight: 600, fontSize: '1.2rem' }}>No memes found. Be the first to start the vibe!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    {Array.isArray(memes) && memes.filter(m => !hiddenMemes.includes(m.id)).map((meme, idx) => (
                        <React.Fragment key={meme.id}>
                            <motion.div
                                className="meme-card"
                                data-id={meme.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #eff3f4',
                                    borderRadius: window.innerWidth <= 600 ? '0' : '16px',
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    {/* Avatar */}
                                    <Link to={`/user/${meme.author_username}`} style={{ flexShrink: 0, display: 'block', textDecoration: 'none' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {meme.author_avatar ? (
                                                <img src={meme.author_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af' }}>{meme.author_username?.[0]?.toUpperCase()}</span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Right Content Block */}
                                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                        {/* Author Info row */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', overflow: 'hidden' }}>
                                                <Link to={`/user/${meme.author_username}`} style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f1419', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                                    {meme.author_username || 'anonymous'}
                                                </Link>
                                                {(meme.is_verified || meme.author_role === 'admin' || meme.author_is_super_admin) ? <VerifiedBadge size="1.1em" /> : null}
                                                <span style={{ fontSize: '0.95rem', color: '#536471', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginLeft: '4px' }}>
                                                    @{meme.author_username || 'anonymous'}
                                                </span>
                                                <span style={{ fontSize: '0.95rem', color: '#536471', margin: '0 4px' }}>·</span>
                                                <span style={{ fontSize: '0.95rem', color: '#536471' }}>
                                                    {new Date(meme.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                {/* FOLLOW BUTTON */}
                                                {user && user.id !== meme.user_id && (
                                                    <button onClick={() => addToast('success', 'Followed ' + meme.author_username)} style={{ marginLeft: '6px', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '50px', background: '#eff3f4', border: 'none', color: '#0f1419', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FiUserPlus size={12} /> Follow
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <button onClick={() => setActiveMenu(activeMenu === meme.id ? null : meme.id)} style={{ background: 'transparent', border: 'none', color: '#536471', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <FiMoreVertical size={18} />
                                                </button>
                                                {/* DROPDOWN MENU */}
                                                {activeMenu === meme.id && (
                                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '150px', zIndex: 10, border: '1px solid #eff3f4' }}>
                                                        <button onClick={() => handleHide(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#0f1419', fontSize: '0.95rem' }}>
                                                            <FiEyeOff size={16} /> Hide for me
                                                        </button>
                                                        {user && user.id != meme.user_id && (
                                                            <button onClick={() => handleReport(meme)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f91880', fontSize: '0.95rem' }}>
                                                                <FiAlertTriangle size={16} /> Report
                                                            </button>
                                                        )}
                                                        {user && user.id == meme.user_id && (
                                                            <>
                                                                <button onClick={() => handleEdit(meme)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#1d9bf0', fontSize: '0.95rem' }}>
                                                                    <FiEdit2 size={16} /> Edit
                                                                </button>
                                                                <button onClick={() => handleDelete(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f91880', fontSize: '0.95rem' }}>
                                                                    <FiTrash2 size={16} /> Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Caption content */}
                                        <div style={{ marginBottom: '12px', color: '#0f1419', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                                            <PostTextFormatter text={meme.caption} />
                                        </div>

                                        {/* Image content */}
                                        <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eff3f4', cursor: 'pointer', position: 'relative', marginTop: '4px' }}>
                                            <img
                                                src={meme.image_url}
                                                alt={meme.caption}
                                                style={{ width: '100%', display: 'block', maxHeight: '550px', objectFit: 'cover' }}
                                                onDoubleClick={() => handleInteract(meme.id, 'like')}
                                            />
                                        </div>

                                        {/* Action Row */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', maxWidth: '450px', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button onClick={() => handleInteract(meme.id, 'like')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: meme.has_liked ? '#f91880' : '#536471', cursor: 'pointer', outline: 'none', padding: '4px 8px', marginLeft: '-8px', borderRadius: '50px', transition: 'background-color 0.2s' }}>
                                                    <FiHeart size={18} fill={meme.has_liked ? 'currentColor' : 'none'} />
                                                    <span style={{ fontSize: '0.85rem' }}>{meme.likes_count}</span>
                                                </button>
                                                <button onClick={() => handleDislike(meme.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: meme.has_disliked ? '#ef4444' : '#536471', cursor: 'pointer', outline: 'none', padding: '4px 8px', borderRadius: '50px', transition: 'background-color 0.2s' }}>
                                                    <FiThumbsDown size={18} fill={meme.has_disliked ? 'currentColor' : 'none'} />
                                                    <span style={{ fontSize: '0.85rem' }}>{meme.dislikes_count || 0}</span>
                                                </button>
                                            </div>
                                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#536471', cursor: 'pointer', padding: '4px 8px', borderRadius: '50px' }}>
                                                <FiMessageCircle size={18} />
                                                <span style={{ fontSize: '0.85rem' }}>{meme.comments_count}</span>
                                            </button>
                                            <button onClick={() => setSharingMeme(meme)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#536471', cursor: 'pointer', padding: '4px 8px', borderRadius: '50px' }}>
                                                <FiShare2 size={18} />
                                                <span style={{ fontSize: '0.85rem' }}>{meme.shares_count}</span>
                                            </button>
                                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#536471', cursor: 'pointer', padding: '4px 8px', borderRadius: '50px' }}>
                                                <FiEye size={18} />
                                                <span style={{ fontSize: '0.85rem' }}>{meme.views || 0}</span>
                                            </button>
                                            <Link to={`/meme/${meme.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#536471', cursor: 'pointer', padding: '4px 8px', borderRadius: '50px', textDecoration: 'none' }}>
                                                <FiExternalLink size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Insert Simplistic Ad every 3 memes */}
                            {(idx + 1) % 3 === 0 && (
                                <div className="mt-4 mb-2">
                                    <FeedAd 
                                        adHtml={
                                            ((idx + 1) / 3) % 3 === 1 ? adSlots.slot1 : 
                                            ((idx + 1) / 3) % 3 === 2 ? adSlots.slot2 : adSlots.slot3
                                        } 
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
                </div>

                {/* Desktop Right Sidebar */}
                <div className="meme-sidebar-right">
                    <div className="meme-sticky-box" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <FeedAd adHtml={adSlots.slot2} />
                    </div>
                </div>

            </div>

            {/* Reporting Modal */}
            <AnimatePresence>
                {reportingMeme && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            style={{ background: '#fff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                        >
                            <button onClick={() => setReportingMeme(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                                <FiX size={18} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', color: '#f91880', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiAlertTriangle /> Report Post
                            </h2>
                            <p style={{ marginBottom: '15px', fontWeight: 600, color: '#374151' }}>Why are you reporting this post?</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                {['Spam', 'Sexual Content', 'Harassment', 'Hate Speech', 'Scam / Fraud'].map(reason => (
                                    <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={reportReason.includes(reason)} 
                                            onChange={(e) => {
                                                if (e.target.checked) setReportReason([...reportReason, reason])
                                                else setReportReason(reportReason.filter(r => r !== reason))
                                            }}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        {reason}
                                    </label>
                                ))}
                            </div>
                            <textarea
                                placeholder="Additional details (optional)..."
                                value={reportDetails}
                                onChange={e => setReportDetails(e.target.value)}
                                style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', resize: 'none', marginBottom: '20px', fontFamily: 'inherit' }}
                            ></textarea>
                            <button onClick={submitReport} className="glass-btn primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, background: '#f91880', border: 'none' }}>
                                Submit Report
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editing Modal */}
            <AnimatePresence>
                {editingMeme && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            style={{ background: '#fff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                        >
                            <button onClick={() => setEditingMeme(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                                <FiX size={18} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', color: '#1d9bf0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiEdit2 /> Edit Caption
                            </h2>
                            <textarea
                                value={editCaption}
                                onChange={e => setEditCaption(e.target.value)}
                                style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', resize: 'none', marginBottom: '20px', fontFamily: 'inherit', fontSize: '1rem' }}
                            ></textarea>
                            <button onClick={submitEdit} className="glass-btn primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, border: 'none' }}>
                                Save Changes
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Share Modal */}
            <AnimatePresence>
                {sharingMeme && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            style={{ background: '#fff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                        >
                            <button onClick={() => setSharingMeme(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                                <FiX size={18} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <FiShare2 /> Share Meme
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <button onClick={() => executeShare('whatsapp')} style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#25D366', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <FiMessageCircle /> WhatsApp
                                </button>
                                <button onClick={() => executeShare('facebook')} style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#1877F2', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    Facebook
                                </button>
                                <button onClick={() => executeShare('twitter')} style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#1DA1F2', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    Twitter (X)
                                </button>
                                <button onClick={() => executeShare('telegram')} style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#0088cc', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <FiSend /> Telegram
                                </button>
                                <button onClick={() => executeShare('copy')} style={{ gridColumn: '1 / -1', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#f9fafb', color: '#4b5563', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <FiCopy /> Copy Link
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
