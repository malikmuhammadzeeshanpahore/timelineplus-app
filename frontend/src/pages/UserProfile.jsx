import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiUserPlus, FiUserCheck, FiEye, FiThumbsDown, FiMessageCircle, FiShare2, FiActivity, FiImage, FiPlus, FiX, FiMoreVertical, FiCopy, FiAlertTriangle, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import TrendingSidebar from '../components/TrendingSidebar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import PostTextFormatter from '../components/common/PostTextFormatter'
import SimplisticAd from '../components/common/SimplisticAd'

export default function UserProfile() {
    const { username } = useParams()
    const { user, isAuthenticated } = useAuthStore()
    const { addToast } = useToastStore()
    
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)

    // Meme Posting State
    const [uploadData, setUploadData] = useState({ caption: '', file: null })

    // Interaction States
    const [hiddenMemes, setHiddenMemes] = useState([])
    const [activeMenu, setActiveMenu] = useState(null)
    const [reportingMeme, setReportingMeme] = useState(null)
    const [reportReason, setReportReason] = useState([])
    const [reportDetails, setReportDetails] = useState('')

    useEffect(() => {
        setLoading(true);
        fetchProfile()
    }, [username])

    const fetchProfile = async () => {
        // Strip leading @ if someone navigates to /@username
        const cleanUsername = username ? username.replace(/^@/, '') : '';
        try {
            const res = await fetch(`https://timelineplus.site/api/users/profile/${cleanUsername}`)
            if (!res.ok) throw new Error('Profile not found')
            const data = await res.json()
            setProfileData(data)
            
            if (user && data.user && user.id !== data.user.id) {
                // Check if following
                try {
                    const followRes = await fetch(`https://timelineplus.site/api/users/${user.id}/follows/${data.user.id}`)
                    if (followRes.ok) {
                        const followData = await followRes.json()
                        setIsFollowing(followData.isFollowing)
                    }
                } catch (e) {
                    console.error('Follow check failed', e)
                }
            }
            setLoading(false)
        } catch (e) {
            setLoading(false)
            addToast('error', e.message)
        }
    }

    useEffect(() => {
        if (!profileData?.memes) return;
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
    }, [profileData?.memes])

    const toggleFollow = async () => {
        if (!isAuthenticated) return addToast('error', 'Please login to follow users')
        if (!profileData?.user?.id) return;
        
        try {
            const endpoint = isFollowing ? `https://timelineplus.site/api/users/${profileData.user.id}/follow` : `https://timelineplus.site/api/users/${profileData.user.id}/follow`;
            const method = isFollowing ? 'DELETE' : 'POST';
            
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: user.id })
            });

            if (res.ok) {
                setIsFollowing(!isFollowing)
                fetchProfile() // Refresh stats
            }
        } catch (error) {
            addToast('error', 'Failed to update follow status')
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
                setUploadData({ caption: '', file: null })
                fetchProfile() // fetch newly posted meme to feed
            } else {
                const error = await res.json()
                addToast('error', error.error || 'Upload failed')
            }
        } catch (err) {
            addToast('error', 'Network error during upload')
        }
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
                fetchProfile()
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
                fetchProfile()
            } else { addToast('error', data.error || 'Failed to dislike') }
        } catch (err) { addToast('error', 'Interaction failed') }
    }

    const shareMeme = (meme, platform) => {
        const url = `${window.location.origin}/meme/${meme.id}`
        const text = `Check out this meme on Timeline Earn: ${meme.caption}`

        if (platform === 'copy') {
            navigator.clipboard.writeText(url)
            addToast('success', 'Link copied to clipboard!')
            handleInteract(meme.id, 'share')
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
            handleInteract(meme.id, 'share')
        }
    }

    const handleDelete = async (id) => {
        setActiveMenu(null)
        if (!window.confirm("Are you sure you want to delete your meme?")) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/memes/${id}`, {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
            })
            if (res.ok) {
                addToast('success', 'Meme deleted successfully')
                fetchProfile()
            } else {
                const data = await res.json()
                addToast('error', data.error)
            }
        } catch (err) { addToast('error', 'Network error') }
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
                setHiddenMemes(prev => [...prev, reportingMeme.id])
                setReportingMeme(null)
            } else { addToast('error', data.error || 'Failed to report') }
        } catch (err) { addToast('error', 'Network error') }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                <div className="loader"></div>
            </div>
        )
    }

    if (!profileData) {
        return (
            <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
                <Navbar />
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <SEO title="User Not Found | Timeline Earn" description="This profile does not exist or has been removed." />
                    <h2>User not found</h2>
                </div>
            </div>
        )
    }

    const pUser = profileData.user;
    const stats = profileData.stats;
    const score = profileData.character_score;
    const label = profileData.character_label;
    
    // Character Colors
    let shieldColor = 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)';
    let shieldShadow = 'rgba(79, 70, 229, 0.4)';
    let labelColor = '#4f46e5';

    if (score >= 85) {
        shieldColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; 
        shieldShadow = 'rgba(16, 185, 129, 0.4)';
        labelColor = '#10b981';
    } else if (score >= 69) {
        shieldColor = 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'; 
        shieldShadow = 'rgba(14, 165, 233, 0.4)';
        labelColor = '#0ea5e9';
    } else if (score >= 53) {
        shieldColor = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'; 
        shieldShadow = 'rgba(139, 92, 246, 0.4)';
        labelColor = '#8b5cf6';
    } else if (score >= 37) {
        shieldColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; 
        shieldShadow = 'rgba(245, 158, 11, 0.4)';
        labelColor = '#f59e0b';
    } else {
        shieldColor = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'; 
        shieldShadow = 'rgba(239, 68, 68, 0.4)';
        labelColor = '#ef4444';
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <SEO title={`${pUser.name} (@${pUser.username}) | Timeline`} description={`Check out ${pUser.name}'s profile and memes.`} />
            <Navbar />
            
            <style>
                {`
                    .profile-container {
                        max-width: 1100px;
                        margin: 0 auto;
                        padding: 90px 20px 40px;
                    }
                    .profile-header {
                        background: #fff;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                        margin-bottom: 20px;
                        border: 1px solid #eff3f4;
                    }
                    .profile-columns {
                        display: flex;
                        gap: 20px;
                        align-items: flex-start;
                    }
                    .profile-left {
                        flex: 0 0 350px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .profile-right {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        min-width: 0; /* Prevents overflow */
                    }
                    @media(max-width: 900px) {
                        .profile-columns { flex-direction: column; }
                        .profile-left { flex: none; width: 100%; }
                    }
                `}
            </style>

            <div className="profile-container">
                
                {/* Hero Header */}
                <div className="profile-header">
                    <div style={{ height: '300px', background: pUser.bg_image ? `url(${pUser.bg_image}) center/cover` : 'linear-gradient(135deg, #1d9bf0 0%, #0072b1 100%)' }}></div>
                    <div style={{ padding: '0 30px 20px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-80px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                            <img 
                                src={pUser.avatar || '/default-avatar.png'} 
                                alt={pUser.name} 
                                style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #fff', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                            />
                            <div style={{ paddingBottom: '20px' }}>
                                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1 }}>
                                    {pUser.name}
                                    {(pUser.profile_verified === 1 || pUser.role === 'admin' || pUser.is_super_admin === 1) && <VerifiedBadge size="1rem" />}
                                </h1>
                                <p style={{ margin: '5px 0 0', color: '#536471', fontWeight: 500, fontSize: '1.1rem' }}>@{pUser.username}</p>
                            </div>
                        </div>

                        <div style={{ paddingBottom: '20px' }}>
                            {user && user.id !== pUser.id ? (
                                <button 
                                    onClick={toggleFollow}
                                    style={{ padding: '10px 24px', borderRadius: '50px', background: isFollowing ? '#eff3f4' : '#111827', color: isFollowing ? '#0f1419' : '#fff', border: isFollowing ? '1px solid #cfd9de' : 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    {isFollowing ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Content Columns */}
                <div className="profile-columns">
                    {/* Left Column - Intro & Trending */}
                    <div className="profile-left">
                        {/* Intro Card */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #eff3f4', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 15px', color: '#0f1419' }}>Intro</h2>
                            
                            {pUser.about && (
                                <p style={{ margin: '0 0 15px', color: '#0f1419', fontSize: '1rem', lineHeight: 1.5, textAlign: 'center' }}>{pUser.about}</p>
                            )}

                            {(pUser.city || pUser.country) && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#536471', marginBottom: '15px' }}>
                                    <span>📍 From <strong>{pUser.city ? `${pUser.city}, ` : ''}{pUser.country}</strong></span>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px 0', borderTop: '1px solid #eff3f4', borderBottom: '1px solid #eff3f4', margin: '15px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#536471' }}>
                                    <FiActivity size={20} /> <span style={{ fontWeight: 600 }}>Character Score</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ 
                                        background: shieldColor, color: '#fff', padding: '10px 20px', borderRadius: '12px',
                                        fontSize: '1.25rem', fontWeight: 900, boxShadow: `0 4px 10px ${shieldShadow}`
                                    }}>
                                        {score}/100
                                    </div>
                                    <span style={{ fontWeight: 800, color: labelColor, fontSize: '1.1rem' }}>{label}</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'center' }}>
                                <div style={{ background: '#f7f9f9', padding: '10px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f1419' }}>{stats.followers}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#536471', fontWeight: 500 }}>Followers</div>
                                </div>
                                <div style={{ background: '#f7f9f9', padding: '10px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f1419' }}>{stats.following}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#536471', fontWeight: 500 }}>Following</div>
                                </div>
                                <div style={{ background: '#f7f9f9', padding: '10px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f1419' }}>{stats.total_likes}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#536471', fontWeight: 500 }}>Likes Received</div>
                                </div>
                                <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{stats.total_dislikes}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Dislikes</div>
                                </div>
                            </div>
                        </div>

                        {/* Trending Sidebar */}
                        <TrendingSidebar />
                    </div>

                    {/* Right Column - Feed */}
                    <div className="profile-right">
                        
                        {/* Inline Post Creator details just for User */}
                        {user && user.id === pUser.id && (
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #eff3f4', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
                                        {user?.avatar ? (
                                            <img src={user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="You" />
                                        ) : (
                                            <span style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', color:'#9ca3af', fontWeight:700, fontSize:'1.2rem'}}>{user?.name?.[0]?.toUpperCase()}</span>
                                        )}
                                    </div>
                                    <textarea
                                        placeholder="What's on your mind? Post a meme..."
                                        value={uploadData.caption}
                                        onChange={e => setUploadData({ ...uploadData, caption: e.target.value })}
                                        style={{ width: '100%', minHeight: '60px', border: 'none', resize: 'none', outline: 'none', fontSize: '1.1rem', fontFamily: 'inherit', color: '#0f1419', paddingTop: '10px' }}
                                    />
                                </div>
                                
                                {uploadData.file && (
                                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eff3f4', margin: '10px 0 10px 52px' }}>
                                        <button onClick={() => setUploadData({...uploadData, file: null})} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                                            <FiX size={16} />
                                        </button>
                                        <img src={URL.createObjectURL(uploadData.file)} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} alt="Preview" />
                                    </div>
                                )}
                                
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid #eff3f4', marginLeft: '52px', marginTop: '10px' }}>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#ecfdf5'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                                            <FiImage size={22} /> Photo/Video
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setUploadData({...uploadData, file: e.target.files[0]})} />
                                        </label>
                                    </div>
                                    <button 
                                        onClick={handleUpload}
                                        disabled={!uploadData.file && !uploadData.caption.trim()}
                                        style={{ background: (!uploadData.file && !uploadData.caption.trim()) ? '#bbf7d0' : '#10b981', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: (!uploadData.file && !uploadData.caption.trim()) ? 'default' : 'pointer' }}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* User's Memes Feed */}
                        {profileData.memes.length === 0 ? (
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', color: '#6b7280', border: '1px solid #eff3f4' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No posts available.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {profileData.memes.filter(m => !hiddenMemes.includes(m.id)).map((meme, idx) => (
                                    <React.Fragment key={meme.id}>
                                    <div className="meme-card" data-id={meme.id} style={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #eff3f4',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            {/* Avatar */}
                                            <Link to={`/user/${meme.author_username}`} style={{ flexShrink: 0, textDecoration: 'none' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                    {meme.author_avatar ? (
                                                        <img src={meme.author_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af' }}>{meme.author_username?.[0]?.toUpperCase()}</span>
                                                    )}
                                                </div>
                                            </Link>
        
                                            {/* Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Link to={`/user/${meme.author_username}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                                            <span style={{ fontWeight: 800, color: '#0f1419', fontSize: '1rem' }}>{meme.author_name}</span>
                                                            <span style={{ color: '#536471', fontSize: '0.95rem' }}>@{meme.author_username}</span>
                                                            <span style={{ color: '#536471', fontSize: '0.95rem' }}>· {new Date(meme.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </Link>
                                                    
                                                    {/* Three-dots Menu */}
                                                    <div style={{ position: 'relative' }}>
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); setActiveMenu(activeMenu === meme.id ? null : meme.id); }}
                                                            style={{ background: 'transparent', border: 'none', color: '#536471', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
                                                        >
                                                            <FiMoreVertical size={18} />
                                                        </button>
                                                        {activeMenu === meme.id && (
                                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', right: 0, top: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '150px', zIndex: 10, border: '1px solid #eff3f4' }}>
                                                                <div onClick={() => handleHide(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#0f1419', fontSize: '0.95rem', fontWeight: 600 }}>
                                                                    <FiEyeOff size={16} /> Hide for me
                                                                </div>
                                                                {user && user.id != meme.user_id && (
                                                                    <div onClick={() => { setActiveMenu(null); setReportingMeme(meme); setReportReason([]); setReportDetails(''); }} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f91880', fontSize: '0.95rem', fontWeight: 600 }}>
                                                                        <FiAlertTriangle size={16} /> Report
                                                                    </div>
                                                                )}
                                                                {user && user.id == meme.user_id && (
                                                                    <div onClick={() => handleDelete(meme.id)} style={{ width: '100%', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f91880', fontSize: '0.95rem', fontWeight: 600 }}>
                                                                        <FiTrash2 size={16} /> Delete
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
        
                                                {/* Caption inside Formatter */}
                                                <div style={{ marginBottom: '12px', color: '#0f1419', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', marginTop: '4px' }}>
                                                    <PostTextFormatter text={meme.caption} />
                                                </div>
        
                                                {/* Image Link Frame */}
                                                <Link to={`/meme/${meme.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                                    <div style={{ borderRadius: '16px', border: '1px solid #eff3f4', overflow: 'hidden', marginTop: '10px' }}>
                                                        {meme.type === 'text' ? (
                                                            <div style={{ background: meme.bg_color || '#1d9bf0', color: '#fff', padding: '40px 20px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, fontFamily: meme.font || 'Inter' }}>
                                                                "{meme.caption}"
                                                            </div>
                                                        ) : (
                                                            <img src={meme.image_url} alt="Meme" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} loading="lazy" />
                                                        )}
                                                    </div>
                                                </Link>
        
                                                {/* Interactions Banner */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eff3f4' }}>
                                                    <button onClick={() => handleInteract(meme.id, 'like')} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: meme.has_liked ? '#f91880' : '#536471', fontSize: '0.9rem', fontWeight: 600 }}>
                                                        <FiHeart fill={meme.has_liked ? '#f91880' : 'none'} size={18} /> {meme.likes_count}
                                                    </button>
                                                    <button onClick={() => handleDislike(meme.id)} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: meme.has_disliked ? '#ef4444' : '#536471', fontSize: '0.9rem', fontWeight: 600 }}>
                                                        <FiThumbsDown fill={meme.has_disliked ? '#ef4444' : 'none'} size={18} /> {meme.dislikes_count || 0}
                                                    </button>
                                                    <Link to={`/meme/${meme.id}`} style={{ textDecoration: 'none' }}>
                                                        <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#536471', fontSize: '0.9rem', fontWeight: 600 }}>
                                                            <FiMessageCircle size={18} /> {meme.comments_count}
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => shareMeme(meme, 'copy')} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#536471', fontSize: '0.9rem', fontWeight: 600 }}>
                                                        <FiCopy size={18} /> Repost
                                                    </button>
                                                    <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#536471', fontSize: '0.9rem', fontWeight: 600 }}>
                                                        <FiEye size={18} /> {meme.views || 0}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Insert Ad every 3 memes */}
                                    {(idx + 1) % 3 === 0 && (
                                        <div style={{ marginTop: '10px' }}>
                                            <SimplisticAd />
                                        </div>
                                    )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
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
                            <button onClick={submitReport} className="glass-btn primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, background: '#f91880', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                Submit Report
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
