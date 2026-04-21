import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import HomeNavbar from '../components/common/HomeNavbar'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiUser, FiTag, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import SEO from '../components/common/SEO'

export default function BlogDetail() {
    const { slug } = useParams()
    const { user, isAuthenticated } = useAuthStore()
    const { addToast } = useToastStore()
    const location = useLocation()

    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    // Task Tracking
    const taskId = new URLSearchParams(location.search).get('offer_id') || new URLSearchParams(location.search).get('task_id')
    const utmSource = new URLSearchParams(location.search).get('utm_source')

    const [timeLeft, setTimeLeft] = useState(() => {
        if (taskId && utmSource === 'offer') {
            const saved = localStorage.getItem(`blog_task_${taskId}_progress`);
            if (saved !== null && !isNaN(saved)) {
                return parseInt(saved, 10);
            }
        }
        return 300; // 300 seconds = 5 mins
    })

    const [isClaimable, setIsClaimable] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!taskId || !isAuthenticated || isClaimable || utmSource !== 'offer') return;

        if (timeLeft <= 0) {
            setIsClaimable(true);
            return;
        }

        const startTimer = () => {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        setIsClaimable(true)
                        localStorage.removeItem(`blog_task_${taskId}_progress`)
                        return 0
                    }
                    if ((prev - 1) % 5 === 0) {
                        localStorage.setItem(`blog_task_${taskId}_progress`, (prev - 1).toString())
                    }
                    return prev - 1
                })
            }, 1000)
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Pause timer if user leaves tab
                clearInterval(timerRef.current)
                addToast('info', 'Task timer paused. Keep reading the blog to finish verification.')
            } else {
                // Resume
                startTimer()
            }
        }

        // Start initially
        startTimer()
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            clearInterval(timerRef.current)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [taskId, isAuthenticated, isClaimable])

    const handleClaimReward = async () => {
        if (!user || !taskId) return;
        setClaiming(true);
        try {
            const res = await fetch('https://timelineplus.site/api/campaign/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, campaignId: taskId })
            });
            const data = await res.json();
            if (res.ok) {
                // Amazing popup via toast/alert
                addToast('success', '🎉 Amazing! You successfully read the blog and earned $0.01.');

                // Remove task details from URL (clean up)
                window.history.replaceState({}, '', `/blog/${slug}`);
                localStorage.removeItem(`blog_task_${taskId}_progress`);

                // Hide banner
                setIsClaimable(false);
                setTimeLeft(-1); // to hide basically
            } else {
                if (data.error === 'You have already completed this task') {
                    addToast('info', 'You have already earned the reward for this blog.');
                    window.history.replaceState({}, '', `/blog/${slug}`);
                    localStorage.removeItem(`blog_task_${taskId}_progress`);
                    setTimeLeft(-1);
                } else {
                    addToast('error', data.error || 'Failed to claim reward. Please try again.');
                }
            }
        } catch (e) {
            addToast('error', 'Network error. Could not claim reward.');
        } finally {
            setClaiming(false);
        }
    }

    useEffect(() => {
        fetch(`https://timelineplus.site/api/blogs/${slug}`)
            .then(res => res.json())
            .then(data => {
                setBlog(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })

        return () => {
            const schemaScript = document.getElementById('blog-schema');
            if (schemaScript) schemaScript.remove();
        }
    }, [slug])

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: 'white' }}>Loading article...</div>
    if (!blog) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: 'white' }}>Blog not found.</div>

    return (
        <div style={{ minHeight: '100vh', padding: '100px 20px 60px', background: '#09090b' }} className="container">
            {blog && (
                <SEO
                    title={blog.meta_title || blog.title}
                    description={blog.meta_description}
                    injectAd={true}
                />
            )}
            {isAuthenticated ? <Navbar /> : <HomeNavbar />}

            {/* Task Tracking Banner */}
            <AnimatePresence>
                {taskId && isAuthenticated && timeLeft >= 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        style={{
                            position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)',
                            background: isClaimable ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(20,20,20,0.95)',
                            padding: '16px 32px', borderRadius: '50px', zIndex: 1000,
                            border: isClaimable ? 'none' : '1px solid #ff6c0c',
                            display: 'flex', alignItems: 'center', gap: '20px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)', color: 'white', fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {isClaimable ? (
                            <>
                                <FiCheckCircle style={{ fontSize: '1.5rem', color: 'white' }} />
                                <span style={{ fontSize: '1.1rem' }}>Task Complete!</span>
                                <button
                                    onClick={handleClaimReward}
                                    disabled={claiming}
                                    className="glass-btn"
                                    style={{ background: 'white', color: '#10b981', border: 'none', padding: '8px 20px', fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    {claiming ? 'Claiming...' : 'Claim $0.01 Reward'}
                                </button>
                            </>
                        ) : (
                            <>
                                <FiClock style={{ color: '#ff6c0c', fontSize: '1.5rem' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.1rem' }}>Reading Task: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#ff6c0c', fontWeight: 'normal' }}>Read carefully to pass verification. Do not switch tabs.</span>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <article style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '40px' }}
                >
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span className="badge secondary">{blog.category}</span>
                        <div style={{ display: 'flex', gap: '15px', color: '#aaa', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiCalendar /> {new Date(blog.created_at).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiUser /> Admin</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiClock /> 5 min read</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px', color: 'white' }}>{blog.title}</h1>
                </motion.header>

                {(blog.image_url || true) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <img src={blog.image_url || 'https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?auto=format&fit=crop&q=80&w=1000'} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.9)',
                    }}
                />

                {/* FAQs Section */}
                {blog.faqs && blog.faqs.length > 0 && (
                    <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff6c0c' }}><FiTag /> Frequently Asked Questions</h2>
                        <div style={{ display: 'grid', gap: '25px' }}>
                            {blog.faqs.map((faq, i) => (
                                <div key={i}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '10px', fontWeight: 700 }}>{faq.q}</h3>
                                    <p style={{ opacity: 0.8 }}>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Custom Blog Scoped Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .blog-content h2 { margin-top: 40px; margin-bottom: 20px; font-weight: 800; color: #ff6c0c; font-size: 2rem; }
                .blog-content h3 { margin-top: 30px; margin-bottom: 15px; font-weight: 700; color: white; font-size: 1.5rem; }
                .blog-content p { margin-bottom: 25px; }
                .blog-content ul { margin-bottom: 25px; padding-left: 20px; color: rgba(255,255,255,0.8); }
                .blog-content li { margin-bottom: 10px; }
                .blog-content img { max-width: 100%; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(255,255,255,0.1); display: block; }
                .blog-content a { color: #ff6c0c; text-decoration: underline; }
                .blog-content blockquote { border-left: 4px solid #ff6c0c; padding-left: 20px; font-style: italic; margin: 30px 0; opacity: 0.9; }
            ` }} />
        </div>
    )
}
