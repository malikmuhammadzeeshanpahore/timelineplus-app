import { useState, useEffect } from 'react'
import HomeNavbar from '../components/common/HomeNavbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    FiTrendingUp, FiDollarSign, FiUsers, FiCheckCircle, FiShield, FiSmartphone,
    FiGlobe, FiAward, FiClock, FiActivity, FiInstagram, FiYoutube, FiFacebook,
    FiPercent, FiMessageCircle, FiArrowRight, FiTarget, FiLock, FiHeart, FiZap,
    FiStar, FiCpu, FiThumbsUp, FiBarChart2, FiCamera, FiPlayCircle, FiShare2,
    FiUserCheck, FiRepeat, FiBriefcase
} from 'react-icons/fi'

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

function StatCounter({ value, label }) {
    const [count, setCount] = useState(0)
    const target = parseFloat(value.replace(/[^0-9.]/g, ''))
    const suffix = value.replace(/[0-9.]/g, '')
    useEffect(() => {
        let start = 0
        const steps = 40
        const increment = target / steps
        const timer = setInterval(() => {
            start += increment
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 30)
        return () => clearInterval(timer)
    }, [target])
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {count}{suffix}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: 6, fontWeight: 500 }}>{label}</div>
        </div>
    )
}

export default function Landing() {
    return (
        <div className="landing-page" style={{ overflow: 'hidden', background: '#fff' }}>
            <SEO
                title="TimelinePlus — Real Social Growth & Meme Economy"
                description="TimelinePlus is the #1 hybrid platform for social media promotion and meme economy. Earn money by completing tasks, sharing memes, and growing brands with real human engagement."
                keywords="earn money online, social media growth, meme economy, online tasks pakistan, social promotion"
            />
            <HomeNavbar />

            {/* ═══ HERO ═══ */}
            <section style={{
                minHeight: '100vh',
                paddingTop: '100px',
                background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '15%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,102,0,0.18), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,102,0,0.15)', border: '1px solid rgba(255,102,0,0.4)', color: '#ff9500', padding: '8px 22px', borderRadius: 50, fontWeight: 700, fontSize: '0.875rem', marginBottom: 30 }}>
                        <FiZap size={14} /> Social Promotion &bull; Micro Tasks &bull; Meme Economy
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 28, color: '#fff', WebkitTextFillColor: '#fff', background: 'none' }}>
                        Real Growth.<br />
                        <span style={{ background: 'linear-gradient(90deg, #ff6600, #ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real People.</span><br />
                        Real Earning.
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: 680, margin: '0 auto 44px', lineHeight: 1.7 }}>
                        TimelinePlus bridges professional <strong style={{ color: '#fff' }}>Social Media Promotion</strong> with a high-energy{' '}
                        <strong style={{ color: '#ff9500' }}>Meme Economy</strong>. Grow your brand with real humans or earn rewards for your time.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                        style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/offers">
                            <button style={{ padding: '16px 36px', fontSize: '1rem', background: 'linear-gradient(135deg, #ff6600, #ff9500)', border: 'none', borderRadius: 50, color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,102,0,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiTrendingUp /> Boost Social Media
                            </button>
                        </Link>
                        <Link to="/memes">
                            <button style={{ padding: '16px 36px', fontSize: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, color: '#fff', fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiCamera /> Explore Meme Feed
                            </button>
                        </Link>
                        <Link to="/register">
                            <button style={{ padding: '16px 36px', fontSize: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, color: '#fff', fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiUserCheck /> Join Free
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══ STATS STRIP ═══ */}
            <section style={{ background: 'linear-gradient(135deg, #ff6600, #ff9500)', padding: '50px 20px' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 30 }}>
                    <StatCounter value="50k+" label="Active Freelancers" />
                    <StatCounter value="1.2M+" label="Tasks Completed" />
                    <StatCounter value="5M+" label="USD Paid Out" />
                    <StatCounter value="99%" label="Satisfaction Rate" />
                </div>
            </section>

            {/* ═══ THREE PILLARS ═══ */}
            <section className="container" style={{ padding: '100px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,102,0,0.08)', border: '1px solid rgba(255,102,0,0.2)', color: '#ff6600', padding: '6px 18px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700, marginBottom: 16 }}>
                        <FiStar size={13} /> CORE PLATFORM
                    </div>
                    <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 14 }}>Three Pillars of TimelinePlus</h2>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>A balanced ecosystem for creators, earners, and meme lovers.</p>
                </div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24 }}>
                    {[
                        {
                            icon: <FiTrendingUp size={28} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',
                            title: 'Social Promotion',
                            desc: 'High-quality engagement from 100% real accounts. No bots, no drops — pure organic growth that lasts.'
                        },
                        {
                            icon: <FiBriefcase size={28} />, color: '#10b981', bg: 'rgba(16,185,129,0.08)',
                            title: 'Micro-Tasks',
                            desc: 'Earn real money by completing simple tasks — watching videos, liking posts, following pages, and trying apps.'
                        },
                        {
                            icon: <FiCamera size={28} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
                            title: 'Meme Economy',
                            desc: 'Get paid for your creativity. Post memes, build an audience, interact with the community, and earn Memoney.'
                        },
                    ].map((p, i) => (
                        <motion.div key={i} variants={fadeInUp} whileHover={{ y: -6 }}
                            style={{ background: '#fff', borderRadius: 20, padding: '36px 30px', boxShadow: '0 4px 25px rgba(0,0,0,0.07)', border: '1px solid #f3f4f6', transition: 'box-shadow 0.2s' }}>
                            <div style={{ width: 58, height: 58, background: p.bg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color, marginBottom: 22 }}>
                                {p.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                            <p style={{ color: '#6b7280', lineHeight: 1.7, fontSize: '0.95rem' }}>{p.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══ THE PROBLEM ═══ */}
            <section style={{ background: '#fafafa', padding: '80px 20px' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, marginBottom: 14 }}>The Problem with Other SMM Panels</h2>
                        <p style={{ color: '#6b7280', maxWidth: 560, margin: '0 auto' }}>Most "growth" services sell bot accounts that disappear in a week and damage your reach.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                        {[
                            { icon: <FiUsers size={24} />, color: '#ef4444', title: 'Fake Bot Accounts', desc: 'Zero-profile accounts instantly detected and removed by platforms.' },
                            { icon: <FiRepeat size={24} />, color: '#f59e0b', title: 'High Drop Rate', desc: 'Purchased followers drop by 80% within days of buying.' },
                            { icon: <FiLock size={24} />, color: '#8b5cf6', title: 'Account Risk', desc: 'High probability of shadowbans, strikes, or permanent suspension.' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: 50, height: 50, background: `${item.color}15`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: 18 }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 8 }}>{item.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FOR FREELANCERS ═══ */}
            <section className="container" style={{ padding: '100px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 16px', borderRadius: 50, fontWeight: 800, fontSize: '0.8rem', marginBottom: 20 }}>
                        <FiZap size={13} /> FOR FREELANCERS
                    </div>
                    <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>Turn Your Screen Time Into Cash</h2>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 30 }}>
                        Complete simple tasks like watching a video, liking a post, or following a page — and get paid instantly in USD.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                        {[
                            'Instant withdrawals to JazzCash & Easypaisa',
                            'No joining fees — 100% free to start',
                            'Earn Memoney from daily meme posts',
                            'Referral bonuses for every friend you invite',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#18181b', fontSize: '0.95rem' }}>
                                <div style={{ width: 22, height: 22, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FiCheckCircle size={13} color="#10b981" />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                    <Link to="/register?role=freelancer">
                        <button style={{ padding: '14px 30px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 25px rgba(16,185,129,0.35)' }}>
                            <FiArrowRight /> Start Earning Today
                        </button>
                    </Link>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 24, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 380 }}>
                    <img src="/illustrations/freelancer.svg" alt="Freelancer Dashboard" style={{ maxWidth: '90%', maxHeight: 300 }} />
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '100px 20px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,165,0,0.15)', border: '1px solid rgba(255,165,0,0.3)', color: '#ff9500', padding: '6px 18px', borderRadius: 50, fontWeight: 700, fontSize: '0.8rem', marginBottom: 20 }}>
                        <FiActivity size={13} /> SIMPLE PROCESS
                    </div>
                    <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, color: '#fff', WebkitTextFillColor: '#fff', background: 'none', marginBottom: 16, letterSpacing: '-1px' }}>How It Works</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 60, fontSize: '1.05rem' }}>Get started in minutes. No experience needed.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                        {[
                            { step: '01', icon: <FiUserCheck size={26} />, title: 'Register', desc: 'Create your free account as a freelancer or buyer in under 2 minutes.' },
                            { step: '02', icon: <FiShare2 size={26} />, title: 'Connect', desc: 'Link your social accounts or set up your first earning campaign.' },
                            { step: '03', icon: <FiThumbsUp size={26} />, title: 'Complete Tasks', desc: 'Freelancers complete tasks; Buyers see real engagement results.' },
                            { step: '04', icon: <FiDollarSign size={26} />, title: 'Get Paid', desc: 'Withdraw your earnings or watch your social profile grow.' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: '32px 24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <div style={{ color: 'rgba(255,102,0,0.6)', fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, lineHeight: 1 }}>{item.step}</div>
                                <div style={{ color: '#ff9500', marginBottom: 14 }}>{item.icon}</div>
                                <h3 style={{ color: '#fff', WebkitTextFillColor: '#fff', background: 'none', fontWeight: 800, marginBottom: 10, fontSize: '1.1rem' }}>{item.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FOR BUYERS ═══ */}
            <section className="container" style={{ padding: '100px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
                <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: 24, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 380 }}>
                    <img src="/illustrations/buyer.svg" alt="Buyer Analytics" style={{ maxWidth: '90%', maxHeight: 300 }} />
                </div>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '6px 16px', borderRadius: 50, fontWeight: 800, fontSize: '0.8rem', marginBottom: 20 }}>
                        <FiTarget size={13} /> FOR BUYERS
                    </div>
                    <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>Organic Growth That Actually Sticks</h2>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 30 }}>
                        Launch campaigns targeting specific demographics. Get real engagement from active users who genuinely interact with your content.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                        {[
                            'Target specific countries, cities, and interests',
                            'Set your own rates and budgets',
                            'Verify proof of work with evidence',
                            'No-drop guarantee on all orders',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#18181b', fontSize: '0.95rem' }}>
                                <div style={{ width: 22, height: 22, background: '#ede9fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FiCheckCircle size={13} color="#6366f1" />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                    <Link to="/register?role=buyer">
                        <button style={{ padding: '14px 30px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 25px rgba(99,102,241,0.35)' }}>
                            <FiArrowRight /> Create Campaign
                        </button>
                    </Link>
                </div>
            </section>

            {/* ═══ SUPPORTED PLATFORMS ═══ */}
            <section style={{ background: '#fafafa', padding: '60px 20px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', color: '#9ca3af', marginBottom: 30 }}>WORKS WITH ALL MAJOR PLATFORMS</p>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', flexWrap: 'wrap' }}>
                        <FiYoutube size={40} color="#FF0000" />
                        <FiInstagram size={40} color="#E1306C" />
                        <FiFacebook size={40} color="#1877F2" />
                        <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#000', letterSpacing: '-1px' }}>TikTok</div>
                        <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#1DA1F2', letterSpacing: '-1px' }}>Twitter/X</div>
                    </div>
                </div>
            </section>

            {/* ═══ SERVICES GRID ═══ */}
            <section className="container" style={{ padding: '80px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, marginBottom: 14 }}>Available Services</h2>
                    <p style={{ color: '#6b7280' }}>Everything you need to grow any social platform.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
                    {[
                        { icon: <FiPlayCircle />, label: 'YouTube Views', color: '#ef4444' },
                        { icon: <FiUsers />, label: 'YouTube Subscribers', color: '#ef4444' },
                        { icon: <FiCamera />, label: 'Instagram Followers', color: '#e1306c' },
                        { icon: <FiHeart />, label: 'Instagram Likes', color: '#e1306c' },
                        { icon: <FiUsers />, label: 'TikTok Followers', color: '#000' },
                        { icon: <FiThumbsUp />, label: 'Facebook Page Likes', color: '#1877f2' },
                        { icon: <FiUsers />, label: 'Twitter Follows', color: '#1da1f2' },
                        { icon: <FiGlobe />, label: 'Website Traffic', color: '#6366f1' },
                    ].map((s, i) => (
                        <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                            style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16, padding: '22px 16px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}>
                            <div style={{ fontSize: '1.5rem', color: s.color, marginBottom: 10 }}>{s.icon}</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══ WHY US ═══ */}
            <section style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '80px 20px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', WebkitTextFillColor: '#fff', background: 'none', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>Why We Are Different</h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: 30 }}>
                                We built a proprietary network of real verified users — not cheap bot farms. Every action comes from a genuine, active account.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { icon: <FiCheckCircle size={18} />, label: 'No Drop Guarantee on all orders', color: '#10b981' },
                                { icon: <FiShield size={18} />, label: '100% safe for your accounts', color: '#3b82f6' },
                                { icon: <FiMessageCircle size={18} />, label: '24/7 WhatsApp support', color: '#f59e0b' },
                                { icon: <FiDollarSign size={18} />, label: 'Money Back Guarantee', color: '#ef4444' },
                                { icon: <FiCpu size={18} />, label: 'AI-powered fraud detection', color: '#8b5cf6' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ color: item.color }}>{item.icon}</div>
                                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ TESTIMONIALS ═══ */}
            <section className="container" style={{ padding: '80px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, marginBottom: 14 }}>Community Stories</h2>
                    <p style={{ color: '#6b7280' }}>Real people, real results.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
                    {[
                        { name: 'Ali Khan', role: 'Freelancer', rating: 5, text: 'I earned $2,000 in my first month just by completing tasks in my free time. Best platform I have ever used.' },
                        { name: 'Sara Ahmed', role: 'YouTuber', rating: 5, text: 'Finally got real subscribers who watch my videos. My retention rate went up by 40% — no bots.' },
                        { name: 'Bilal Tech', role: 'Agency Owner', rating: 5, text: 'TimelinePlus is a game changer for SMM resellers. The quality is unmatched and delivery is fast.' },
                    ].map((t, i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                                {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} size={16} color="#f59e0b" fill="#f59e0b" />)}
                            </div>
                            <p style={{ color: '#374151', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 20, fontSize: '0.95rem' }}>"{t.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6600,#ff9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ FAQ ═══ */}
            <section style={{ background: '#fafafa', padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ textAlign: 'center', marginBottom: 50 }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, marginBottom: 14 }}>Frequently Asked Questions</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { q: 'Is this platform legit?', a: 'Yes, TimelinePlus is a registered platform connecting real verified users with businesses seeking social growth.' },
                            { q: 'How do I withdraw my earnings?', a: 'First withdrawal: exactly 500 PKR ≈ $1.80 (after 7 days & 3 referrals). Regular minimum: 750 PKR ≈ $2.70. Processed via JazzCash, EasyPaisa, NayaPay, or SadaPay within 24h.' },
                            { q: 'Can I use multiple accounts?', a: 'No. We enforce a strict one-account-per-person policy using device fingerprinting to ensure quality.' },
                            { q: 'Is it safe for my social accounts?', a: 'Absolutely. Since all engagement comes from real verified humans, it is 100% platform-safe.' },
                            { q: 'What is the Meme Economy?', a: 'Post memes daily, earn Memoney (our virtual currency), and redeem it for real rewards or profile badges.' },
                        ].map((faq, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #e5e7eb' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8, color: '#18181b' }}>{faq.q}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ WE ARE HIRING SECTION ═══ */}
            <section style={{ background: '#fff', padding: '100px 20px', textAlign: 'center' }}>
                <div className="container" style={{
                    background: 'linear-gradient(135deg, #ff6600, #ff9500)',
                    padding: '60px 40px',
                    borderRadius: 30,
                    boxShadow: '0 20px 40px rgba(255,102,0,0.2)',
                    color: '#fff'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: 15, letterSpacing: '-1px', color: '#fff', WebkitTextFillColor: '#fff', background: 'none' }}>We Are Hiring</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: 30, opacity: 0.9, maxWidth: 600, margin: '0 auto 30px' }}>
                            Working with 30+ monthly clients requires elite talent. Are you an SEO specialist, Content Writer, or Developer? Join us!
                        </p>
                        <Link to="/hiring">
                            <button style={{
                                padding: '16px 40px',
                                background: '#000',
                                color: '#fff',
                                borderRadius: 50,
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                            }}>
                                <FiBriefcase /> View Open Roles
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="container" style={{ padding: '60px 20px 120px' }}>
                <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', borderRadius: 28, padding: '70px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(255,102,0,0.2), transparent 60%)', pointerEvents: 'none' }} />
                    <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', WebkitTextFillColor: '#fff', background: 'none', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-1px', position: 'relative' }}>
                        Ready to Get Started?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 36, fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 36px', position: 'relative' }}>
                        Join 50,000+ users changing the way social media grows.
                    </p>
                    <Link to="/register" style={{ position: 'relative' }}>
                        <button style={{ padding: '18px 50px', fontSize: '1.1rem', background: 'linear-gradient(135deg,#ff6600,#ff9500)', border: 'none', borderRadius: 50, color: '#fff', fontWeight: 900, cursor: 'pointer', boxShadow: '0 12px 35px rgba(255,102,0,0.5)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <FiArrowRight /> Create Free Account
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
