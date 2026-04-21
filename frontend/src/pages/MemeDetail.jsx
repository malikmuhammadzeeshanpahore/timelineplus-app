import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { FiHeart, FiMessageCircle, FiShare2, FiArrowLeft, FiMoreVertical, FiCopy, FiSend, FiEye, FiAlertTriangle, FiTrash2, FiThumbsDown, FiEdit2, FiX, FiCheckCircle } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import VerifiedBadge from '../components/common/VerifiedBadge'
import { AnimatePresence } from 'framer-motion'
import { useToastStore } from '../context/useToastStore'
import { useAuthStore } from '../context/useAuthStore'
import PostTextFormatter from '../components/common/PostTextFormatter'

export default function MemeDetail() {
    const { id } = useParams()
    const { addToast } = useToastStore()
    const { user } = useAuthStore()
    const [meme, setMeme] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeMenu, setActiveMenu] = useState(false)
    const [reportingMeme, setReportingMeme] = useState(null)
    const [reportReason, setReportReason] = useState([])
    const [reportDetails, setReportDetails] = useState('')
    const [editingMeme, setEditingMeme] = useState(null)
    const [editCaption, setEditCaption] = useState('')
    const [sharingMeme, setSharingMeme] = useState(null)

    const executeShare = async (platform) => {
        if (!sharingMeme) return;
        const url = `${window.location.origin}/meme/${sharingMeme.id}`;
        let shareUrl = '';
        
        try { fetch(`https://timelineplus.site/api/memes/${sharingMeme.id}/share`, { method: 'POST' }).catch(e=>console.log(e)); } catch(e){}

        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            addToast('success', 'Link copied to clipboard!');
            setSharingMeme(null);
            setMeme({ ...meme, shares_count: meme.shares_count + 1 });
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
        setMeme({ ...meme, shares_count: meme.shares_count + 1 });
    }

    useEffect(() => {
        let sid = localStorage.getItem('meme_session_id')
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15)
            localStorage.setItem('meme_session_id', sid)
        }
        fetch(`https://timelineplus.site/api/memes/${id}/view`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sessionId: sid })
        }).catch(e => {});

        const fetchUrl = user ? `https://timelineplus.site/api/memes?userId=${user.id}` : 'https://timelineplus.site/api/memes';
        fetch(fetchUrl)
            .then(res => res.json())
            .then(data => {
                const found = Array.isArray(data) ? data.find(m => m.id == id) : data;
                setMeme(found)
                setLoading(false)
            })
            .catch(() => setLoading(false))

        fetchComments()
    }, [id, user])

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [editingComment, setEditingComment] = useState(null)
    const [editCommentText, setEditCommentText] = useState('')

    const fetchComments = async () => {
        try {
            const url = user ? `https://timelineplus.site/api/memes/${id}/comments?userId=${user.id}` : `https://timelineplus.site/api/memes/${id}/comments`;
            const res = await fetch(url);
            if (res.ok) setComments(await res.json());
        } catch(e) {}
    }

    const handlePostComment = async () => {
        if (!user) return addToast('error', 'Please login to comment')
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${id}/comments`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, text: newComment, parentId: replyingTo?.id })
            })
            if (res.ok) {
                setNewComment('')
                setReplyingTo(null)
                fetchComments()
                addToast('success', 'Comment posted!')
            } else addToast('error', 'Failed to comment')
        } catch (e) { addToast('error', 'Network error') }
    }

    const handleEditComment = async () => {
        if (!editCommentText.trim()) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/comments/${editingComment.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, text: editCommentText })
            })
            const data = await res.json()
            if (res.ok) {
                setEditingComment(null)
                fetchComments()
                addToast('success', 'Comment updated!')
            } else addToast('error', data.error)
        } catch (e) { addToast('error', 'Network error') }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/comments/${commentId}`, {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (res.ok) {
                fetchComments()
                addToast('success', 'Comment deleted!')
            } else addToast('error', data.error)
        } catch (e) { addToast('error', 'Network error') }
    }

    const handleCommentInteract = async (commentId, type) => {
        if (!user) return addToast('error', 'Please login to interact')
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/comments/${commentId}/interact`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, type })
            })
            if (res.ok) {
                if (type === 'dislike') {
                    const data = await res.json()
                    if (data.action !== 'removed') addToast('info', 'Comment disliked. Owner penalized 5 Memoney.')
                }
                fetchComments()
            }
        } catch (e) { addToast('error', 'Interaction failed') }
    }

    const ReportComment = async (commentId) => {
        if (!user) return addToast('error', 'Login required')
        const r = window.prompt("Reason for reporting this comment?")
        if (!r) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/comments/${commentId}/report`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, reason: r })
            })
            if (res.ok) addToast('success', 'Comment reported')
        } catch (e) { addToast('error', 'Report failed') }
    }

    const formatTimeAgo = (dateStr) => {
        // Force UTC if missing Z
        const utcDate = dateStr.includes('T') ? (dateStr.endsWith('Z') ? dateStr : dateStr + 'Z') : dateStr.replace(' ', 'T') + 'Z';
        const ms = new Date() - new Date(utcDate)
        const mins = Math.floor(ms / 60000);
        if (mins < 0) return 'Just now'; // Handle clock skew
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    }

    const canEditDelete = (dateStr) => {
        return (new Date() - new Date(dateStr)) < 3600000; // 1 hour
    }

    const renderComment = (c, isReply = false) => (
        <div key={c.id} style={{ display: 'flex', gap: '15px', marginTop: '20px', paddingLeft: isReply ? '40px' : '0', borderLeft: isReply ? '2px solid #e5e7eb' : 'none', marginLeft: isReply ? '20px' : '0' }}>
            <img src={c.user_avatar || '/default-avatar.png'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '16px', border: '1px solid #eff3f4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#111827' }}>{c.user_name} <span style={{ fontWeight: 500, color: '#6b7280' }}>@{c.username}</span></span>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{formatTimeAgo(c.created_at)}</span>
                    </div>
                    {editingComment?.id === c.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <textarea value={editCommentText} onChange={e=>setEditCommentText(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'none' }} rows={2}></textarea>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleEditComment} style={{ padding: '6px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Save</button>
                                <button onClick={()=>setEditingComment(null)} style={{ padding: '6px 12px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <p style={{ margin: 0, color: '#374151', lineHeight: 1.5 }}><PostTextFormatter text={c.text} /></p>
                    )}
                </div>
                
                {/* Comment Actions */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '8px', marginLeft: '5px' }}>
                    <button onClick={() => handleCommentInteract(c.id, 'like')} style={{ background: 'none', border: 'none', color: c.user_interaction === 'like' ? '#ef4444' : '#000000', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: 0 }}>
                        {c.user_interaction === 'like' ? <FaHeart size={14} color="#ef4444" /> : <FiHeart size={14} />} {c.likes_count}
                    </button>
                    <button onClick={() => handleCommentInteract(c.id, 'dislike')} style={{ background: 'none', border: 'none', color: c.user_interaction === 'dislike' ? '#ef4444' : '#6b7280', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: 0 }}>
                        <FiThumbsDown size={14} fill={c.user_interaction === 'dislike' ? 'currentColor' : 'none'} /> {c.dislikes_count || 0}
                    </button>
                    <button onClick={() => setReplyingTo(c)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Reply</button>
                    
                    {user && user.id === c.user_id && canEditDelete(c.created_at) && (
                        <>
                            <button onClick={() => { setEditingComment(c); setEditCommentText(c.text); }} style={{ background: 'none', border: 'none', color: '#1d9bf0', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Edit</button>
                            <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Delete</button>
                        </>
                    )}
                    {user && user.id !== c.user_id && (
                        <button onClick={() => ReportComment(c.id)} style={{ background: 'none', border: 'none', color: '#f91880', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Report</button>
                    )}
                </div>

                {/* Replies */}
                {c.replies?.map(r => renderComment(r, true))}
            </div>
        </div>
    )

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        addToast('success', 'Link copied to clipboard!')
    }

    const handleReport = (meme) => {
        setActiveMenu(false)
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
            } else { addToast('error', data.error || 'Failed to report') }
        } catch (err) { addToast('error', 'Network error') }
    }

    const handleEdit = (meme) => {
        setActiveMenu(false)
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
                const fetchUrl = user ? `https://timelineplus.site/api/memes?userId=${user.id}` : 'https://timelineplus.site/api/memes';
                fetch(fetchUrl).then(r => r.json()).then(d => {
                    const found = Array.isArray(d) ? d.find(m => m.id == id) : d;
                    setMeme(found)
                })
            } else { addToast('error', 'Failed to edit') }
        } catch (err) { addToast('error', 'Network error') }
    }

    const handleDelete = async (id) => {
        setActiveMenu(false)
        if (!window.confirm("Are you sure you want to delete your meme?")) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${id}`, {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
            })
            if (res.ok) {
                addToast('success', 'Meme deleted successfully')
                window.location.href = '/memes';
            } else {
                const data = await res.json()
                addToast('error', data.error)
            }
        } catch (err) { addToast('error', 'Network error') }
    }

    const handleInteract = async (memeId, type) => {
        if (!user) return addToast('error', 'Please login to interact!')
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${memeId}/interact`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, type })
            })
            if (res.ok) {
                if (type === 'like') addToast('success', 'Liked! You earned Memoney.')
                const fetchUrl = user ? `https://timelineplus.site/api/memes?userId=${user.id}` : 'https://timelineplus.site/api/memes';
                fetch(fetchUrl).then(r => r.json()).then(d => {
                    const found = Array.isArray(d) ? d.find(m => m.id == id) : d;
                    setMeme(found)
                })
            }
        } catch (err) { addToast('error', 'Interaction failed') }
    }

    const handleDislike = async (memeId) => {
        if (!user) return addToast('error', 'Please login to interact!')
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${memeId}/dislike`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (res.ok) {
                addToast(data.disliked ? 'success' : 'info', data.message)
                const fetchUrl = user ? `https://timelineplus.site/api/memes?userId=${user.id}` : 'https://timelineplus.site/api/memes';
                fetch(fetchUrl).then(r => r.json()).then(d => {
                    const found = Array.isArray(d) ? d.find(m => m.id == id) : d;
                    setMeme(found)
                })
            } else { addToast('error', data.error || 'Failed to dislike') }
        } catch (err) { addToast('error', 'Interaction failed') }
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(102,126,234,0.3)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Loading meme details...</p>
        </div>
    )

    if (!meme) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Meme Not Found <FiMoreVertical />
            </h1>
            <Link to="/memes" className="glass-btn primary" style={{ padding: '12px 30px', borderRadius: '50px' }}>Back to Feed</Link>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', paddingBottom: '100px' }}>
            <SEO
                title={`${meme.caption} | Timeline Earn`}
                description={`Check out this meme by @${meme.author_username} on Timeline Earn. Like and share to earn Memoney!`}
                image={meme.image_url}
            />
            <Navbar />

            <div className="container" style={{ maxWidth: '1000px', paddingTop: '40px' }}>
                <Link to="/memes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginBottom: '30px', fontWeight: 700, textDecoration: 'none' }}>
                    <FiArrowLeft /> Back to Meme Feed
                </Link>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                    {/* Left: Meme Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ flex: '1 1 500px', backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}
                    >
                        <img
                            src={meme.image_url}
                            alt={meme.caption}
                            style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    </motion.div>

                    {/* Right: Interaction and Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}
                    >
                        <div style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Author Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f9fafb' }}>
                                <Link to={`/user/${meme.author_username}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '2px' }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {meme.author_avatar ? (
                                                <img src={meme.author_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontWeight: 700, color: '#9ca3af' }}>{meme.author_username?.[0]?.toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 900, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            @{meme.author_username || 'anonymous'}
                                            {(meme.is_verified || meme.author_role === 'admin' || meme.author_is_super_admin) && <VerifiedBadge size="1rem" />}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, margin: 0 }}>{new Date(meme.created_at).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                                <div style={{ position: 'relative' }}>
                                    <button onClick={() => setActiveMenu(!activeMenu)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><FiMoreVertical size={20} /></button>
                                    {activeMenu && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '150px', zIndex: 10, border: '1px solid #eff3f4' }}>
                                            {user && user.id != meme.user_id && (
                                                <div onClick={() => handleReport(meme)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f91880', fontSize: '0.95rem' }}>
                                                    <FiAlertTriangle size={16} /> Report
                                                </div>
                                            )}
                                            {user && user.id == meme.user_id && (
                                                <>
                                                    <div onClick={() => handleEdit(meme)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#1d9bf0', fontSize: '0.95rem' }}>
                                                        <FiEdit2 size={16} /> Edit
                                                    </div>
                                                    <div onClick={() => handleDelete(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f91880', fontSize: '0.95rem' }}>
                                                        <FiTrash2 size={16} /> Delete
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Caption */}
                            <div style={{ flex: 1, marginBottom: '30px' }}>
                                <p style={{ fontSize: '1.25rem', fontWeight: 500, color: '#1f2937', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                                    "<PostTextFormatter text={meme.caption} />"
                                </p>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>{meme.likes_count}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiHeart /> Likes</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>{meme.comments_count}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiMessageCircle /> Comments</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setSharingMeme(meme)}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>{meme.shares_count}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiShare2 /> Shares</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>{meme.views || 0}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiEye /> Views</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                <button onClick={() => handleInteract(meme.id, 'like')} className="glass-btn primary" style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '16px', boxShadow: meme.has_liked ? '0 10px 15px -3px rgba(239, 68, 68, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)', width: '100%', background: meme.has_liked ? '#ef4444' : '#f3f4f6', color: meme.has_liked ? '#fff' : '#000000', border: 'none' }}>
                                    {meme.has_liked ? <FaHeart size={20} color="#fff" /> : <FiHeart size={20} />} Like {meme.likes_count}
                                </button>
                                <button onClick={() => handleDislike(meme.id)} className="glass-btn" style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '16px', boxShadow: meme.has_disliked ? '0 10px 15px -3px rgba(239, 68, 68, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '100%', color: meme.has_disliked ? '#fff' : '#ef4444', backgroundColor: meme.has_disliked ? '#ef4444' : '#fee2e2', border: 'none' }}>
                                    <FiThumbsDown /> Dislike {meme.dislikes_count || 0}
                                </button>
                                <button onClick={() => setSharingMeme(meme)} className="glass-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '16px', border: '1px solid #f3f4f6', backgroundColor: '#fff', color: '#374151', width: '100%' }}>
                                    <FiShare2 /> Share
                                </button>
                            </div>

                            {/* CTAs */}
                            <div style={{ backgroundColor: '#eef2ff', borderRadius: '16px', padding: '24px' }}>
                                <h4 style={{ fontWeight: 900, color: '#312e81', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Join the Community <FiSend />
                                </h4>
                                <p style={{ color: '#4338ca', fontSize: '0.875rem', margin: '0 0 16px 0' }}>Post memes like this and earn <strong>Memoney</strong> rewards instantly.</p>
                                <Link to="/register">
                                    <button style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>Start Earning Now</button>
                                </Link>
                            </div>

                            {/* Comments Section */}
                            <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '30px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiMessageCircle /> Comments ({meme.comments_count})</h3>
                                
                                {/* New Comment Input */}
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                                    <img src={user?.avatar || '/default-avatar.png'} alt="user" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        {replyingTo && (
                                            <div style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'flex', justifyContent: 'space-between', marginBottom: '8px', background: '#eef2ff', padding: '6px 10px', borderRadius: '8px' }}>
                                                <span>Replying to <strong>@{replyingTo.username}</strong></span>
                                                <button onClick={()=>setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer' }}><FiX size={14}/></button>
                                            </div>
                                        )}
                                        <textarea 
                                            placeholder={replyingTo ? 'Write a reply...' : 'Add a public comment...'}
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            style={{ width: '100%', minHeight: '80px', padding: '15px', borderRadius: '16px', border: '1px solid #d1d5db', background: '#fff', resize: 'none', fontFamily: 'inherit', fontSize: '0.95rem' }}
                                        ></textarea>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                            <button onClick={handlePostComment} className="glass-btn primary" style={{ padding: '10px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', fontWeight: 600 }}>
                                                <FiSend /> {replyingTo ? 'Reply' : 'Post Comment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {comments.length === 0 ? (
                                        <p style={{ color: '#6b7280', textAlign: 'center', margin: '20px 0' }}>No comments yet. Start the conversation!</p>
                                    ) : (
                                        comments.map(c => renderComment(c))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
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
