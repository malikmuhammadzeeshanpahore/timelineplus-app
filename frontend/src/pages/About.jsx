import HomeNavbar from '../components/common/HomeNavbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { FiUsers, FiTarget, FiAward, FiShield, FiHeart, FiGlobe } from 'react-icons/fi'

export default function About() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const teamMembers = [
        { name: 'Zeeshan', role: 'Founder & CEO', icon: <FiUsers /> },
        { name: 'Sarah', role: 'Lead Design', icon: <FiHeart /> },
        { name: 'Ahmed', role: 'Tech Lead', icon: <FiGlobe /> },
        { name: 'Fatima', role: 'Support Head', icon: <FiShield /> },
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', overflowX: 'hidden', color: '#18181b' }}>
            <SEO
                title="About Us - Our Mission & Vision"
                description="Learn more about TimelinePlus, our mission to empower digital workers, and the team behind the #1 online earning platform in Pakistan."
            />
            <HomeNavbar />

            {/* 1. Hero Section */}
            <section className="container" style={{ paddingTop: '150px', marginBottom: '80px', textAlign: 'center' }}>
                <motion.h1
                    className="text-gradient"
                    style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 900 }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    Redefining Social Earnings
                </motion.h1>
                <motion.p
                    style={{ fontSize: '1.2rem', color: '#52525b', maxWidth: '700px', margin: '0 auto' }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    TimelinePlus is more than a platform; it's a movement to democratize digital growth in Pakistan and beyond.
                </motion.p>
            </section>

            {/* 2. Our Story */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <motion.div className="glass-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="heading" style={{ color: '#18181b' }}>Our Origin Story</h2>
                    <p style={{ color: '#52525b' }}>
                        Started in 2024, TimelinePlus was born from a simple idea: meaningful social interactions should be rewarded.
                        We saw a gap between brands needing authentic engagement and users spending hours on social media without return.
                        TimelinePlus bridges this gap with transparency and trust.
                    </p>
                </motion.div>
            </section>

            {/* 3. Why We Exist */}
            <section className="container" style={{ marginBottom: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <motion.div className="glass-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="heading" style={{ color: '#18181b' }}>Mission</h2>
                    <p style={{ color: '#52525b' }}>To empower 1 Million digital workers by 2030 with sustainable income opportunities through social media tasks.</p>
                </motion.div>
                <motion.div className="glass-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="heading" style={{ color: '#18181b' }}>Vision</h2>
                    <p style={{ color: '#52525b' }}>A world where digital value exchange is instant, transparent, and accessible to everyone with a smartphone.</p>
                </motion.div>
            </section>

            {/* 4. Core Values */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', color: '#18181b' }}>Our Core Values</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {['Trust First', 'Community Led', 'Innovation Driven', 'User Centric'].map((val, i) => (
                        <motion.div key={i} className="glass-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <h3 className="heading" style={{ color: '#18181b' }}>{val}</h3>
                            <p style={{ color: '#52525b' }}>We uphold {val.toLowerCase()} in every decision we make.</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. Team Section */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', color: '#18181b' }}>Meet the Minds</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                    {teamMembers.map((member, i) => (
                        <motion.div key={i} className="glass-card" style={{ alignItems: 'center', textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <div style={{ fontSize: '3rem', color: '#ff6600', marginBottom: '10px' }}>{member.icon}</div>
                            <h3 className="heading" style={{ color: '#18181b' }}>{member.name}</h3>
                            <p style={{ color: '#12d1c6' }}>{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. Achievements */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <div className="glass-card" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 'bold' }}>50k+</h2>
                        <p style={{ color: '#52525b' }}>Users</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 'bold' }}>$200k</h2>
                        <p style={{ color: '#52525b' }}>Paid Out</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 'bold' }}>98%</h2>
                        <p style={{ color: '#52525b' }}>Satisfaction</p>
                    </div>
                </div>
            </section>

            {/* 6.5 Trust & Compliance */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <div className="glass-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h2 className="heading mb-4 text-center" style={{ color: '#18181b' }}>Trust & Safety</h2>
                    <p className="text-muted text-center" style={{ maxWidth: '700px', margin: '0 auto 30px', color: '#52525b' }}>
                        We are committed to maintaining a safe, transparent, and compliant ecosystem for all users.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div style={{ padding: '20px', borderLeft: '3px solid #ff6600', background: '#fcfcfc' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#18181b' }}>Google AdSense Compliant</h3>
                            <p className="text-muted" style={{ color: '#52525b' }}>We adhere to strict quality content guidelines and ensure our traffic sources are 100% human and organic. We do not use bot traffic.</p>
                        </div>
                        <div style={{ padding: '20px', borderLeft: '3px solid #10b981', background: '#fcfcfc' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#18181b' }}>Secure OAuth</h3>
                            <p className="text-muted" style={{ color: '#52525b' }}>Your security is paramount. We use official Google & Facebook APIs for authentication. We never see or store your passwords.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Partners */}
            <section className="container" style={{ marginBottom: '80px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '40px', color: '#18181b' }}>Trusted By</h2>
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['YouTube', 'Instagram', 'TikTok', 'Facebook'].map(p => (
                        <div key={p} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.3)' }}>{p}</div>
                    ))}
                </div>
            </section>

            {/* 8. Call to Action */}
            <section className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <motion.div className="glass-card" style={{ padding: '60px', alignItems: 'center', textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="heading" style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#18181b' }}>Ready to Join?</h2>
                    <p style={{ marginBottom: '30px', color: '#52525b' }}>Be part of the fastest growing social earning platform.</p>
                    <button className="glass-btn secondary" style={{ color: '#fff', background: 'linear-gradient(135deg, #ff6600 0%, #ff8e53 100%)' }}>Get Started Now</button>
                </motion.div>
            </section>
        </div>
    )
}
